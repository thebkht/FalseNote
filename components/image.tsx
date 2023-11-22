import Image, { ImageProps } from "next/image";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
     typeof window === 'undefined'
          ? Buffer.from(str).toString('base64')
          : window.btoa(str)

          export function ImageComponent({ ...props }: ImageProps) {
               let width = typeof props.width === 'number' ? props.width : 0;
               let height = typeof props.height === 'number' ? props.height : 0;
             
               return (
                 <Image
                   {...props}
                   alt={props.alt}
                   placeholder={`blur`}
                   width={width}
                   blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
                   layout="responsive"
                 />
               );
             }