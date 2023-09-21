import Image from "next/image";

export default function Landing() {
     return (
          <>
          <main className="landing">
      <div className="landing__hero">
        <div className="landing__hero_content flex flex-col items-center">
          <div className="landing_hero-image my-20">
            <Image src="https://s3.ap-northeast-2.amazonaws.com/falsenotes.app/assets/media/header/header-img.png" sizes="100vw" width={1200} height={600}
        // Make the image display full width
        style={{
          width: '100%',
          height: 'auto',
        }} alt="" />
          </div>
          <h1 className="landing__hero_title max-w-[1200px] font-black leading-snug text-7xl text-center">Start Your Journey with FalseNotes!</h1>
          <p className="landing__hero_description mt-6 mx-auto max-w-[960px] font-medium text-2xl leading-relaxed text-center">🚀 FalseNotes — a platform for Developers to Spark Discussions, Share Expertise, and Shape Coding Journeys.</p>
        </div>
      </div> 
      </main> 
          </>
     )
}