import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
     const { type, message, user_id } = await request.json()
     const created_at = new Date().toISOString()
     const read_at = null
     try {
          await sql`
               INSERT INTO notifications (type, message, userid, createdat, readat)
               VALUES (${type}, ${message}, ${user_id}, ${created_at}, ${read_at})
          `
          // Execute the query here
          NextResponse.json({ status: 201, message: "Notification created" })
     } catch (error) {
          console.log("Failed to create notification:", error)
          NextResponse.json({ status: 500, message: `Failed to create notification: ${error}` })
     }
}

// GET /api/notifications
export async function GET(request: NextRequest) {
     const { user_id } = await request.json()
     try {
          const {rows: notifications} = await sql`
               SELECT * FROM notifications WHERE userid = ${user_id}
          `
          return NextResponse.json(notifications)
     } catch (error) {
          console.log("Failed to fetch notifications:", error)
          return NextResponse.json({ status: 500, message: `Failed to fetch notifications: ${error}` })
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