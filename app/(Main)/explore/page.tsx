import Search from "@/components/explore/search"
import { Input } from "@/components/ui/input"

export default function Explore({
     searchParams
}: {
     searchParams: { [key: string]: string | string[] | undefined }
}) {

     const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

     return (
          <>
               <div className="flex flex-col items-center pt-10">
                    <h2 className="font-medium text-4xl">Explore</h2>
                    <Search search={search} />
               </div>
          </>
     )
}