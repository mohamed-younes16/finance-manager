"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ClipboardEdit,
  CopyIcon,
  GripVertical,
  LucideTrash2,
} from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/hooks/store";
import { useDeleteTransaction } from "@/hooks/transcation-hooks";
import { ResponseTransactionsGetType } from "../page";
import { transactionSchema } from "@/models/Schemas/Setup";

const CellAction = ({ data }: { data: ResponseTransactionsGetType }) => {
  const { setchoosenId, setFormData } = useStore();
  const { mutate } = useDeleteTransaction();

  const {
    id: accountId,
    accountRef: { name },
    amount,
    notes,
    payee,
    createdAt,
    categoryRef,
  } = data;

  const copy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Copied");
  };
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="shadow-none " asChild>
          <Button variant="ghost" className="p-2 rounded-full">
            <GripVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36 font-bold">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setchoosenId(accountId);
              const da = transactionSchema.safeParse({
                amount,
                payee,
                notes: notes ?? "",
                createdAt,
                category: categoryRef?.name ?? "",
                accountId,
                categoryId: categoryRef?.id ?? "",
              });
              if (da?.data) setFormData({ type: "transaction", data });
            }}
            className="flex items-center gap-3"
          >
            <ClipboardEdit /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => copy()}
            className="flex items-center gap-3"
          >
            <CopyIcon /> Copy
          </DropdownMenuItem>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex text-red-600 items-center gap-3">
              <LucideTrash2 /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>{" "}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Label and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!flex-col-reverse sm">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              mutate({ ids: [data.id] });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CellAction;
