import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_REGION, AWS_BUKECT_NAME, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js'; 
import fs from 'fs';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; 



const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

export async function upload(file){
    const stream = fs.createReadStream(file.tempFilePath);
    const params = {
        Bucket: AWS_BUKECT_NAME,
        key: file.name,
        body: stream
    };
    const command = new PutObjectCommand(params);
    return await client.send(command);
};

export async function getFiles(){
   const command = new ListObjectsCommand({Bucket: AWS_BUKECT_NAME});
   return await client.send(command);
};

export async function getOneFile(fileName){
    const command = new GetObjectCommand({Bucket: AWS_BUKECT_NAME, Key: fileName});
    return await client.send(command);
};

export async function downLoadFile(fileName){
    const command = new GetObjectCommand({Bucket: AWS_BUKECT_NAME, Key: fileName});
    const { Body } = await client.send(command);
    return Body.pipe(fs.createWriteStream(`./images/${fileName}`));
};

export async function getFileUrl(fileName){
    const command = new GetObjectCommand({Bucket: AWS_BUKECT_NAME, Key: fileName});
    return await getSignedUrl(client, command, {expiresIn: 3600});
};

