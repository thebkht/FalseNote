import postgres from "@/lib/postgres";

// actions.ts
export async function incrementPostViews({ post, author} : { post: any, author: any }) {
     const cookieName = `post_views_${author?.username}_${post?.url}`;

     // Make an API request to increment the view count
     await postgres.post.update({
          where: {
            url: post?.url,
            authorId: author?.id,
          },
          data: {
            views: {
              increment: 1,
            },
          },
        });

     // Prepare the cookie information to be set
     const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
     return {
          name: cookieName,
          value: "true",
          path: `/${author?.username}/${post?.url}`,
          expires: expirationDate,
          secure: true,
     };
}