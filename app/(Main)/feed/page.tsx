import dynamic from 'next/dynamic';

export default function Feed() {
     const LoadedFeed = dynamic(() => import('@/components/feed/feed'), {
          ssr: false,
     });
     return (
          <>
               <LoadedFeed />
          </>
     )
}