"use client"
import { PostEditorForm } from '@/components/editor/post-editor-form'
import { getSessionUser } from '@/components/get-session-user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PostEditor({ params }: { params: { posturl: string } }) {
  const [user, setUser] = useState<any | null>(null);
  const [post, setPost] = useState<any>(null); // State for the post object
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionUser = (await getSessionUser());
        setUser(sessionUser);
        const postData = await fetch(`/api/posts/${sessionUser.username}/${params.posturl}`, {
          method: "GET",
     })
     if (!postData.ok) {
          throw new Error(postData.statusText);
        }

    if (postData.status === 404) {
          route.push('/404')
        }
     const post = await postData.json()
        setPost(post);
        setLoading(false);
      } catch (error) {
        console.error(error);
        route.push('/404')
      }
    }

    fetchData();
  }, [params.posturl]);
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-14 lg:p-20 editor">
     {!loading && <PostEditorForm post={post} />}
    </main>
  )
}
