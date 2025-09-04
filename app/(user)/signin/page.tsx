import AnimatedLogo from "@/components/AnimatedLogo";
import AuthComponent from "@/components/AuthComponent";
import MenuItem from "@/components/navbar/MenuItem";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ui/themeButton";

import Image from "next/image";

export const metadata = {
  title: "Finance",
  description: "finance manager",
};
export default async function Home() {
  return (
    <div
      className="min-h-screen bg-cover  transition-all
     max-lg:bg-[url(/assets/auth-bg.svg)] 
         dark:max-lg:bg-[url(/assets/auth-bg-dark.svg)] 
     relative max-lg:flex-col max-lg:py-2 flexcenter bg-white dark:bg-neutral-900"
    >
      <div
        className=" w-[60%]
         px-2 lg:px-6
          transition-all  relative z-10 max-lg:w-full  flexcenter"
      >
        <div
          className="w-full  backdrop-blur-[3px] border-[1px] px-4
  bg-accent/40 dark:bg-accent/60  py-12 flex max-h-fit flex-col max-w-lg max-lg:max-w-md max-lg:py-6 lg:min-h-[90dvh] shadow-xl  rounded-xl max-lg:border-background/70"
        >
          <AuthComponent />{" "}
          <div className="   w-full">
            <Separator className=" mt-auto my-3" />
            <MenuItem className="bg-background  mx-auto w-fit border-foreground shadow-xl">
              <div className="flex gap-2 items-center">
                <ModeToggle>
                  <div className="ml-2 ">Toggle Theme</div>
                </ModeToggle>
              </div>
            </MenuItem>
          </div>
        </div>{" "}
      </div>

      <div className="lg:w-[40%] lg:min-h-screen relative flexcenter">
        <Image
          alt="auth bg"
          className="object-cover dark:hidden  z-0"
          fill
          src={"/assets/auth-bg.svg"}
        />{" "}
        <Image
          alt="auth bg"
          className="object-cover hidden dark:flex  z-0"
          fill
          src={"/assets/auth-bg-dark.svg"}
        />{" "}
        <AnimatedLogo className="h-[100px] relative z-10 max-lg:hidden  stroke-white w-[100px]" />
      </div>
    </div>
  );
}
