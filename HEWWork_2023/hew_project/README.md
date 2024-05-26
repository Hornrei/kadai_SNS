# Rework

## 起動方法

DockerComposeを使ってください

- main
- - nginx : http://127.0.0.1:8080

mainではhotfixが無効。
現在backend, minioとは通信ができません

- dev
- - frontend : http://127.0.0.1:5173/
- - backend : http://127.0.0.1:8000/
- - minio : http://127.0.0.1:9000/
- - minioConsole : http://127.0.0.1:9001/

devではhotfixが有効になっています


# minioについて

user: root
password : password

boto3を使って操作します
デフォルトだと補完が聞かないのでvenv環境で`pip install boto3-stubs['s3']`を実行してください