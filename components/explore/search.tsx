'use client'

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from 'use-debounce'

export default function Search({search} : {search: string | undefined}) {
     const router = useRouter()
     const initialRender = useRef(true)
   
     const [text, setText] = useState(search)
     useEffect(() => {
          setText(search)
     }, [search])
     
     const [query] = useDebounce(text, 750)
   
     useEffect(() => {
       if (initialRender.current) {
         initialRender.current = false
         return
       }
   
       if (!query) {
         router.push(`/explore`)
       } else if (query.length >= 3) {
         router.push(`/explore?search=${query}`)
       }
     }, [query])
     return (
          <>
               <div className="search feed__empty_search">
                         <div className="search-container">
                              <div className="search__form mx-auto md:w-[540px]">
                                   <div className="input w-full h-14 rounded-full">
                                        <div className="input__icon ml-3">
                                             <SearchIcon className='search__form_icon' />
                                        </div>
                                        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Search for people or tags" className="input__field !foucs-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none" />
                                   </div>
                              </div>
                         </div>
                    </div>
          </>
     )
}