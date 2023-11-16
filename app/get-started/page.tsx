import { getSessionUser } from "@/components/get-session-user";
import TagsDialog from "@/components/get-started/tags";
import { getTags } from "@/lib/prisma/tags";
import { redirect } from "next/navigation";

export default async function GetStartedPage() {
     const session = await getSessionUser();
     const { tags } = await getTags({id: session?.id});
     !session && redirect('/signin');
     return (
          <>
               <TagsDialog tags={tags} session={session} />
          </>
     )
}