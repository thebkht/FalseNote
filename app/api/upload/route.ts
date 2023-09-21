import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); 
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file provided' })
  }
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer. from(bytes)

  const path = join(process.cwd(), 'public', 'uploads', file.name)
  await writeFile(path, buffer)
  console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true, message: 'File uploaded', url: path })
  } catch (error : any) {
    return NextResponse.json({ success: false, message: error.message })
  }
}