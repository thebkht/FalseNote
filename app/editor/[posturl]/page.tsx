"use client"
import { PostEditorForm } from '@/components/editor/post-editor-form'
import { getSessionUser } from '@/components/get-session-user';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PostEditor({ params }: { params: { posturl: string } }) {
  const [user, setUser] = useState<any | null>(null);
  const [post, setPost] = useState<any>(null); // State for the post object
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionUser = (await getSessionUser());
        setUser(sessionUser);
        const postData = await fetch(`/api/posts/${sessionUser.username}?url=${params.posturl}`, {
          method: "GET",
     })
     const post = await postData.json()
        setPost(post);
      } catch (error) {
        console.error(error);
        router.push('/404');
      }
    }

    fetchData();
  }, [params.posturl, router]);
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-14 lg:p-20 editor">
     <PostEditorForm post={post} />
    </main>
  )
}
