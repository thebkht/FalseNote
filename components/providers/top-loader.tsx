"use client";

import NextTopLoader from "nextjs-toploader";

function TopLoader() {
  return (
    <NextTopLoader
      color="#1e9cf1"
      initialPosition={0.1}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={0.5}
      template="Loading..."
      shadow="0 0 10px #2299DD,0 0 5px #2299DD"
    />
  );
}

export default TopLoader;