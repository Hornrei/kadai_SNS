import sqlite3

class DBOP:
    def __init__(self, db_path=r"./sqlite.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path)
        self.c = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    # 通知の発行
    def create_notice(self, uuid, user_id, type, content): 
        self.c.execute(f"INSERT INTO notice VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)", (uuid, user_id, type, content))
    
    # 通知の削除
    def delete_notice(self, user_id, type, content): 
        self.c.execute(f"DELETE FROM notice WHERE target_user = ? AND type = ? AND content = ?", (user_id, type, content))

    # 通知の取得
    def get_notice(self, user_id): 
        self.c.execute(f"SELECT target_user, type, content FROM notice WHERE target_user = ?", (user_id, ))
        return self.c.fetchall()
    
    # 通知の数を取得
    def get_notice_count(self, user_id): 
        self.c.execute(f"SELECT type, COUNT(type) FROM notice WHERE target_user = ? GROUP BY type", (user_id, ))
        return self.c.fetchall()

    def commit(self):
        self.conn.commit()