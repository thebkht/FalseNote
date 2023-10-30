import { TagNav } from "@/components/tags/nav";
import postgres from "@/lib/postgres";

const tags = await postgres.tag.findMany({
          orderBy: {
               posts: {
                    _count: 'desc'
               }
          }
});
     //add href to tags
     tags.forEach((tag: any) => {
          tag.href = `/tags/${tag.name}`;
     }
     )

export default function TagLayout({ children }: { children: React.ReactNode }) {

     return (
          <div className="py-10">
               {children}
          </div>
     )
}