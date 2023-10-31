import { PostEditorForm } from '@/components/editor/post-editor-form'
import { getSessionUser } from '@/components/get-session-user';
import postgres from '@/lib/postgres';
import { redirect } from 'next/navigation';

export default async function PostEditor({ params }: { params: { posturl: string } }) {
  const session = await getSessionUser();

  const post = await postgres.post.findFirst({
    where: {
      url: params.posturl,
      authorId: session?.id
    }
  })

  if (!post || !session) redirect("/404");

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-14 lg:p-20 editor">
     { post && <PostEditorForm post={post} user={session} /> }
    </main>
  )
}
