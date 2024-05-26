import boto3
import os

def s3_client():
    return boto3.client(
        service_name="s3",
        endpoint_url=os.environ["BLOB_HOST_DOCKER"],
        aws_access_key_id=os.environ["MINIO_UPLOAD_USER"],
        aws_secret_access_key=os.environ["MINIO_UPLOAD_PASSWORD"],
    )
