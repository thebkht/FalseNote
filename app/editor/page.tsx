import { PostForm } from '@/components/editor/post-form'
import FeaturedDev from '@/components/feed/featured/featured-dev'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function Editor() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 editor">
     <PostForm />
    </main>
  )
}
