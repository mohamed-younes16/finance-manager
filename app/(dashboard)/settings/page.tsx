"use client";
import Heading from "@/components/Heading";
import SubscribeModal from "@/components/SubscribeModal";
import { Separator } from "@/components/ui/separator";
import { usePolarPortal } from "@/hooks/polar-hooks";
import { useGetPlan } from "@/hooks/purchase-hooks";
import CliComp from "@/providers/modalProvider";
import { CheckCircle, Loader2, Settings } from "lucide-react";

const page = () => {
  const { data: plan } = useGetPlan();
  const { data: portal } = usePolarPortal();
  
  return (
    <div className="bg-background min-h-[40dvh]  space-y-4 rounded-md py-4  w-full px-8 max-lg:px-4 ">
      <div className="flex items-center justify-between">
        <Heading
          icon={<Settings className="text-foreground h-10 w-10" />}
          title={`Your settings Options `}
          description="Manage all your Settings."
        />
      </div>
      <Separator className=" my-4" />
      <div
        className="flex p-3 rounded-xl shadow-sm hover:shadow-md 
      transition-all border-foreground/20 border-[1px]  items-center justify-between"
      >
        {plan ? (
          <>
            <p className=" text-lg font-semibold">Subpscription</p>
            <div>{plan?.isPro ? "You are On A Pro Plan" : "No Plan Yet"}</div>
            <CliComp>
              <div>
                {" "}
                {!plan.isPro ? (
                  <SubscribeModal />
                ) : (
                  <>
                    <div className=" flexcenter font-semibold text-minor gap-4">
                      <CheckCircle strokeWidth={3} className="h-8 w-8" />
                      <p>Subscribed</p>
                    </div>
                  </>
                )}
              </div>
            </CliComp>
          </>
        ) : (
          <Loader2 className=" h-8 w-8 mx-auto text-foreground animate-spin" />
        )}
      </div>{" "}
      <Separator />
      <div
        className="flex p-3 rounded-xl shadow-sm hover:shadow-md 
      transition-all border-foreground/20 border-[1px]  items-center justify-between"
      >
        {plan && plan.isPro ? (
          <>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Manage Subscription</p>
              <p className="text-sm text-muted-foreground">
                Update your billing details, cancel, or change your plan
                anytime.
              </p>
            </div>
            {portal?.url && (
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Open Portal
              </a>
            )}
          </>
        ) : (
          <Loader2 className=" h-8 w-8 mx-auto text-foreground animate-spin" />
        )}
      </div>
    </div>
  );
};

export default page;
