import boto3
import os

BUCKET = os.environ.get('S3_BUCKET')

def upload(file_obj, object_name, folder):
    s3_client = boto3.client('s3')
    s3_client.upload_fileobj(file_obj, BUCKET, f"{folder}/{object_name}")

def download(file_name, folder):
    s3 = boto3.resource('s3')
    output = f"/tmp/{file_name}"
    s3.Bucket(BUCKET).download_file(f"{folder}/{file_name}", output)
    return output

def list_all_files(folder):
    s3 = boto3.client('s3')
    contents = []
    response = s3.list_objects(Bucket=BUCKET, Prefix=f"{folder}/")
    for item in response.get('Contents', []):
        # Strip the folder prefix so you just get the filename
        item['Key'] = item['Key'].replace(f"{folder}/", "", 1)
        contents.append(item)
    return contents

def delete_file(file_name, folder):
    s3 = boto3.client('s3')
    s3.delete_object(Bucket=BUCKET, Key=f"{folder}/{file_name}")