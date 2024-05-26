import sqlite3
import pymysql
import os


# あたらしいやつ！ mysql
class DBOP:
    def __init__(self):
        self.conn = pymysql.connect(host=os.environ["DB_HOST"], port=3306, user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], database="main")
        self.c = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    def get_user_following(self, user_id, count, offset):
        self.c.execute(
            "SELECT u.user_id, u.user_name, u.icon_url FROM follows f JOIN users u ON f.to_user_id = u.user_id WHERE f.from_user_id = %s LIMIT %s OFFSET %s"
        , (user_id, count, offset))
        return self.c.fetchall()

    def get_user_follower(self, user_id, count, offset):
        self.c.execute(
            "SELECT u.user_id, u.user_name, u.icon_url FROM follows f JOIN users u ON f.from_user_id = u.user_id WHERE f.to_user_id = %s LIMIT %s OFFSET %s"
        , (user_id, count, offset))
        return self.c.fetchall()

    def user_register(self, id, name, icon, sub, provider):
        self.c.execute(
            "INSERT INTO users VALUES (%s,%s,'dummy@example.example',%s,%s,%s,null,CURRENT_TIMESTAMP)",
            (id, name,  icon, sub, provider),
        )

    # ユーザーアイコンの変更(追加)
    def change_user_icon(self, user_id, icon_url):
        self.c.execute("UPDATE users SET icon_url = %s WHERE user_id = %s", (icon_url, user_id))
    
    def confirm_post(self, postID):
        self.c.execute("SELECT COUNT(*) FROM posts WHERE post_id = %s", (postID,))
        return self.c.fetchone()[0] > 0
    
    def confirm_id(self, id):
        self.c.execute("SELECT COUNT(*) FROM users WHERE user_id = %s", (id,))
        return self.c.fetchone()[0] > 0
    
    def confirm_sub(self, sub):
        self.c.execute("SELECT COUNT(*) FROM users WHERE sub = %s", (sub,))
        return self.c.fetchone()[0] > 0
    
    def get_user_id(self, sub):
        self.c.execute("SELECT user_id FROM users WHERE sub = %s", (sub,))
        return self.c.fetchone()[0]
    
    def get_user_icon(self, user_id):
        self.c.execute("SELECT icon_url FROM users WHERE user_id = %s", (user_id,))
        return self.c.fetchone()[0]
    
    def get_user_name(self, user_id):
        self.c.execute("SELECT user_name FROM users WHERE user_id = %s", (user_id,))
        return self.c.fetchone()[0]
    

    def get_flower_count(self, userID):
        self.c.execute("SELECT COUNT(*) FROM follows WHERE to_user_id = %s", (userID,))
        return self.c.fetchone()[0]
    
    def get_following_count(self, userID):
        self.c.execute("SELECT COUNT(*) FROM follows WHERE from_user_id = %s", (userID,))
        return self.c.fetchone()[0]
    
    def follow_user(self, from_user_id, to_user_id):
        self.c.execute("INSERT INTO follows VALUES (%s,%s,CURRENT_TIMESTAMP)", (from_user_id, to_user_id))
    
    def unfollow_user(self, from_user_id, to_user_id):
        self.c.execute("DELETE FROM follows WHERE from_user_id = %s AND to_user_id = %s", (from_user_id, to_user_id))
    
    def create_post(self, post_id,user_id, image_url, content):
        self.c.execute("INSERT INTO posts VALUES (%s,%s,%s,null,null,CURRENT_TIMESTAMP,%s)", (post_id,user_id,  content,image_url))
    
    def get_post_list(self, count, offset,user_id):
        """
        一時的
        """
        print(user_id)
        if user_id is None:
            self.c.execute("SELECT post_id, user_id, content, image_url, timestamp,comment_id FROM posts WHERE comment_id IS NULL ORDER BY timestamp DESC LIMIT %s OFFSET %s", (count, offset))
        else:
            self.c.execute("SELECT post_id, user_id, content, image_url, timestamp,comment_id FROM posts WHERE comment_id IS NULL AND user_id = %s ORDER BY timestamp DESC LIMIT %s OFFSET %s", (user_id, count, offset))
        
        return self.c.fetchall()
    
    def is_fav(self, post_id, user_id):
        self.c.execute("SELECT COUNT(*) FROM favorites WHERE post_id = %s AND to_user_id = %s", (post_id, user_id))
        return self.c.fetchone()[0] > 0
    
    def get_post(self, post_id):
        self.c.execute("SELECT post_id, user_id, content, image_url, timestamp FROM posts WHERE post_id = %s", (post_id,))
        return self.c.fetchone()
    
    def set_user_name(self, user_id, user_name):
        self.c.execute("UPDATE users SET user_name = %s WHERE user_id = %s", (user_name, user_id))
    
    # postIDからuserIDを取得
    def get_id_from_postID(self, postID): 
        self.c.execute("SELECT user_id FROM posts WHERE post_id = %s", (postID,))
        return self.c.fetchone()[0]   

    # 名前からidを取得
    def get_user_id_from_name(self, user_name):
        self.c.execute("SELECT user_id FROM users WHERE user_name = %s", (user_name,))
        return self.c.fetchone()
    
    def comment_posts(self, postID, userID, content, commentID, imageUrl):
        self.c.execute("INSERT INTO posts VALUES (%s, %s, %s, %s, null, CURRENT_TIMESTAMP, %s);", (postID, userID, content, commentID, imageUrl))

    def delete_posts(self, postID, userID):
        self.c.execute("DELETE FROM posts WHERE post_id = %s AND user_id = %s;", (postID, userID))
    
    # ふぁぼする
    def favorite_posts(self, postID, userID):
        self.c.execute("INSERT INTO favorites VALUES (%s,%s,CURRENT_TIMESTAMP);", (postID, userID))
    
    # ふぁぼけす
    def unfavorite_posts(self, postID, userID):
        self.c.execute("DELETE FROM favorites WHERE post_id = %s AND to_user_id = %s;", (postID, userID))

    # ふぁぼカウント
    def get_favorite_cnt(self, postID):
        self.c.execute("SELECT COUNT(*) FROM favorites WHERE post_id = %s", (postID,))
        return self.c.fetchone()[0]
    
    # ふぁぼリスト
    def get_favorite_list(self, postID,):
        self.c.execute(
            "SELECT u.user_id, u.user_name FROM favorites f JOIN users u ON f.to_user_id = u.user_id WHERE post_id = %s"
        , (postID))
        # self.c.execute("SELECT to_user_id FROM favorites WHERE post_id = %s", (postID,))
        return self.c.fetchall()

    # コメントの取得
    def get_comment(self, postID): 
        self.c.execute("SELECT post_id, user_id, content, image_url, timestamp FROM posts WHERE comment_id = %s", (postID,))
        return self.c.fetchall()
    
    # コメント数
    def get_commentCnt(self, postID): 
        self.c.execute("select count(*) from posts where comment_id = %s", (postID,))
        return self.c.fetchone()[0]
    
    # フォロー中のユーザー取得
    def get_following(self, userID): 
        self.c.execute("SELECT to_user_id FROM follows WHERE from_user_id = %s;", (userID,))
        return self.c.fetchall()
    
    # 指定したユーザーの投稿のみ取得
    def get_specific_post(self, count, offset, userID): 
        sql = "SELECT post_id, user_id, content, image_url, timestamp FROM posts WHERE user_id IN("
        for _ in userID: 
            sql += "%s,"
        sql = sql[:-1] + ") ORDER BY timestamp DESC LIMIT %s OFFSET %s;"
        list_ = userID + [count, offset]
        self.c.execute(sql, list_)
        return self.c.fetchall()

    def check_following(self, from_user_id, to_user_id):
        self.c.execute("SELECT COUNT(*) FROM follows WHERE from_user_id = %s AND to_user_id = %s", (from_user_id, to_user_id))
        return self.c.fetchone()[0] > 0

    
    # ガジェット
    ## ガジェットの作成
    def create_gadget(self, gadget_id, user_id, gadget_name, gadget_image, gadget_tag1, gadget_tag2, gadget_tag3, gadget_content, rental_status):
        self.c.execute("INSERT INTO gadgets VALUES (%s,%s,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP,%s)", (gadget_id, user_id, gadget_name, gadget_image, gadget_tag1, gadget_tag2, gadget_tag3, gadget_content,rental_status))

    ## ふるいget_gadget_list
    # def get_gadget_list(self, count, offset, filter):
    #     if filter is None:
    #         self.c.execute("SELECT gadget_id, user_id, gadget_name, gadget_image, gadget_tag1,gadget_tag2,gadget_tag3,gadget_content,timestamp FROM gadgets ORDER BY timestamp DESC LIMIT %s OFFSET %s", (count, offset))
    #     else:
    #         self.c.execute("SELECT gadget_id, user_id, gadget_name, gadget_image, gadget_tag1,gadget_tag2,gadget_tag3,gadget_content,timestamp FROM gadgets WHERE user_id = %s ORDER BY timestamp DESC LIMIT %s OFFSET %s", (filter, count, offset))
    #     return self.c.fetchall()

    ## レンタルされていないガジェット一覧取得
    def get_gadget_list(self, count, offset, filter, rental_status=None):
        sql = "SELECT gadget_id, user_id, gadget_name, gadget_image, gadget_tag1, gadget_tag2, gadget_tag3, gadget_content, timestamp, rental_status FROM gadgets WHERE 1=1 "
        list_ = [count, offset]
        i = 0
        if rental_status is not None: 
            sql = (sql + "AND rental_status = %s ")
            list_.insert(i, rental_status)
            i += 1
        if filter is not None:
            sql = (sql + "AND user_id = %s ")
            list_.insert(i, filter)
        sql = sql + "ORDER BY timestamp DESC LIMIT %s OFFSET %s;"
        self.c.execute(sql, list_)
        
        return self.c.fetchall()

    ## ガジェットの持ち主orレンタルした人
    def owner_or_borrower(self, user_id, gadget_id):
        self.c.execute("SELECT COUNT(*) FROM gadgets WHERE (user_id = %s AND gatget_id = %s) OR (SELECT COUNT(*) FROM rental WHERE gadget_id = %s AND to_user = %s) = 1", (user_id, gadget_id, user_id, gadget_id))
        return self.c.fetchone()[0] > 0
    
    ## ガジェットの取得
    def get_gadget(self, gadget_id):
        self.c.execute("SELECT gadget_id, user_id, gadget_name, gadget_image, gadget_tag1, gadget_tag2, gadget_tag3, gadget_content, timestamp, rental_status FROM gadgets WHERE gadget_id = %s ORDER BY timestamp DESC", (gadget_id,))
        return self.c.fetchone()
    
    ## ガジェット名の取得
    def get_gadget_name(self, gadget_id):
        self.c.execute("SELECT gadget_name FROM gadgets WHERE gadget_id = %s", (gadget_id,))
        return self.c.fetchone()[0]

    ## ガジェット存在確認
    def confirm_gadget(self, gadget_id):
        self.c.execute("SELECT COUNT(*) FROM gadgets WHERE gadget_id = %s", (gadget_id,))
        return self.c.fetchone()[0] > 0
    
    ## ガジェット所有者取得
    def get_gadget_owner(self, gadget_id):
        self.c.execute("SELECT user_id FROM gadgets WHERE gadget_id = %s", (gadget_id,))
        return self.c.fetchone()[0]

    ## ガジェット所有者判定
    def confirm_gadget_owner(self, gadget_id, user_id):
        self.c.execute("SELECT COUNT(*) FROM gadgets WHERE gadget_id = %s AND user_id = %s", (gadget_id, user_id))
        return self.c.fetchone()[0] > 0
    
    ## ガジェットステータスの変更
    def change_gadget_status(self, status, gadget_id):
        self.c.execute("UPDATE gadgets SET rental_status = %s WHERE gadget_id = %s;", (status, gadget_id))
    
    ## ガジェットステータスの取得
    def confirm_gadget_status(self, gadget_id):
        self.c.execute("SELECT rental_status FROM gadgets WHERE gadget_id = %s", (gadget_id,))
        return self.c.fetchone()[0]

    ## レンタルの作成
    def create_rental(self, gadget_id, user_id, periods):
        self.c.execute("INSERT INTO rental VALUES (%s,%s,%s,CURRENT_TIMESTAMP)", (gadget_id, user_id, periods))
    
    ## レンタルの削除
    def delete_rental(self, gadget_id, user_id):
        self.c.execute("DELETE FROM rental WHERE gadget_id = %s AND to_user = %s", (gadget_id, user_id))

    ## レンタルの取得
    def get_rental(self, gadget_id):
        self.c.execute("SELECT gadget_id, to_user, periods FROM rental WHERE gadget_id = %s", (gadget_id,))
        return self.c.fetchone()
    
    ## レンタルのされているかの判定
    def confirm_rental(self, gadget_id):
        self.c.execute("SELECT COUNT(*) FROM rental WHERE gadget_id = %s", (gadget_id,))
        return self.c.fetchone()[0] > 0

    def create_user(self,user_id, user_name, icon_url, sub, auth_provider):
        self.c.execute("INSERT INTO users VALUES (%s,%s,dummy@example.example,%s,%s,%s,CURRENT_TIMESTAMP)", (user_id, user_name, icon_url, sub, auth_provider))

    # この先DMのやつ
    ## 所属DMグループを取得
    def get_dm_group(self, user_id): 
        self.c.execute("SELECT group_id FROM dmgroup WHERE user_id = %s", (user_id,))
        return self.c.fetchall()
    
    ## グループに所属しているユーザーを取得
    def get_dm_user(self, groupID):
        self.c.execute("SELECT user_id FROM dmgroup WHERE group_id = %s", (groupID,))
        return self.c.fetchall()
    
    ## 特定の二人のみが所属しているグループIDを取得
    def get_specific_group(self, user1, user2):
        self.c.execute("SELECT group_id FROM dmgroup WHERE group_id IN (SELECT group_id FROM dmgroup GROUP BY group_id HAVING COUNT(*) = 2) AND user_id IN (%s, %s) GROUP BY group_id HAVING COUNT(*) = 2;", (user1, user2))
        return self.c.fetchone()

    ## dmのメッセージを取得
    def get_dm_message(self, group_id): 
        self.c.execute("SELECT massage_id, from_user_id, message, timestamp FROM dmmessage WHERE group_id = %s ORDER BY timestamp;", (group_id,))
        return self.c.fetchall()

    ## dmのメッセージを作るやつ
    def create_dm(self, dmID, groupID, userID, content): 
        self.c.execute("INSERT INTO dmmessage VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP);", (dmID, groupID, userID, content))

    ## dmのメッセージを消すやつ
    def delete_dm(self, dmID, groupID, userID): 
        self.c.execute("DELETE FROM dmmessage WHERE massage_id = %s AND group_id = %s AND from_user_id = %s;", (dmID, groupID, userID))

    ## dmのグループにユーザーを作成&追加するやつ
    def addUser_dm(self, groupID, targetUserID): 
        self.c.execute("INSERT INTO dmgroup VALUES(%s, %s, CURRENT_TIMESTAMP);", (groupID, targetUserID))
    
    ## dmのグループをまるごと削除するやつ
    def delete_dm_group(self, groupID):
        self.c.execute("DELETE FROM dmmessage WHERE group_id = %s", (groupID,))
        self.c.execute("DELETE FROM dmgroup WHERE group_id = %s", (groupID,))

    ## dmグループからユーザーをkickするやつ
    def remove_dmUser(self, groupID, userID):
        self.c.execute("DELETE FROM dmgroup WHERE group_id = %s AND user_id = %s", (groupID, userID))

    ## DMのグループにユーザーが入ってるかチェック
    def dm_user_check(self, groupID, userID):
        self.c.execute("SELECT COUNT(*) FROM dmgroup WHERE group_id = %s AND user_id = %s", (groupID, userID))
        return self.c.fetchone()[0] > 0
    
    ## 最後に送信されたメッセージを取得
    def get_last_dm(self, groupID):
        self.c.execute("SELECT from_user_id, message, timestamp FROM dmmessage WHERE group_id = %s ORDER BY timestamp DESC LIMIT 1;", (groupID,))
        return self.c.fetchone()
    # ここまでがDMのやつでした。

    # ここからすけじゅーるのやつ
    ## スケジュール追加
    def add_schedule(self, scheduleID, userID, startDate, endDate, location, scheduleName, visibility): 
        self.c.execute("INSERT INTO schedules VALUES(%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP);", (scheduleID, userID, startDate, endDate, location, scheduleName, visibility))

    ## スケジュール削除
    def remove_schedule(self, scheduleID, userID):
        self.c.execute("DELETE FROM schedules WHERE schedule_id = %s AND user_id = %s;", (scheduleID, userID))

    ## スケジュール取得(あとで追加する可能性あり)
    def get_schedule(self, userID):
        self.c.execute("SELECT * FROM schedules WHERE user_id = %s;", (userID,))
        return self.c.fetchall()
    
    ## 指定したユーザーのスケジュールを取得
    def get_specific_schedule(self, userID, date):
        sql = "SELECT schedule_id, user_id, start_day, end_day, location, content, visibility FROM schedules WHERE user_id IN("
        for _ in userID: 
            sql += "%s,"
        sql = sql[:-1] + ") AND end_day LIKE %s ORDER BY timestamp;"
        list_ = userID + [date + "%"]
        self.c.execute(sql, list_)
        return self.c.fetchall()

    # ユーザー説明文的な
    def get_lore(self, userID): 
        self.c.execute("SELECT lore FROM users where user_id = %s;", (userID,))
        return self.c.fetchone()[0]
    
    def set_lore(self, userID, lore):
        self.c.execute("UPDATE users SET lore = %s WHERE user_id = %s;", (lore, userID))

    def commit(self):
        self.conn.commit()


