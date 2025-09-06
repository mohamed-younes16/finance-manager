import { ReactNode, Suspense } from "react";

import CliComp from "@/providers/modalProvider";
import Welcome from "@/components/Welcome";

import Filter from "@/components/Filter";
import NavBar from "@/components/navbar/NavBar";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div suppressHydrationWarning className=" min-h-screen lg:!pt-20 ">
        <div
          className=" w-[100dvw]   max-lg:h-[35dvh] pt-6 pb-14
         max-lg:pt-6  max-lg:px-4 px-16
        from-[40%]  bg-gradient-to-t  from-main to-minor   z-[0]"
        >
          <div className="max-w-fit space-y-4 ">
            <Welcome />
            <Suspense>
              <Filter />
            </Suspense>
          </div>
        </div>

        <div className=" px-16 max-lg:px-4 -mt-6  w-full ">{children}</div>
      </div>
    </>
  );
}
