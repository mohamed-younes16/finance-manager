"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  useAddTransaction,
  useDeleteTransaction,
  usePatchTransaction,
} from "@/hooks/transcation-hooks";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { useGetAccounts } from "@/hooks/accounts-hooks";
import { useGetCategories } from "@/hooks/categories-hooks";
import { cn } from "@/lib/utils";
import {
  transactionSchema,
  transactionSchemaType,
} from "@/models/Schemas/Setup";
import { toMilliunits } from "@/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import CheckRefrence from "../inputs/CheckRefrence";
import AmountInput from "../inputs/Counter";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

const TransactionForm = ({
  OnDone,
  defaultValues,
  id,
}: {
  OnDone: () => void;
  defaultValues: transactionSchemaType | null;
  id?: string;
}) => {
  const { refresh } = useRouter();
  const {
    isPending: p1,
    mutate: addHandler,
    isSuccess: s1,
  } = useAddTransaction();
  const {
    isPending: p2,
    mutate: patchHandler,
    isSuccess: s2,
  } = usePatchTransaction();
  const {
    isPending: p3,
    mutate: deleteHandler,
    isSuccess: s3,
  } = useDeleteTransaction();
  const { data: accounts, isLoading: l4 } = useGetAccounts();
  const { data: categories, isLoading: l5 } = useGetCategories();
  const isPending = p1 || p2 || p3 || l4 || l5;
  const isSuccess = s1 || s2 || s3;
  const [choice, setChoice] = useState<"positive" | "negative">(
    defaultValues
      ? defaultValues.amount > 0
        ? "positive"
        : "negative"
      : "positive"
  );

  const form = useForm<transactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      ...defaultValues,
      accountId:
        (defaultValues && defaultValues?.accountId) ||
        (accounts && accounts[0]?.id) ||
        "",
      categoryId:
        (defaultValues && defaultValues?.categoryId) ||
        (categories && categories[0]?.id) ||
        "",
      category:
        (defaultValues && defaultValues?.category) ||
        (categories && categories[0]?.name) ||
        "",
      notes: "",
    },
  });

  const { handleSubmit, control, formState, watch, setValue } = form;

  async function onSubmit(values: transactionSchemaType) {
    try {
      const absAmount = Math.abs(values.amount);
      const amount = choice === "negative" ? absAmount * -1 : absAmount;
      const data = {
        ...values,
        amount: toMilliunits(amount),
      };

      if (id) {
        patchHandler({ id, ...data });
      } else addHandler(data);
      refresh();
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = () => {
    deleteHandler({
      ids: [id as string],
    });
    OnDone();
  };
  useEffect(() => {
    if (isSuccess) OnDone();
  }, [isSuccess]);

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className=" p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value || "")}
                    onSelect={(v) => field.onChange(v?.toISOString())}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="payee"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className=" font-semi-bold text-lg">Payee</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {accounts && (
          <FormField
            control={control}
            name="accountId"
            disabled={isPending}
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel className=" font-semi-bold text-lg">
                  Account
                </FormLabel>
                <FormControl>
                  <CheckRefrence
                    type="account"
                    data={accounts}
                    setRefrence={(v) =>
                      setValue("accountId", v?.id ?? "", {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    Refrence={watch("accountId")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {categories && (
          <FormField
            control={control}
            name="categoryId"
            disabled={isPending}
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel className=" font-semi-bold text-lg">
                  Category
                </FormLabel>
                <FormControl>
                  <CheckRefrence
                    data={categories}
                    type="category"
                    setRefrence={(v) => {
                      setValue("categoryId", v?.id ?? "", {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      setValue("category", v?.name ?? "");
                    }}
                    Refrence={watch("categoryId") || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name="amount"
          disabled={isPending}
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel className=" font-semi-bold text-lg">Amount</FormLabel>
              <FormControl>
                <div>
                  <AmountInput
                    form={form}
                    setChoice={setChoice}
                    choice={choice}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="notes"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className=" font-semi-bold text-lg">Notes</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending || !formState.isValid || !formState.isDirty}
          className={`${
            isPending && "opacity-50"
          } bg-minor flexcenter w-full gap-2`}
        >
          {id ? "Update" : "Submit"}
          {isPending && (
            <div
              className="w-4 h-4 border-2 border-white
   dark:border-black !border-t-transparent rounded-full animate-spin"
            />
          )}
        </Button>
        {!!id && (
          <Button
            variant={"outline"}
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className={`${
              isPending && "opacity-50"
            } flexcenter w-full  hover:text-red-700 font-semibold  gap-2`}
          >
            <Trash2Icon />
            <p>Delete Transaction</p>
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TransactionForm;
