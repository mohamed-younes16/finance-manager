import { ReactNode } from "react";
import Footer from "@/components/Footer";
import CliComp from "@/providers/modalProvider";
import Welcome from "@/components/Welcome";
import CheckRefrence from "@/components/inputs/CheckRefrence";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div suppressHydrationWarning className=" min-h-screen ">
      <div
        className=" w-[100dvw]  pb-16 max-lg:h-[25dvh] lg:h-[40dvh]
         max-lg:pt-10 pt-[150px] max-lg:px-10 px-28
        from-[40%]  bg-gradient-to-b  from-minor to-[#0b7ffc]   z-[0]"
      >
        <CliComp>
          <Welcome />
        </CliComp>
      </div>
   
      <div className=" px-16 max-lg:px-2  w-full -mt-16">{children}</div>
    </div>
  );
}
