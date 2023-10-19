import { TagNav } from "@/components/tags/nav";
import { sql } from "@/lib/postgres";

const tags = await sql('SELECT * FROM tags');
     //add href to tags
     tags.forEach((tag: any) => {
          tag.href = `/tag/${tag.tagname}`;
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