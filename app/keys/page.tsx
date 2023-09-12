export default function Page() {
     return (
     <div>
          <h1>{ process.env.GITHUB_ID }</h1>
          <h1>{ process.env.GITHUB_SECRET }</h1>
     </div>
     )
}