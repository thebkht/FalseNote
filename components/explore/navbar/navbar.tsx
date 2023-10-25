import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { items } from "./items"

type Item = {
     label: string;
     icon: React.ElementType;
     path: string;
};


export default function ExploreTabs({ pathname }: { pathname: string }) {
     return (
          <div className="w-full bg-background/70 backdrop-blur-md absolute top-[64px] p-1 flex justify-center z-[10]">
               <Tabs defaultValue={pathname} className="">
               <TabsList className="bg-transparent gap-2">
                    {items.map((item: any) => (
                         <TabsTrigger key={item.path} value={item.path} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                              <item.icon className="h-4 w-4 mr-2" />
                              {item.label}
                         </TabsTrigger>
                    ))}
               </TabsList>
          </Tabs>
          </div>
     );
}