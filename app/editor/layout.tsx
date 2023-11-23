import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Post - FalseNotes',
  description: 'Create a new post on FalseNotes',
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-popover'>
      <div className='py-10'>
        {children}
      </div>
    </div>
  )
}
