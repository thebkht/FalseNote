import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
const AWS = require('aws-sdk');

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); 
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file provided' })
  }
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer. from(bytes)

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();
  const s3path = 'assets/media/blogs/covers/' + file.name;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3path,
    Body: buffer,
  };

  s3.upload(params, function (err: any, data: any) {
    if (err) {
      console.log('error in callback');
      console.log(err);
    }
    console.log('success');
    console.log(data);
  });


  // const s3 = new AWS.S3({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_REGION,
  //   signatureVersion: 'v4',
  // });

  // const domain = process.env.DOMAIN || 'http://localhost:3000'

  // const path = join(domain, '_next', 'static', 'media', 'uploads', file.name)
  // await writeFile(path, buffer)
  // console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true, message: 'File uploaded' })
  } catch (error : any) {
    return NextResponse.json({ success: false, message: error.message })
  }
}