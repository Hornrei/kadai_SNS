import base64
import secrets
from flask import (
    Flask,
    request,
    redirect,
    url_for,
    render_template,
    session,
    flash,
    Blueprint,
    request,
)
import webauthn
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_oauth2 import AuthorizationServer
from authlib.integrations.sqla_oauth2 import (
    OAuth2ClientMixin,
    OAuth2AuthorizationCodeMixin,
    OAuth2TokenMixin,
    create_bearer_token_validator,
    create_query_client_func,
    create_save_token_func,
    create_revocation_endpoint,
)
from authlib.oidc.core import UserInfo
from authlib.oauth2.rfc6749 import grants
from werkzeug.security import gen_salt
from datetime import datetime, timedelta

import os
from authlib.oidc.core.grants import (
    OpenIDCode as _OpenIDCode,
    OpenIDImplicitGrant as _OpenIDImplicitGrant,
    OpenIDHybridGrant as _OpenIDHybridGrant,
)

import mimetypes
import hashlib
import secrets

import os

mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("text/css", ".css")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = secrets.token_hex(16)
db = SQLAlchemy(app)


DUMMY_JWT_CONFIG = {
    "key": "hewpj_auth_secret_dayodayo",
    "alg": "HS256",
    "iss": f"https://auth.{os.environ["FRONTEND_HOST"]}/",
    "exp": 3600,
}


def generate_user_info(user, scope):
    return UserInfo(sub=str(user.id), name=user.username)


class OpenIDCode(_OpenIDCode):

    def get_jwt_config(self, grant):
        return DUMMY_JWT_CONFIG

    def generate_user_info(self, user, scope):
        return generate_user_info(user, scope)

    def exists_nonce(request, nonce, req):
        exists = OAuth2AuthorizationCode.query.filter_by(
            client_id=req.client_id, nonce=nonce
        ).first()
        return bool(exists)

    def validate_nonce(self, nonce, request):
        # Nonceの検証をスキップし、常にTrueを返す
        return True


# class OpenIDCOde(grants.)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40))
    password = db.Column(db.String())
    credential_id = db.Column(db.String())
    credential_public_key = db.Column(db.LargeBinary())
    sign_count = db.Column(db.Integer())

    # ユーザーモデルの他のフィールドをここに追加...
    def get_user_id(self):
        return self.id


class OAuth2Client(db.Model, OAuth2ClientMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))


class OAuth2AuthorizationCode(db.Model, OAuth2AuthorizationCodeMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))


class OAuth2Token(db.Model, OAuth2TokenMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))


# トークンの検証を設定
bearer_token_validator = create_bearer_token_validator(OAuth2Token, db.session)


class AuthorizationCodeGrant(grants.AuthorizationCodeGrant):
    def save_authorization_code(self, code, request):
        print(request)
        auth_code = OAuth2AuthorizationCode(
            code=code,
            client_id=request.client.client_id,
            redirect_uri=request.redirect_uri,
            scope=request.scope,
            user_id=request.user.id,
            nonce=request.data.get("nonce"),
            # expires=datetime.utcnow() + timedelta(minutes=5),
        )
        db.session.add(auth_code)
        db.session.commit()
        return code

    def query_authorization_code(self, code, client):
        item = OAuth2AuthorizationCode.query.filter_by(
            code=code, client_id=client.client_id
        ).first()
        if item and not item.is_expired():
            return item

    def delete_authorization_code(self, authorization_code):
        db.session.delete(authorization_code)
        db.session.commit()

    def authenticate_user(self, authorization_code):
        return User.query.get(authorization_code.user_id)


authorization = AuthorizationServer(
    app,
    query_client=create_query_client_func(db.session, OAuth2Client),
    save_token=create_save_token_func(db.session, OAuth2Token),
)
authorization.register_grant(AuthorizationCodeGrant, [OpenIDCode(require_nonce=True)])


@app.route("/authorize", methods=["GET", "POST"])
def authorize():
    user = current_user()  # 現在のユーザーを取得する関数

    # ログインしていない場合の処理
    if not user:
        return redirect(url_for("login", **request.args))

    if request.method == "GET":
        print(request.args)
        grant = authorization.get_consent_grant(end_user=user)

        return render_template(
            "authorize.html", user=user, request=request, grant=grant
        )

    if user:
        user = User.query.filter_by(username=user).first()

    if request.form["confirm"] == "yes":
        # ユーザーが認可を承認した場合
        grant_user = user
    else:
        # ユーザーが認可を拒否した場合
        session.pop("user_id", None)
        return redirect(f"https://{os.environ["FRONTEND_HOST"]}/login")

    return authorization.create_authorization_response(
        request=request, grant_user=grant_user
    )


@app.route("/token", methods=["POST"])
def issue_token():
    print(request.get_data())
    return authorization.create_token_response()


@app.route("/revoke", methods=["POST"])
def revoke_token():
    token = OAuth2Token.query.filter_by(access_token=request.form["token"]).first()
    if token:
        db.session.delete(token)
        db.session.commit()
    return "", 200


