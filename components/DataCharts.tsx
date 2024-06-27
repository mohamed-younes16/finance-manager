"use client";

import { useGetsummary } from "@/hooks/summary-hooks";
import React from "react";
import Chart from "./Chart";
import BarVariant from "./BarVariant";
import SpendingPie from "./SpendingCategory";

export const DataCharts = () => {
  const { data, isLoading } = useGetsummary();

  return (
    <div className="  grid  gap-8 lg:grid-cols-6  grid-cols-1">
      <div className="col-span-1 lg:col-span-4">
        {data && (
          <>
            <Chart data={data.days} />
          </>
        )}
      </div>
      <div className="col-span-1 lg:col-span-2 ">
        {data && (
          <>
            <SpendingPie data={data.categories} />
          </>
        )}
      </div>
    </div>
  );
};
