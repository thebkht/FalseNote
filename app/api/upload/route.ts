import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); 
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' });
    }

    const postId = req.nextUrl.searchParams.get("postId");
    const authorId = req.nextUrl.searchParams.get("authorId");

    if (!postId || !authorId) {
      return NextResponse.json({ success: false, message: 'postId and authorId are required query parameters' });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
    const containerClient = blobServiceClient.getContainerClient('blogs');
    const blockBlobClient = containerClient.getBlockBlobClient(`${authorId}/${postId}`);

    await blockBlobClient.upload(buffer, buffer.length);

    const url = `https://falsenotescontent.blob.core.windows.net/blogs/${authorId}/${postId}`;

    return NextResponse.json({ success: true, message: 'File uploaded', data: { url } });
  } catch (error : any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}