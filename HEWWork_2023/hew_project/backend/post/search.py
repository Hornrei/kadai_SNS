import os
from fastapi import APIRouter, Request
from modules import dbop
from elasticsearch import Elasticsearch

router = APIRouter(tags=["search"])

@router.get("/search")
async def createDM(request: Request, limit: str | None = 10, offset: str | None = 0, keyword: str | None = None):
    try: 
        dp = dbop.DBOP()
        if keyword is None:
            return {"status": "ng", "message": "keyword is required"}

        es = Elasticsearch("http://74.226.166.211:9292", http_auth=("elastic", "hewpj_azureES_saituyo"))
        query = {
            "from": offset,
            "size": limit,
            "query": {
                "bool": {
                    "should": [
                        {"match": {"user_id": keyword}},
                        {"match": {"content": keyword}}
                    ]
                }
            },
            "sort": {
                "timestamp": "desc"
            }
        }

        # もしキーワードがユーザー名だった場合、ユーザーIDを取得して検索条件に追加
        user_id = dp.get_user_id_from_name(keyword)
        if user_id is not None:
            query["query"]["bool"]["should"].append({"match": {"user_id": user_id[0]}})

        info = es.search(index="main.main.posts", body=query)

        es.close()

        return_ = []
        user_info = {}

        for d in info["hits"]["hits"]:
            if d["_source"]["user_id"] not in user_info:
                user_info[d["_source"]["user_id"]] = {
                    "name": dp.get_user_name(d["_source"]["user_id"])
                }

            return_.append({
                "user_id": d["_source"]["user_id"],
                "post_id": d["_source"]["post_id"],
                "comment_id": d["_source"]["comment_id"],
                "user_name": user_info[d["_source"]["user_id"]]["name"],
                "content": d["_source"]["content"],
                "timestamp": d["_source"]["timestamp"]
            })

        return {"status": "ok", "data": return_}
    except Exception:
        es.close
        return {"status": "ng"}
