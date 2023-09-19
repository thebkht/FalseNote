import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function NotFound() {
  const containerStyle = {
    fontFamily:
      'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "calc(100vh - 400px)",
    justifyContent: "center",
  };

  const h1Style = {
    display: "inline-block",
    fontSize: "24px",
    fontWeight: 500,
  };

  const h2Style = {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "28px",
  };

  return (
    <main className="flex max-h-screen space-y-5 flex-col items-center justify-around p-24">
      <div id="__next">
        <div style={
          {
               fontFamily:
                 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
               textAlign: "center",
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               height: "calc(100vh - 400px)",
               justifyContent: "center",
             }
        }>
          <div className="flex justify-around w-full items-center">
     
            <h1 className="next-error-h1" style={h1Style}>
              404
            </h1>
            <Separator className="h-10 mr-5 ml-5" orientation="vertical" />
            <div style={{ display: "inline-block" }}>
              <h2 style={h2Style}>This page could not be found.</h2>
            </div>
          </div>
          <Link href="/">Go back home</Link>
        </div>
      </div>
    </main>
  );
}
