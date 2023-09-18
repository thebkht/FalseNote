import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
     params: { username: string }
     children: React.ReactNode
   }
 
export async function generateMetadata(
     { params }: Props,
     parent: ResolvingMetadata
   ): Promise<Metadata> {    
     return {
       title: `${params.username} | FalseNotes`,
       // openGraph: {
       //   images: ['/some-specific-page-image.jpg', ...previousImages],
       // },
       description: `Follow their to keep up with their activity on FalseNotes.`,
     }
   }

export default function UserLayout(
     { children, params }: Props
  ) {

  return children
}
