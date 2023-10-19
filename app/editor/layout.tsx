import { ScrollArea } from '@/components/ui/scroll-area'
import EditorNavbar from '@/components/navbar/editor-nav'
import { Toaster } from '@/components/ui/toaster'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-popover'>
     <EditorNavbar />
            <ScrollArea className='h-screen max-w-screen xl:px-36 2xl:px-64'>
              <div className='py-10'>
                {children}
                <Toaster />
              </div>
            </ScrollArea>
    </div>
  )
}
