import postgres from "../postgres";

type NotificationData = {
     type: string;
     content: string;
     receiverId: string;
     url: string;
     senderId: string;
}

export const create = async (data: NotificationData) => {
     await postgres.notification.create({
            data: {
               ...data
            }
     })
} 