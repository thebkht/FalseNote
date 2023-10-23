import { TagNav } from "@/components/tags/nav";
import postgres from "@/lib/postgres";

const tags = await postgres.tag.findMany();
     //add href to tags
     tags.forEach((tag: any) => {
          tag.href = `/tag/${tag.name}`;
     }
     )

export default function TagLayout({ children }: { children: React.ReactNode }) {

     return (
          <>
               <TagNav items={tags} className="mb-12 px-0.5 pb-1" />
               {children}
          </>
     )
}