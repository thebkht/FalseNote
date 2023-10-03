import { PostEditorForm } from '@/components/editor/post-editor-form'

export default function PostEditor({ params }: { params: { posturl: string } }) {
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-14 lg:p-20 editor">
     <PostEditorForm url={params.posturl} />
    </main>
  )
}
