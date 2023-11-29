import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";

export const getFollowingTags = async ({ id }: { id: string | undefined }) => {
  const followingTags = await postgres.user.findFirst({
    where: { id },
    select: {
      tagfollower: {
        include: {
          tag: {
            include: {
              posts: {
                select: {
                  createdAt: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
          },
        },
      },
      id: true,
    },
  });

  const followingTagsWithLatestPostDate = followingTags?.tagfollower.map(tagFollower => {
    const latestPostDate = tagFollower.tag.posts[0]?.createdAt;

    return {
      ...tagFollower,
      latestPostDate,
    };
  });

  const sortedFollowingTags = followingTagsWithLatestPostDate?.sort((a, b) => new Date(b.latestPostDate).getTime() - new Date(a.latestPostDate).getTime());
  return {
    followingTags: sortedFollowingTags ? JSON.parse(JSON.stringify(sortedFollowingTags)) : [],
  };
};

export const getFollowings = async ({ id }: { id: string | undefined }) => {

  if (!id) {
    return { followings: [] };
  }
  const followings = await postgres.follow.findMany({
    where: { followerId: id },
    select: {
      following: {
        include: {
          Followers: true,
          Followings: true,
        },
      },
    },
  });

  return { followings: JSON.parse(JSON.stringify(followings || [])) };
};

export const getFollowers = async ({ id }: { id: string | undefined }) => {
  const followers = await postgres.user.findFirst({
    where: { id },
    select: {
      Followers: {
        include: {
          follower: true,
        },
      },
      id: true,
    },
  });
  return { followers: JSON.parse(JSON.stringify(followers?.Followers)) };
};

export const getPosts = async ({ id }: { id: string | undefined }) => {
  const posts = await postgres.user.findFirst({
    where: { id },
    select: {
      posts: {
        include: {
          author: true,
          tags: true,
          comments: true,
          likes: true,
        },
      },
      id: true,
    },
  });
  return { posts: JSON.parse(JSON.stringify(posts?.posts)) };
};

export const getLikes = async ({ id }: { id: string | undefined }) => {
  const likes = await postgres.user.findFirst({
    where: { id },
    select: {
      likes: {
        include: {
          post: true,
        },
      },
      id: true,
    },
  });

  return { likes: JSON.parse(JSON.stringify(likes?.likes)) };
};

export const getComments = async ({ id }: { id: string | undefined }) => {
  const comments = await postgres.user.findFirst({
    where: { id },
    select: {
      comments: {
        include: {
          post: true,
        },
      },
      id: true,
    },
  });

  return { comments: JSON.parse(JSON.stringify(comments?.comments)) };
};

export const getSettings = async ({ id }: { id: string | undefined }) => {
  const settings = await postgres.user.findFirst({
    where: { id },
    select: {
      settings: {
        select: {
          id: true,
          appearance: true,
          language: true,
          userId: true,
        }
      },
      id: true,
    },
  });

  return { settings: settings?.settings ? JSON.parse(JSON.stringify(settings?.settings)) : {} };
};

export const getBookmarks = async ({ id, limit = 5, page = 0 }: { id: string | undefined, limit?: number, page?: number }) => {
  const user = await postgres.user.findFirst({
    where: { id },
    include: {
      bookmarks: {
        include: {
          post: {
            include: {
              author: true,
              savedUsers: true,
              _count: {
                select: {
                 likes: true,
                 savedUsers: true,
                 readedUsers: true,
                 shares: true,
                 comments: true,
                },
              },
            }
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
        skip: page * limit,
      },
      _count: { select: { bookmarks: true } },
    },
  });

  return { bookmarks: JSON.parse(JSON.stringify(user?.bookmarks)), bookmarksCount: user?._count?.bookmarks };
};

export const getHistory = async ({ id, limit = 5, page = 0 }: { id: string | undefined, limit?: number, page?: number }) => {
  const user = await postgres.user.findFirst({
    where: { id },
    select: {
      id: true,
      readinghistory: {
        include: {
          post: {
            include: {
              author: true,
              _count: {
                select: {
                 likes: true,
                 savedUsers: true,
                 readedUsers: true,
                 shares: true,
                 comments: true,
                },
              },
            }
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
        skip: page * limit,
      },
      _count: { select: { readinghistory: true } },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const history = user.readinghistory.filter((historyItem : any) => historyItem.post !== null);

  return { history: JSON.parse(JSON.stringify(history)), historyCount: user._count.readinghistory };
}

export const getNotifications = async ({ id }: { id: string | undefined }) => {
  const notifications = await postgres.user.findFirst({
    where: { id },
    select: {
      notifications: {
        orderBy: {
          createdAt: "desc",
        },
      },
      id: true,
    },
  });

  const senderDetails = await postgres.user.findMany({
    where: {
      id: {
        in: notifications?.notifications
          .filter(notification => notification.senderId !== null)
          .map(notification => notification.senderId as string),
      },
    },
    include:{
      Followers: true,
      Followings: true,
    }
  });

  const notificationsWithSenderDetails = notifications?.notifications.map(notification => {
    const sender = senderDetails?.find(sender => sender.id === notification.senderId);
    return {
      ...notification,
      sender,
    };
  });

  return { notifications: JSON.parse(JSON.stringify(notificationsWithSenderDetails)) };
};
