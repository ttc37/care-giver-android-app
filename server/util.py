from app import s3, config
import boto3

def create_presigned_url(object):
    try:
        bucket_name = config['BUCKET_NAME']
        ACCESS_KEY = config['ACCESS_KEY_S3']
        SECRET_KEY = config['SECRET_KEY_S3']
        key = object
        location = boto3.client('s3', aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_KEY).get_bucket_location(Bucket=bucket_name)['LocationConstraint']
        #location = "us-east-1"
        s3_client = boto3.client(
                's3',
                region_name=location,
                aws_access_key_id=ACCESS_KEY,
                aws_secret_access_key=SECRET_KEY,
            )
        url = s3_client.generate_presigned_url(
                ClientMethod='get_object',
                Params={'Bucket': bucket_name, 'Key': key, },
                ExpiresIn=600000,
            )
    except ClientError as e:
        print(e)
        return None
    return url