import { NextRequest, NextResponse } from "next/server";
const AWS = require('aws-sdk');
import { BlobServiceClient } from "@azure/storage-blob";


export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); 
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file provided' })
  }
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer. from(bytes)

  // Extract postId and authorId from searchParams
  const postId = req.nextUrl.searchParams.get("postId");
  const authorId = req.nextUrl.searchParams.get("authorId");
if (!postId || !authorId) {
    return NextResponse.json({ success: false, message: 'postId and authorId are required query parameters' });
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
  // in blogs directory
  const containerClient = blobServiceClient.getContainerClient('blogs');
// Upload file to Azure Storage with name postId in the authorId folder
const blockBlobClient = containerClient.getBlockBlobClient(`${authorId}/${postId}.${file.name.split('.').pop()}`);
  // Upload file to Azure Storage with name postId in the authorId folder
  const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.length);
  console.log(`Upload block blob ${postId} successfully`, uploadBlobResponse.requestId);
  const url = `https://falsenotescontent.blob.core.windows.net/blogs/${authorId}/${postId}.${file.name.split('.').pop()}`;

  return NextResponse.json({ success: true, message: 'File uploaded', data: { url } })
  } catch (error : any) {
    return NextResponse.json({ success: false, message: error.message })
  }
}