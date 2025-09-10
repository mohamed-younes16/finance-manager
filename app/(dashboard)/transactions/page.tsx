"use client";
import ImportCard from "@/components/forms/ImportCard";
import Heading from "@/components/Heading";
import UploadButton from "@/components/inputs/UploadButton";
import FormSheet from "@/components/sheets/FormSheet";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useGetPlan } from "@/hooks/purchase-hooks";
import {
  useDeleteTransaction,
  useGetTransactions,
} from "@/hooks/transcation-hooks";
import CliComp from "@/providers/modalProvider";
import { formatMilliunits } from "@/utils";
import { Users2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { TransactionResponseGetType, columns } from "./components/columns";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: [],
};
export type ResponseTransactionsGetType = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["transactions"][number];
const TransactionsContent = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountId = searchParams.get("accountId") || "";

  const { data: transactions, isLoading } = useGetTransactions({
    from,
    to,
    accountId,
  });
  const { mutate, isPending } = useDeleteTransaction();
  const isDisabled = isLoading || isPending;
  const { data: plan } = useGetPlan();

  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importRes, setImportRes] = useState(INITIAL_IMPORT_RESULTS);

  const endImport = () => {
    setVariant(VARIANTS.LIST);
    setImportRes(INITIAL_IMPORT_RESULTS);
  };

  const onUpload = (res: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant(VARIANTS.IMPORT);
    setImportRes(res);
  };

  let formattedTransactions: ResponseTransactionsGetType[] = [];
  if (transactions) {
    formattedTransactions = transactions.map((e) => ({
      ...e,
      amount: formatMilliunits(e.amount),
    }));
  }

  return (
    <div className="bg-background min-h-screen rounded-md py-4 w-full px-8 max-lg:px-4">
      {variant === VARIANTS.IMPORT ? (
        <div className="space-y-6">
          <div className="flex items-center gap-x-4">
            <UploadButton onUpload={onUpload} />
            <Button size={"sm"} onClick={endImport}>
              Cancel
            </Button>
          </div>
          <ImportCard data={importRes.data} onSubmit={endImport} />
        </div>
      ) : (
        <>
          <div className="flex mb-4 items-center max-lg:justify-center max-lg:gap-6 flex-wrap justify-between">
            <h1 className="text-xl font-bold">Transactions Page</h1>
            <CliComp>
              {!!plan && plan.isPro && <UploadButton onUpload={onUpload} />}
              <FormSheet type="transaction" />
            </CliComp>
          </div>
          <div className="flex items-center justify-between">
            <Heading
              icon={
                <Users2Icon className="text-foreground max-lg:h-6 max-lg:w-6 h-10 w-10" />
              }
              title={`List Of Transactions`}
              description="Manage all your Transactions ."
            />
          </div>
          <Separator className="my-6" />
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              queryKey={["transactions", { from, to, accountId }]}
              OnDelete={(ids) => mutate({ ids: ids.map((e) => e.original.id) })}
              disabled={isDisabled}
              searchKey="name"
              columns={columns}
              data={formattedTransactions}
            />
          )}
        </>
      )}
    </div>
  );
};

const TransactionsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <TransactionsContent />
    </Suspense>
  );
};

export default TransactionsPage;