# ふるいやつ！ sqlite
class DBOP_OLD:
    def __init__(self, db_path=r"./HEWWork_2023.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path)
        self.c = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    def get_user_following(self, user_id, count, offset):
        self.c.execute(
            "SELECT u.user_id, u.user_name, u.icon_url FROM follows f JOIN users u ON f.to_user_id = u.user_id WHERE f.from_user_id = ? LIMIT ? OFFSET ?"
        , (user_id, count, offset))
        return self.c.fetchall()

    def get_user_follower(self, user_id, count, offset):
        self.c.execute(
            "SELECT u.user_id, u.user_name, u.icon_url FROM follows f JOIN users u ON f.from_user_id = u.user_id WHERE f.to_user_id = ? LIMIT ? OFFSET ?"
        , (user_id, count, offset))
        return self.c.fetchall()

    def user_register(self, id, name, icon, sub, provider):
        self.c.execute(
            "INSERT INTO users VALUES (?,?,'dummy@example.example',?,?,?,null,CURRENT_TIMESTAMP)",
            (id, name,  icon, sub, provider),
        )

    # ユーザーアイコンの変更(追加)
    def change_user_icon(self, user_id, icon_url):
        self.c.execute("UPDATE users SET icon_url = ? WHERE user_id = ?", (icon_url, user_id))
    
    def confirm_post(self, postID):
        self.c.execute("SELECT COUNT(*) FROM posts WHERE post_id = ?", (postID,))
        return self.c.fetchone()[0] > 0
    
    def confirm_id(self, id):
        self.c.execute("SELECT COUNT(*) FROM users WHERE user_id = ?", (id,))
        return self.c.fetchone()[0] > 0
    
    def confirm_sub(self, sub):
        self.c.execute("SELECT COUNT(*) FROM users WHERE sub = ?", (sub,))
        return self.c.fetchone()[0] > 0
    
    def get_user_id(self, sub):
        self.c.execute("SELECT user_id FROM users WHERE sub = ?", (sub,))
        return self.c.fetchone()[0]
    
    def get_user_icon(self, user_id):
        self.c.execute("SELECT icon_url FROM users WHERE user_id = ?", (user_id,))
        return self.c.fetchone()[0]
    
    def get_user_name(self, user_id):
        self.c.execute("SELECT user_name FROM users WHERE user_id = ?", (user_id,))
        return self.c.fetchone()[0]
    

    def get_flower_count(self, userID):
        self.c.execute("SELECT COUNT(*) FROM follows WHERE to_user_id = ?", (userID,))
        return self.c.fetchone()[0]
    
    def get_following_count(self, userID):
        self.c.execute("SELECT COUNT(*) FROM follows WHERE from_user_id = ?", (userID,))
        return self.c.fetchone()[0]
    
    def follow_user(self, from_user_id, to_user_id):
        self.c.execute("INSERT INTO follows VALUES (?,?,CURRENT_TIMESTAMP)", (from_user_id, to_user_id))
    
    def unfollow_user(self, from_user_id, to_user_id):
        self.c.execute("DELETE FROM follows WHERE from_user_id = ? AND to_user_id = ?", (from_user_id, to_user_id))
    
    def create_post(self, post_id,user_id, image_url, content):
        self.c.execute("INSERT INTO posts VALUES (?,?,?,null,null,CURRENT_TIMESTAMP,?)", (post_id,user_id,  content,image_url))
    
    def get_post_list(self, count, offset,user_id):
        """
        一時的
        """
        print(user_id)
        if user_id is None:
            self.c.execute("SELECT post_id, user_id, content, image_url, timestamp,comment_id FROM posts ORDER BY timestamp DESC LIMIT ? OFFSET ?", (count, offset))
        else:
            self.c.execute("SELECT post_id, user_id, content, image_url, timestamp,comment_id FROM posts WHERE user_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?", (user_id, count, offset))
        
        return self.c.fetchall()
    
    def is_fav(self, post_id, user_id):
        self.c.execute("SELECT COUNT(*) FROM favorites WHERE post_id = ? AND to_user_id = ?", (post_id, user_id))
        return self.c.fetchone()[0] > 0
    
    def get_post(self, post_id):
        self.c.execute("SELECT post_id, user_id, content, image_url, timestamp FROM posts WHERE post_id = ?", (post_id,))
        return self.c.fetchone()
    
    def set_user_name(self, user_id, user_name):
        self.c.execute("UPDATE users SET user_name = ? WHERE user_id = ?", (user_name, user_id))
    
    def comment_posts(self, postID, userID, content, commentID, imageUrl):
        self.c.execute("INSERT INTO posts VALUES (?, ?, ?, ?, null, CURRENT_TIMESTAMP, ?);", (postID, userID, content, commentID, imageUrl))

    def delete_posts(self, postID, userID):
        self.c.execute("DELETE FROM posts WHERE post_id = ? AND user_id = ?;", (postID, userID))
    
    # ふぁぼする
    def favorite_posts(self, postID, userID):
        self.c.execute("INSERT INTO favorites VALUES (?,?,CURRENT_TIMESTAMP);", (postID, userID))
    
    # ふぁぼけす
    def unfavorite_posts(self, postID, userID):
        self.c.execute("DELETE FROM favorites WHERE post_id = ? AND to_user_id = ?;", (postID, userID))

    # ふぁぼカウント
    def get_favorite_cnt(self, postID):
        self.c.execute("SELECT COUNT(*) FROM favorites WHERE post_id = ?", (postID,))
        return self.c.fetchone()[0]
    
    # ふぁぼリスト
    def get_favorite_list(self, postID):
        self.c.execute("SELECT to_user_id FROM favorites WHERE post_id = ?", (postID,))
        return self.c.fetchall()

    # コメントの取得
    def get_comment(self, postID): 
        self.c.execute("SELECT post_id, user_id, content, image_url, timestamp FROM posts WHERE comment_id = ?", (postID,))
        return self.c.fetchall()
    
    # コメント数
    def get_commentCnt(self, postID): 
        self.c.execute("select count(*) from posts where comment_id = ?", (postID,))
        return self.c.fetchone()[0]
    
    # フォロー中のユーザー取得
    def get_following(self, userID): 
        self.c.execute("SELECT to_user_id FROM follows WHERE from_user_id = ?;", (userID,))
        return self.c.fetchall()
    
    # 指定したユーザーの投稿のみ取得
    def get_specific_post(self, count, offset, userID): 
        sql = "SELECT post_id, user_id, content, image_url, timestamp FROM posts WHERE user_id IN("
        for _ in userID: 
            sql += "?,"
        sql = sql[:-1] + ") ORDER BY timestamp DESC LIMIT ? OFFSET ?;"
        list_ = userID + [count, offset]
        self.c.execute(sql, list_)
        return self.c.fetchall()

    def check_following(self, from_user_id, to_user_id):
        self.c.execute("SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = ?", (from_user_id, to_user_id))
        return self.c.fetchone()[0] > 0
    
    def get_gadget_list(self, count, offset, filter):
        if filter is None:
            self.c.execute("SELECT gadget_id, user_id, gadget_name, gadget_image, gadget_tag1,gadget_tag2,gadget_tag3,gadget_content,timestamp  FROM gadgets ORDER BY timestamp DESC LIMIT ? OFFSET ?", (count, offset))
        else:
            self.c.execute("SELECT gadget_id, user_id, gadget_name, gadget_image, gadget_tag1,gadget_tag2,gadget_tag3,gadget_content,timestamp FROM gadgets WHERE user_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?", (filter, count, offset))
        
        return self.c.fetchall()
    
    def create_gadget(self, gadget_id, user_id, gadget_name, gadget_image, gadget_tag1, gadget_tag2, gadget_tag3, gadget_content):
        self.c.execute("INSERT INTO gadgets VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)", (gadget_id, user_id, gadget_name, gadget_image, gadget_tag1, gadget_tag2, gadget_tag3, gadget_content))

    def create_user(self,user_id, user_name, icon_url, sub, auth_provider):
        self.c.execute("INSERT INTO users VALUES (?,?,dummy@example.example,?,?,?,CURRENT_TIMESTAMP)", (user_id, user_name, icon_url, sub, auth_provider))

    # この先DMのやつ
    # 所属DMグループを取得
    def get_dm_group(self, user_id): 
        self.c.execute("SELECT group_id FROM dmgroup WHERE user_id = ?", (user_id,))
        return self.c.fetchall()
    
    ## グループに所属しているユーザーを取得
    def get_dm_user(self, groupID):
        self.c.execute("SELECT user_id FROM dmgroup WHERE group_id = ?", (groupID,))
        return self.c.fetchall()
    
    # dmのメッセージを取得
    def get_dm_message(self, group_id): 
        self.c.execute("SELECT massage_id, from_user_id, message, timestamp FROM dmmessage WHERE group_id = ? ORDER BY timestamp;", (group_id,))
        return self.c.fetchall()

    ## dmのメッセージを作るやつ
    def create_dm(self, dmID, groupID, userID, content): 
        self.c.execute("INSERT INTO dmmessage VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);", (dmID, groupID, userID, content))

    ## dmのメッセージを消すやつ
    def delete_dm(self, dmID, groupID, userID): 
        self.c.execute("DELETE FROM dmmessage WHERE massage_id = ? AND group_id = ? AND from_user_id = ?;", (dmID, groupID, userID))

    ## dmのグループにユーザーを作成&追加するやつ
    def addUser_dm(self, groupID, targetUserID): 
        self.c.execute("INSERT INTO dmgroup VALUES(?, ?, CURRENT_TIMESTAMP);", (groupID, targetUserID))
    
    ## dmのグループをまるごと削除するやつ
    def delete_dm_group(self, groupID):
        self.c.execute("DELETE FROM dmmessage WHERE group_id = ?", (groupID,))
        self.c.execute("DELETE FROM dmgroup WHERE group_id = ?", (groupID,))

    ## dmグループからユーザーをkickするやつ
    def remove_dmUser(self, groupID, userID):
        self.c.execute("DELETE FROM dmgroup WHERE group_id = ? AND user_id = ?", (groupID, userID))

    ## DMのグループにユーザーが入ってるかチェック
    def dm_user_check(self, groupID, userID):
        self.c.execute("SELECT COUNT(*) FROM dmgroup WHERE group_id = ? AND user_id = ?", (groupID, userID))
        return self.c.fetchone()[0] > 0
    
    ## 最後に送信されたメッセージを取得
    def get_last_dm(self, groupID):
        self.c.execute("SELECT from_user_id, message, timestamp FROM dmmessage WHERE group_id = ? ORDER BY timestamp DESC LIMIT 1;", (groupID,))
        return self.c.fetchone()
    # ここまでがDMのやつでした。

    # ここからすけじゅーるのやつ
    ## スケジュール追加
    def add_schedule(self, scheduleID, userID, startDate, endDate, scheduleTime, scheduleName, place): 
        self.c.execute("INSERT INTO schedules VALUES(?, ?, ?, ?, ?, ?, null, ?, CURRENT_TIMESTAMP);", (scheduleID, userID, startDate, endDate, scheduleTime, scheduleName, place))

    ## スケジュール取得(あとで追加する可能性あり)
    def get_schedule(self, userID):
        self.c.execute("SELECT * FROM schedules WHERE user_id = ?;", (userID,))
        return self.c.fetchall()
    
    ## 指定したユーザーのスケジュールを取得
    def get_specific_schedule(self, userID, date):
        sql = "SELECT schedule_id, user_id, start_day, end_day, schedule_time, content FROM schedules WHERE user_id IN("
        for _ in userID: 
            sql += "?,"
        sql = sql[:-1] + ") AND end_day LIKE ? ORDER BY timestamp;"
        list_ = userID + [date + "%"]
        self.c.execute(sql, list_)
        return self.c.fetchall()

    # ユーザー説明文的な
    def get_lore(self, userID): 
        self.c.execute("SELECT lore FROM users where user_id = ?;", (userID,))
        return self.c.fetchone()[0]
    
    def set_lore(self, userID, lore):
        self.c.execute("UPDATE users SET lore = ? WHERE user_id = ?;", (lore, userID))

    def commit(self):
        self.conn.commit()
