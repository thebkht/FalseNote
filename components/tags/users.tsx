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
     const settings = {
          dots: false,
          infinite: false,
          draggable: true,
          speed: 500,
          slidesToShow: 5,
          slidesToScroll: 1,
          responsive: [
               {
                    breakpoint: 1024,
                    settings: {
                         slidesToShow: 4,
                         slidesToScroll: 1,
                    }
               },
               {
                    breakpoint: 600,
                    settings: {
                         slidesToShow: 3,
                         slidesToScroll: 3,
                    }
               },
               {
                    breakpoint: 480,
                    settings: {
                         slidesToShow: 1,
                         slidesToScroll: 1
                    }
               }
          ]
     };
     return (
          <div className="flex justify-center w-full">
               <div className="mb-20 w-full">
                    <div className="my-10">
                         <h2 className="text-2xl font-medium tracking-tight w-full">Who to follow</h2>
                    </div>
                    <div className="mt-6 mb-10">
                         {/* <div className="flex md:grid md:grid-cols-3 overflow-x-hidden overflow-y-scroll lg:grid-cols-4 xl:grid-cols-5 py-0.5 items-center gap-6 justify-between">
                              {
                                   followers.map((follower: any) => (
                                        <UserVerticalCard key={follower.id} user={follower.follower} session={session} />
                                   ))
                              }
                         </div> */}
                         <Swiper
                              slidesPerView={5}
                              spaceBetween={24}
                              navigation={
                                   {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev'
                                   }
                              }
                              modules={[Navigation]}
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
                                   }
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