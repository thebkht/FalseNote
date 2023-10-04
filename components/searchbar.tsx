import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";


export default function SearchBar() {
  return (
      <Dialog>
        <DialogTrigger><Button variant={"ghost"} size={"icon"}><Search className="h-[1.2rem] w-[1.2rem]"/></Button></DialogTrigger>
        <DialogContent>
            <div className="search feed__content_search max-w-[500px]">
           <div className="search-container">
             <div className="search__form">
             <div className="input">
               <div className="input__icon">
                 <Search className='search__form_icon' />
               </div>
               <Input placeholder="Search for people or tags..." className="input__field !foucs-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none" />
             </div>
             </div>
           </div>
         </div>
        </DialogContent>
      </Dialog>
  )
}