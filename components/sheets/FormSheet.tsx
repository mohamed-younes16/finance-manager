"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React, { useEffect } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "@/hooks/store";
import { Button } from "../ui/button";
import { useGetAccount } from "@/hooks/accounts-hooks";
import { useGetCategory } from "@/hooks/categories-hooks";
import DataForm from "../forms/DataForm";

const FormSheet = ({ type }: { type: "category" | "account" }) => {
  const { isFormSheetOpen, setIsFormSheetOpen, choosenId, setchoosenId } = useStore();
  const pathname = usePathname();

  const { data: entity, isLoading } = type === "account" ? useGetAccount(choosenId) : useGetCategory(choosenId);

  useEffect(() => setIsFormSheetOpen(false), [pathname]);

  return (
    <div className="flex gap-[10px] relative">
      <div className="">
        <Sheet
          open={isFormSheetOpen}
          onOpenChange={(e) => {
            setIsFormSheetOpen(e);
            !e && setchoosenId(undefined);
          }}
        >
          <SheetTrigger asChild className="">
            <Button className="flexcenter gap-3 text-lg font-semibold">
              <PlusCircle />
              <p>{type === "account" ? "Add Account" : "Add Category"}</p>
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="px-6 pt-20">
            <>
              <div className="text-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">{type === "account" ? "Account Form" : "Category Form"}</h1>
                <p className="text-foreground">
                  {type === "account" ? "Create an account to track your transactions" : "Create a category to track your transactions"}
                </p>
              </div>
              <div className="max-w-md mx-auto">
                {choosenId && isLoading ? (
                  <Loader2 className="w-14 h-14 animate-spin text-foreground" />
                ) : (
                  <DataForm
                    type={type}
                    id={entity?.id}
                    defaultValues={{
                      name: entity?.name || "",
                    }}
                    OnDone={() => {
                      setIsFormSheetOpen(false);
                      setchoosenId(undefined);
                    }}
                  />
                )}
              </div>
            </>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default FormSheet;
