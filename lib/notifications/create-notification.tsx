import { ObjectId } from "bson";
import postgres from "../postgres";

type NotificationData = {
     type: string;
     content: string;
     receiverId: string;
     url: string;
     senderId: string;
}

export const create = async (data: NotificationData) => {
     try {
          console.log(data)
          await postgres.notification.create({
               data: {
                         id: new ObjectId().toHexString(),
                        type: data.type,
                        content: data.content,
                        receiverId: data.receiverId,
                        url: data.url,
                        senderId: data.senderId,
               }
        })
        console.log('Notification created')
   } catch (error) {
            console.error(error)
     }
}