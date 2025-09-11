"use client";

import { useGetsummary } from "@/hooks/summary-hooks";
import Chart from "./Chart";
import SpendingPie from "./SpendingCategory";
import { useSearchParams } from "next/navigation";
import { useGetPlan } from "@/hooks/polar-hooks";

export const DataCharts = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountId = searchParams.get("accountId") || "";
  const { data } = useGetsummary({ from, to, accountId });
  const { data: planData } = useGetPlan();

  return (
    <div className="  grid  gap-8 lg:grid-cols-6  grid-cols-1">
      <div className="col-span-1 lg:col-span-4">
        {" "}
        {data && planData && (
          <>
            <Chart data={data.days} isPro={planData.isPro} />
          </>
        )}
      </div>
      <div className="col-span-1 lg:col-span-2 ">
        {data && planData && (
          <>
            <SpendingPie isPro={planData.isPro} data={data.categories} />
          </>
        )}
      </div>
    </div>
  );
};
