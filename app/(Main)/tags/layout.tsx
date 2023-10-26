import ExploreTabs from "@/components/explore/navbar/navbar";
import { TagNav } from "@/components/tags/nav";
import postgres from "@/lib/postgres";

export default function TagsLayout({ children }: { children: React.ReactNode }) {

     return (
          <main className="flex flex-col items-center justify-between">
               <ExploreTabs />
               {children}
          </main>
     )
}