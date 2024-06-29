import { HomeIcon, LucideLogOut } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ProfileForm from "@/components/forms/ProfileForm";
import TooltipComp from "@/components/ui/TooltipComp";

import SignOutButton from "@/components/inputs/SignOutButton";
import getCurrentUser from "@/actions";
import CliComp from "@/providers/modalProvider";


const Page = async () => {
  const CurrentUserData = await getCurrentUser();

  return (
  
      <div>
        {CurrentUserData ? (
          <div className=" w-[80dvw]  p-4 rounded-2xl  mt-6 border-neutral-600 border backdrop-blur-md ">
            <div className="flex items-center  gap-6">
              <div className=" flexcenter  gap-4 ">
                <TooltipComp hoverText="Log-out">
                  <SignOutButton>
                    <LucideLogOut className="h-10 w-10 " />
                  </SignOutButton>
                </TooltipComp>
              </div>

              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Link href={"/"} aria-label="redirect to profile page ">
                      <HomeIcon className="h-10 w-10 " />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Main Page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="min-h-[60dvh]">
              <CliComp>
                <ProfileForm userData={CurrentUserData} />
              </CliComp>{" "}
            </div>
          </div>
        ) : // <UserLoginAlert/>
        null}{" "}
      </div>

  );
};

export default Page;
