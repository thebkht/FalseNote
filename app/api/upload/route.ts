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

  // Extract postId and authorId from searchParams
  const postId = req.nextUrl.searchParams.get("postId");
  const authorId = req.nextUrl.searchParams.get("authorId");

  console.log(postId, authorId);

  if (!postId || !authorId) {
    return NextResponse.json({ success: false, message: 'postId and authorId are required query parameters' });
  }

  const s3 = new AWS.S3();
  const s3path = `blogs/covers/${authorId}/${postId}.${file.name.split('.').pop()}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3path,
    Body: buffer,
  };

  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3path}`;

  s3.upload(params, function (err: any, data: any) {
    if (err) {
      console.log('error in callback');
      console.log(err);
    }
    // console.log('success');
    // console.log(data);
  });

  return NextResponse.json({ success: true, message: 'File uploaded', data: { url } })
  } catch (error : any) {
    return NextResponse.json({ success: false, message: error.message })
  }
}