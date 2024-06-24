"use client";
import Heading from "@/components/Heading";
import { DataTable } from "@/components/ui/data-table";

import { format } from "date-fns";

import { Loader2, Users2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { AccountResponseGetType, columns } from "./components/columns";

import CliComp from "@/providers/modalProvider";
import FormSheet from "@/components/sheets/FormSheet";
import { useDeleteAccount, useGetAccounts } from "@/hooks/accounts-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

const page = ({ params: { storeId } }: { params: { storeId: string } }) => {
  const { data: accounts, isLoading } = useGetAccounts();
  const { mutate, isPending } = useDeleteAccount();
  const isDisabeled = isLoading || isPending;

  let formattedAccounts: AccountResponseGetType[] = [];
  if (accounts) {
    formattedAccounts = accounts.map((e) => ({
      id: e.id,
      createdAt: format(e.createdAt, "MMMM do , yyyy"),
      name: e.name,
    }));
  }

  return (
    <div className="bg-background min-h-screen rounded-md py-4  w-full px-8 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Accounts Page</h1>
        <CliComp>
          <FormSheet type="account" />
        </CliComp>
      </div>
      <div className="flex items-center justify-between">
        <Heading
          icon={<Users2Icon className="text-foreground h-10 w-10" />}
          title={`List Of Accounts`}
          description="Manage all your Accounts ."
        />{" "}
        <Link
          href={`/dashboard/${storeId}/categories/new`}
          className="flexcenter"
        ></Link>
      </div>{" "}
      <Separator className="my-6" />
      {!!accounts ? (
        <DataTable
          OnDelete={(Ids) => mutate({ Ids: Ids.map((e) => e.original.id) })}
          disabled={isDisabeled}
          searchKey="name"
          columns={columns}
          data={formattedAccounts}
        />
      ) : (
        <div className="flex gap-6 flex-col items-center py-6">
          <Loader2 className=" w-14 h-14 animate-spin text-foreground" />
          <div className="border w-full  rounded-lg shadow-sm">
            <div className="relative w-full overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">
                      <Checkbox />
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="min-h-[60dvh]">
                  <tr className="animate-pulse">
                    <td className="px-4 py-3 border-b">
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-40" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-24" />
                    </td>
                    <td className="px-4 py-3 border-b text-right">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>
                  <tr className="animate-pulse">
                    <td className="px-4 py-3 border-b">
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-40" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-24" />
                    </td>
                    <td className="px-4 py-3 border-b text-right">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>{" "}
                  <tr className="animate-pulse">
                    <td className="px-4 py-3 border-b">
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-40" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-24" />
                    </td>
                    <td className="px-4 py-3 border-b text-right">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>{" "}
                  <tr className="animate-pulse">
                    <td className="px-4 py-3 border-b">
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-40" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-24" />
                    </td>
                    <td className="px-4 py-3 border-b text-right">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>{" "}
                  <tr className="animate-pulse">
                    <td className="px-4 py-3 border-b">
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-40" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-24" />
                    </td>
                    <td className="px-4 py-3 border-b text-right">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>{" "}
                  <tr className="animate-pulse">
                    <td className="px-4 py-3 border-b">
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-40" />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <Skeleton className="h-8 w-24" />
                    </td>
                    <td className="px-4 py-3 border-b text-right">
                      <Skeleton className="h-8 w-16" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
