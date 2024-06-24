import { ReactNode } from "react";
import Footer from "@/components/Footer";
import CliComp from "@/providers/modalProvider";
import Welcome from "@/components/Welcome";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div suppressHydrationWarning className=" min-h-screen ">
      <div
        className=" w-[100dvw] pb-16 h-[40dvh] pt-[150px] px-28
        from-[40%]  bg-gradient-to-b  from-minor to-[#0b7ffc]   z-[0]"
      >
        <CliComp>
          <Welcome />
        </CliComp>
      </div>
      <div className=" px-16  w-full -mt-16">{children}</div>
    </div>
  );
}
