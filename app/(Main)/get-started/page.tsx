import { getSessionUser } from "@/components/get-session-user";
import TagsDialog from "@/components/get-started/tags";
import { getTags } from "@/lib/prisma/tags";

export default async function GetStartedPage() {
     const session = await getSessionUser();
     const { tags } = await getTags({id: session?.id});
     return (
          <>
               <TagsDialog open tags={tags} session={session} />
          </>
     )
}