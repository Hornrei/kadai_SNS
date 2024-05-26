from fastapi import APIRouter, Request
from modules import dbop, oauth

router = APIRouter(tags=["postDetail"])

@router.get("/postDetail")
def postDetail(postID: str = ""):

    dp = dbop.DBOP()
    if dp.confirm_post(postID): 
        data = dp.get_post(postID)
    else: 
        return{"status": "ng"}
    
    commentCnt = dp.get_commentCnt(postID)

    comment = dp.get_comment(data[0])

    if comment != None: 
        commentList = []
        for d in comment: 
            commentList.append({
                "postID": d[0],
                "userID": d[1],
                "userName": dp.get_user_name(d[1]),
                "content": d[2],
                "imageUrl": d[3],
                "timestamp": d[4]
            })
    else: 
        commentList = None

    return_ = {
        "postID": data[0],
        "userID": data[1],
        "userName": dp.get_user_name(data[1]),
        "content": data[2],
        "imageUrl": data[3],
        "timestamp": data[4],
        "commentCnt": commentCnt,
        "comment": commentList,
    }

    return return_