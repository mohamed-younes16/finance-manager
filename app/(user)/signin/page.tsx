import AnimatedLogo from "@/components/AnimatedLogo";
import AuthComponent from "@/components/AuthComponent";

import Image from "next/image";

export const metadata = {
  title: "Finance",
  description: "finance manager",
};
export default async function Home() {
  return (
    <div className="h-screen  relative max-md:flex-col flexcenter bg-white dark:bg-neutral-900">
      <div className=" w-[60%] relative z-10 max-md:w-full max-md:mt-14 px-4 flexcenter">
        <div className="w-full">
          <AuthComponent />
        </div>{" "}
      </div>
      <div className="md:w-[40%] md:min-h-full max-md:absolute 
       max-md:rounded-full  max-md:w-[150px] max-md:left-1/2
        max-md:h-[150px] max-md:top-1/2 max-md:-translate-x-1/2 
        max-md:-translate-y-1/2 max-md:animate-pulse max-md:blur-2xl bg-yellow-300 flexcenter">
        <AnimatedLogo className="h-[100px] max-md:hidden  stroke-black w-[100px]" />
      </div>
    </div>
  );
}
