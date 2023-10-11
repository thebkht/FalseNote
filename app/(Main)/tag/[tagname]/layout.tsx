import { TagNav } from "@/components/tags/nav";
import { sql } from "@vercel/postgres";

const { rows: tags } = await sql`SELECT * FROM tags`;
     //add href to tags
     tags.forEach((tag: any) => {
          tag.href = `/tag/${tag.tagname}`;
     }
     )

export default function TagLayout({ children }: { children: React.ReactNode }) {

     return (
          <>
               <TagNav items={tags} className="mt-6 mb-12 px-0.5" />
               {children}
          </>
     )
}