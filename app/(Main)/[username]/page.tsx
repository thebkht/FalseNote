export default function Page({ params }: { params: { username: string } }) {
     return <div>Hello: {params.username}</div>
   }