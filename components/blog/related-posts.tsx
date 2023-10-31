import TagPostCard from "../tags/post-card";

export default function RelatedPosts({ posts, post }: { posts: any, post: any }) {
     return (
          <>
               <div className="max-w-[680px] mx-auto">
                    <div className="mx-6">
                         <h2 className="text-2xl font-medium">Recommended from FalseNotes</h2>
                         <div className="mt-14">
                              <div className="flex items-stretch flex-wrap">
                                   {
                                        posts?.map((post: any) => (
                                             <div className="w-1/2" key={post.id}>
                                                  <TagPostCard post={post} />
                                             </div>
                                        ))
                                   }
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}