@app.route("/login", methods=["GET", "POST"])
def login():
    print(request.form)
    if request.method == "POST":
        username = request.form.get("username")
        password = hashlib.sha256(request.form.get("password").encode()).hexdigest()
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session["user_id"] = user.id
            return redirect(url_for("authorize", **request.form))
        else:
            flash("無効なユーザー名またはパスワード")
    if request.args.get("username"):
        return render_template(
            "login/user_check.html",
            username=request.args.get("username"),
            args=request.args,
        )
    else:
        return render_template("login/login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        if request.args.get("username"):
            return render_template(
                "signup/register.html",
                username=request.args.get("username"),
                args=request.args,
            )
        else:
            return render_template("signup/signup.html")
    if request.method == "POST":
        username = request.form.get("username")
        password = hashlib.sha256(request.form.get("password").encode()).hexdigest()
        # password = request.form.get("password")
        # ユーザーをデータベースに保存
        user = User(username=username, password=password)
        db.session.add(user)
        db.session.commit()

        session["user_id"] = user.id
        payload = dict(request.form)
        # payload からpasswordを削除
        del payload["password"]
        return redirect(url_for("authorize", **payload))


@app.post("/api/signinRequest")
def optins():
    session["challenge"] = gen_challenge()
    return {
        "publicKey": {
            "challenge": session["challenge"],
            "timeout": 300000,
            "extensions": {},
            "allowCredentials": [],
            "userVerification": "required",
        },
        "mediation": "conditional",
    }


@app.post("/api/signinResponse")
def signin_response():
    data = request.json
    # cred = get_user_id(data["id"])
    print(data)

    user = User.query.filter_by(credential_id=data["id"]).first()
    print(user.credential_id)

    auth = webauthn.verify_authentication_response(
        credential=data,
        expected_challenge=decode_challenge(session["challenge"]),
        expected_origin=f"https://auth.{os.environ["FRONTEND_HOST"]}",
        expected_rp_id=f"auth.{os.environ["FRONTEND_HOST"]}",
        credential_public_key=user.credential_public_key,
        credential_current_sign_count=user.sign_count,
        require_user_verification=False,
    )
    update_sign_count(user.credential_id, auth.new_sign_count)
    session["user_id"] = user.id
    return {"status": "ok"}


@app.post("/api/registerRequest")
def register_request():
    session["challenge"] = gen_challenge()
    req = request.args
    name = req.get("name")
    return {
        "publicKey": {
            "rp": {"name": "Campection", "id": f"auth.{os.environ["FRONTEND_HOST"]}"},
            "user": {
                "name": name,
                "displayName": name,
                "id": base64.urlsafe_b64encode(secrets.token_hex(10).encode()).decode(),
            },
            "challenge": session["challenge"],
            "timeout": 300000,
            "attestation": "indirect",
            "pubKeyCredParams": [
                {"type": "public-key", "alg": -7},
                {"type": "public-key", "alg": -257},
            ],
            "authenticatorSelection": {
                "residentKey": "preferred",
                "requireResidentKey": False,
                "userVerification": "preferred",
            },
        }
    }


@app.post("/api/registerResponse")
def register_response():
    req = request.args
    name = req.get("name")
    data = request.json

    auth = webauthn.verify_registration_response(
        credential=data,
        expected_challenge=decode_challenge(session["challenge"]),
        expected_origin=f"https://auth.{os.environ["FRONTEND_HOST"]}",
        expected_rp_id=f"auth.{os.environ["FRONTEND_HOST"]}",
        supported_pub_key_algs=[-7, -257],
        require_user_verification=False,
    )
    if auth.sign_count == 0:
        # add_new_user(name, base64.urlsafe_b64encode(auth.credential_id).decode().replace("=",""), auth.credential_public_key, auth.sign_count)
        user = User(
            username=name,
            credential_id=base64.urlsafe_b64encode(auth.credential_id)
            .decode()
            .replace("=", ""),
            credential_public_key=auth.credential_public_key,
            sign_count=auth.sign_count,
        )
        db.session.add(user)
        db.session.commit()
        session["user_id"] = user.id
        return {"status": "ok"}


def update_sign_count(credential_id, sign_count):
    user = User.query.filter_by(credential_id=credential_id).first()
    user.sign_count = sign_count
    db.session.commit()


def gen_challenge():
    return base64.urlsafe_b64encode(secrets.token_hex(32).encode()).decode()


def decode_challenge(challenge):
    return base64.urlsafe_b64decode(challenge)


def current_user():
    if "user_id" in session:
        user_id = session["user_id"]
        return db.session.get(User, user_id).username
    return None


def add_client():
    client = OAuth2Client(
        client_id="Campection_auth",
        client_secret="hewpj_auth_secret_dayodayo",
        client_id_issued_at=int(datetime.now().timestamp()),
        user_id=1,
    )
    client.set_client_metadata(
        {
            "client_name": "Campection",
            "client_uri": f"https://api.{os.environ["FRONTEND_HOST"]}/api/v1/auth/login/callback/hew",
            "grant_types": ["authorization_code"],
            "redirect_uris": [
                f"https://api.{os.environ["FRONTEND_HOST"]}/api/v1/auth/login/callback/hew"
            ],
            "response_types": ["code"],
            "scope": "openid",
            "token_endpoint_auth_method": "client_secret_basic",
        },
    )
    db.session.add(client)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()
        db.session.add(
            User(
                username="user1",
                password=hashlib.sha256("password1".encode()).hexdigest(),
            )
        )
        add_client()
        db.session.commit()
    app.run(debug=True, port=8080, host="localhost")
