"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import TagPostCard from "./post-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserVerticalCard from "../user-vertical-card";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Navigation, Pagination } from 'swiper/modules';

export default function TagFollowers({ followers: initialFollowers, tag, session }: { followers: any, tag: any, session: any }) {
     const [followers, setFollowers] = useState<Array<any>>(initialFollowers);
     useEffect(() => {
          setFollowers(initialFollowers)
     }, [initialFollowers])
     return (
          <div className="flex justify-center w-full">
               <div className="mb-20 w-full">
                    <div className="my-10">
                         <h2 className="text-2xl font-medium tracking-tight w-full">Who to follow</h2>
                    </div>
                    <div className="mt-6 mb-10">
                         <Swiper
                              slidesPerView={5}
                              spaceBetween={24}
                              breakpoints={{
                                   1280: {
                                        slidesPerView: 5,
                                        spaceBetween: 24,
                                   },
                                   1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                   },
                                   768: {
                                        slidesPerView: 3,
                                        spaceBetween: 24,
                                        
                                   },
                                   640: {
                                        slidesPerView: 1,
                                        spaceBetween: 24,
                                   },
                                   320: {
                                        slidesPerView: 1,
                                        spaceBetween: 24,
                                   },
                              }}
                              className="mySwiper"
                         >
                              {
                                   followers.map((follower: any) => (
                                        <SwiperSlide key={follower.id}><UserVerticalCard user={follower.follower} session={session} /></SwiperSlide>
                                   ))
                              }
                              
                         </Swiper>
                    </div>
                    {/* <div className="mt-20">
                         <Button variant={"outline"} size={"lg"} asChild>
                              <Link href={`/tag/${tag.name}/popular`}>
                                   See more popular posts
                              </Link>
                         </Button>
                    </div> */}
               </div>
          </div>
     )
}