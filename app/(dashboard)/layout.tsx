import { ReactNode, Suspense } from "react";

import CliComp from "@/providers/modalProvider";
import Welcome from "@/components/Welcome";

import Filter from "@/components/Filter";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div suppressHydrationWarning className=" min-h-screen lg:!pt-20 ">
      <div
        className=" w-[100dvw]   max-lg:h-[35dvh] pt-6 pb-14
         max-lg:pt-6  max-lg:px-4 px-16
        from-[40%]  bg-gradient-to-t space-y-6  from-main to-minor   z-[0]"
      >
        <CliComp>
          <Welcome />
          <Suspense fallback={<div>Loading filter</div>}>
            {" "}
            <Filter />
          </Suspense>
        </CliComp>{" "}
      </div>

      <div className=" px-16 max-lg:px-4 -mt-6  w-full ">
        {children}
      </div>
    </div>
  );
}
