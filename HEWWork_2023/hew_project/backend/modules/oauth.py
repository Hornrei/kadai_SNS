import base64
import os
import json

import dotenv
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

dotenv.load_dotenv()


def convert_hs256jwks(secret: str) -> dict:
    return {
        "keys": [
            {
                "kty": "oct",
                "alg": "HS256",
                "k": base64.urlsafe_b64encode(secret.encode("utf-8"))
                .decode("utf-8")
                .rstrip("="),
            }
        ]
    }


oauth = OAuth()

oauth.register(
    "google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid",
    },
)

oauth.register(
    "line",
    client_id=os.getenv("LINE_CHANNEL_ID"),
    client_secret=os.getenv("LINE_CHANNEL_SECRET"),
    client_kwargs={
        "scope": "openid",
    },
    token_endpoint="https://api.line.me/oauth2/v2.1/token",
    authorize_url="https://access.line.me/oauth2/v2.1/authorize",
    id_token_signing_alg_values_supported=["HS256"],
    jwks=convert_hs256jwks(os.getenv("LINE_CHANNEL_SECRET")),
)

oauth.register(
    "hew",
    client_id="Campection_auth",
    client_secret="hewpj_auth_secret_dayodayo",
    client_kwargs={
        "scope": "openid",
    },
    authorize_url=f"https://auth.{os.environ["FRONTEND_HOST"]}/authorize",
    token_endpoint=f"https://auth.{os.environ["FRONTEND_HOST"]}/token",
    id_token_signing_alg_values_supported=["HS256"],
    jwks=convert_hs256jwks("hewpj_auth_secret_dayodayo"),
    client_auth_methods_supported=["client_secret_post"],
)

def parse_request(request):
    if isinstance(request, str):
        token = json.loads(request.replace("'", '"'))
        return token
    token_provider = request.cookies.get("token_provider")
    token = request.cookies.get("token_id")
    token = json.loads(token.replace("'", '"'))
    return token, token_provider

DUMMY_TOKEN_USER01 = {
    "sub": "user01dummy",
}
DUMMY_TOKEN_USER02 = {
    "sub": "user02dummy",
}
DUMMY_TOKEN_USER03 = {
    "sub": "user03dummy",
}

async def response_dumy_token(user):
    if user == "user01":
        return  DUMMY_TOKEN_USER01
    elif user == "user02":
        return  DUMMY_TOKEN_USER02
    elif user == "user03":
        return  DUMMY_TOKEN_USER03


def token_check(token, token_provider):
    if token_provider == "google":
        return oauth.google.parse_id_token(token, nonce=None)
    elif token_provider == "line":
        return oauth.line.parse_id_token(token, nonce=None)
    elif token_provider == "hew":
        return oauth.hew.parse_id_token(token, nonce=None)
    if os.getenv("LOGIN_BYPASS")  and token_provider == "dummy":
        return response_dumy_token(token["user"])
    else:
        raise ValueError(args="token_provider is not found")

