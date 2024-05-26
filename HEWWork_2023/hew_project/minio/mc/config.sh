#!/bin/bash

mc alias set main http://minio:9000 root password

mc admin user add main $MINIO_UPLOAD_USER $MINIO_UPLOAD_PASSWORD

mc admin policy attach main readwrite -u $MINIO_UPLOAD_USER



mc anonymous set download main/temp

mc anoymouse set donwload main/main
