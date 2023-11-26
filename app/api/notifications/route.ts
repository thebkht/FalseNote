import postgres from "@/lib/postgres"
import { ObjectId } from "bson"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
     try {
          const data = await request.json()
     if (!data) {
          return NextResponse.json({ status: 400, message: "No data provided" })
     }
     const { content, receiverId, type, url, senderId } = data

          await postgres.notification.create({
               data: {
                    id: new ObjectId().toHexString(),
                    content,
                    receiverId,
                    type,
                    url,
                    senderId
               }
          })
          // Execute the query here
          return NextResponse.json({ status: 201, message: "Notification created" })
     } catch (error) {
          console.log("Failed to create notification:", error)
          return NextResponse.json({ status: 500, message: `Failed to create notification: ${error}` })
     }
}

// GET /api/notifications
export async function GET(request: NextRequest) {
     try {
       const body = await request.json();
       if (!body || !body.receiverId) {
         return NextResponse.json({
           status: 400,
           message: "Missing receiverId query parameter",
         });
       }
       const receiverId = body.receiverId;
       const data = await postgres.notification.findMany({
         where: {
           receiverId,
         },
         orderBy: {
           createdAt: "desc",
         },
       });
       return NextResponse.json(data);
     } catch (error) {
       return NextResponse.json({
         status: 400,
         message: "Invalid request body",
         error,
       });
     }
   }
   

// PUT /api/notifications?id
export async function PUT(request: NextRequest) {
     const id = await request.nextUrl.searchParams.get("id")?.toString()
     try {
          // await sql`
          //      UPDATE notifications SET readat = ${new Date().toISOString()} WHERE id = ${id}
          // `
          await postgres.notification.update({
               where: {
                    id: id
               },
               data: {
                    read: true
               }
          })
          return NextResponse.json({ status: 200, message: "Notification updated" })
     } catch (error) {
          console.log("Failed to update notification:", error)
          return NextResponse.json({ status: 500, message: `Failed to update notification: ${error}` })
     }
}

// DELETE /api/notifications?id
export async function DELETE(request: NextRequest) {
     const id = await request.nextUrl.searchParams.get("id")?.toString()
     try {
          await postgres.notification.delete({
               where: {
                    id: id
               }
          })
          return NextResponse.json({ status: 200, message: "Notification deleted" })
     } catch (error) {
          console.log("Failed to delete notification:", error)
          return NextResponse.json({ status: 500, message: `Failed to delete notification: ${error}` })
     }
}