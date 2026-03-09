import boto3
import os

BUCKET = os.environ.get('S3_BUCKET')

def upload(file_obj, object_name, folder, args):
    s3_client = boto3.client('s3')
    metadata= {}
    for key, value in args.items():
        if key != 'resourceFile' and value:
            metadata[key] = value
    s3_client.upload_fileobj(file_obj, BUCKET, f"{folder}/{object_name}", ExtraArgs={'Metadata': metadata})

def download(file_name, folder):
    s3 = boto3.resource('s3')
    output = f"/tmp/{file_name}"
    s3.Bucket(BUCKET).download_file(f"{folder}/{file_name}", output)
    return output

def get_metadata(file_name, folder):
    s3_client = boto3.client('s3')
    response = s3_client.head_object(Bucket=BUCKET, Key=f"{folder}/{file_name}")
    return response.get('Metadata', {})

def list_all_files(folder):
    s3 = boto3.client('s3')
    contents = []
    response = s3.list_objects(Bucket=BUCKET, Prefix=f"{folder}/")
    for item in response.get('Contents', []):
        key = item['Key'].replace(f"{folder}/", "", 1)
        if key:
            contents.append(key)
    return contents

def delete_file(file_name, folder):
    s3 = boto3.client('s3')
    s3.delete_object(Bucket=BUCKET, Key=f"{folder}/{file_name}")