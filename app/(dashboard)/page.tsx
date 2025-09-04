import { DataCharts } from "@/components/DataCharts";
import DataGrid from "@/components/DataGrid";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <div className=" space-y-8  w-full mx-auto pb-10 ">
      <Suspense>

        <DataGrid />
        <DataCharts />
      </Suspense>{" "}
    </div>
  );
}
