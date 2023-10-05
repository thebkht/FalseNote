import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
     try {
          const data = await request.json()
     if (!data) {
          return NextResponse.json({ status: 400, message: "No data provided" })
     }
     console.log("Received data:", data)
     const { type, message, user_id } = data
     const created_at = new Date().toISOString()
     const read_at = null
          await sql`
               INSERT INTO notifications (type, message, userid, createdat, readat)
               VALUES (${type}, ${message}, ${user_id}, ${created_at}, ${read_at})
          `
          // Execute the query here
          return NextResponse.json({ status: 201, message: "Notification created" })
     } catch (error) {
          console.log("Failed to create notification:", error)
          return NextResponse.json({ status: 500, message: `Failed to create notification: ${error}` })
     }
}

// GET /api/notifications
export async function GET(request: NextRequest) {
     // request url: /api/notifications body: json.stringify({ user_id: 1 })

          const user_id = request.nextUrl.searchParams.get("user_id")
           console.log("Received user_id:", user_id);
      
           if (!user_id) {
                return NextResponse.json({
                     status: 400,
                     message: "Missing user_id query parameter",
                });
           }
      
           try {
                const data = await sql`
                     SELECT * FROM notifications WHERE userid = ${user_id}
                `;
                const { rows: notifications } = data;
                return NextResponse.json({notifications});
           } catch (error: any) {
                console.error("Failed to fetch notifications:", error);
                return NextResponse.json({
                     status: 500,
                     message: `Failed to fetch notifications: ${error.message}`,
                });
           }
      }
   

// PUT /api/notifications?id
export async function PUT(request: NextRequest) {
     const id = await request.nextUrl.searchParams.get("id")
     try {
          await sql`
               UPDATE notifications SET readat = ${new Date().toISOString()} WHERE id = ${id}
          `
          return NextResponse.json({ status: 200, message: "Notification updated" })
     } catch (error) {
          console.log("Failed to update notification:", error)
          return NextResponse.json({ status: 500, message: `Failed to update notification: ${error}` })
     }
}

// DELETE /api/notifications?id
export async function DELETE(request: NextRequest) {
     const id = await request.nextUrl.searchParams.get("id")
     try {
          await sql`
               DELETE FROM notifications WHERE id = ${id}
          `
          return NextResponse.json({ status: 200, message: "Notification deleted" })
     } catch (error) {
          console.log("Failed to delete notification:", error)
          return NextResponse.json({ status: 500, message: `Failed to delete notification: ${error}` })
     }
}