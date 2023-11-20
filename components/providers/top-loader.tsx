"use client";

import { Theme } from "@/lib/theme";
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";

function TopLoader() {
  const { theme, setTheme } = useTheme(); 
  return (
    <NextTopLoader
      color="#2463eb"
      initialPosition={0.08}
      crawlSpeed={200}
      height={5}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      shadow="0 0 10px #2463eb,0 0 5px #2463eb"
    />
  );
}

export default TopLoader;