import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function Search({search} : {search: string | undefined}) {
     return (
          <>
               <div className="search feed__empty_search">
                         <div className="search-container my-6">
                              <div className="search__form mx-6 min-w-[540px]">
                                   <div className="input w-full h-14 rounded-full">
                                        <div className="input__icon ml-3">
                                             <SearchIcon className='search__form_icon' />
                                        </div>
                                        <Input placeholder="Search for people or tags" className="input__field !foucs-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none" />
                                   </div>
                              </div>
                         </div>
                    </div>
          </>
     )
}