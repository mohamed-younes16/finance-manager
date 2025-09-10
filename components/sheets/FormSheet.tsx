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
import TransactionForm from "../forms/TranscationForm";
import { useGetTransaction } from "@/hooks/transcation-hooks";

import { formatMilliunits } from "@/utils";
import {
  ResponseAccountType,
  ResponseCategoryType,
  ResponseTransactionGetType,
} from "@/index";

const FormSheet = ({
  type,
}: {
  type: "account" | "category" | "transaction";
}) => {
  const {
    isFormSheetOpen,
    setIsFormSheetOpen,
    choosenId,
    setchoosenId,
    formData,
    setFormData,
  } = useStore();
  const pathname = usePathname();

  // const { data, isLoading } =
  //   type === "account"
  //     ? useGetAccount(choosenId)
  //     : type === "category"
  //     ? useGetCategory(choosenId)
  //     : { data: null, isLoading: false };

  let transaction: ResponseTransactionGetType | null = null;
  let accountCategory: ResponseAccountType | ResponseCategoryType | null = null;

  if (formData) {
    if (formData.type === "transaction") transaction = formData.data;
    if (formData.type === "account" || formData.type === "category") {
      accountCategory = formData.data;
    }
  }

  useEffect(() => setIsFormSheetOpen(false), [pathname]);

  return (
    <div className="flex gap-[10px] relative">
      <div className="">
        <Sheet
          open={isFormSheetOpen}
          onOpenChange={(e) => {
            setIsFormSheetOpen(e);
            if (!e) {
              setchoosenId(undefined);
              setFormData(null);
            }
          }}
        >
          <SheetTrigger asChild className="">
            <Button className="flexcenter gap-3 text-lg font-semibold">
              <PlusCircle />
              <p>
                {type === "account"
                  ? "Add Account"
                  : type == "category"
                  ? "Add Category"
                  : "Add transaction"}
              </p>
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"} className="px-6 overflow-auto pt-20">
            <>
              <div className="text-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">
                  {type === "account"
                    ? "Account Form"
                    : type == "category"
                    ? "Category Form"
                    : "Transaction Form"}
                </h1>
                <p className="text-foreground">
                  {type === "account"
                    ? "Create an account to track your transactions"
                    : type == "category"
                    ? "Create a category to track your transactions"
                    : "Create your to transactions from scratch"}
                </p>
              </div>
              <div className="max-w-md mx-auto">
                {type === "transaction" ? (
                  choosenId ? (
                    !!transaction ? (
                      <TransactionForm
                        id={choosenId}
                        defaultValues={{
                          category: transaction.categoryRef?.name || "",
                          accountId: transaction.accountRef.id,
                          amount: transaction.amount,
                          categoryId: transaction?.categoryRef?.id || "",
                          notes: transaction.notes || "",
                          payee: transaction.payee,
                          createdAt: transaction.createdAt,
                        }}
                        OnDone={() => {
                          setIsFormSheetOpen(false);
                          setchoosenId(undefined);
                          setFormData(null);
                        }}
                      />
                    ) : null
                  ) : (
                    <TransactionForm
                      id={""}
                      defaultValues={null}
                      OnDone={() => {
                        setIsFormSheetOpen(false);
                        setchoosenId(undefined);
                        setFormData(null);
                      }}
                    />
                  )
                ) : (
                  <DataForm
                    type={type}
                    id={accountCategory?.id}
                    defaultValues={{
                      name: accountCategory?.name ?? "",
                    }}
                    OnDone={() => {
                      setIsFormSheetOpen(false);
                      setchoosenId(undefined);
                      setFormData(null);
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
