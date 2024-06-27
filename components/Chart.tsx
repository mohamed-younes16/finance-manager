import { FileSearch2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AreaVariant from "./AreaVariant";
import BarVariant from "./BarVariant";
import LineVariant from "./LineVariant";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const variants = ["area", "bar", "line"] as const;
type VariantChartType = (typeof variants)[number];
const Chart = ({
  data,
}: {
  data: {
    date: string;
    income: number;
    expense: number;
  }[];
}) => {
  const [chartType, setChartType] = useState<VariantChartType>("area");
  return (
    <Card className=" shadow-2xl">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className=" text-2xl">Chart</CardTitle>
        <Select
          value={chartType}
          onValueChange={(e: VariantChartType) => setChartType(e)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Variant" />
          </SelectTrigger>
          <SelectContent>
            {variants.map((e, i) => (
              <SelectItem value={variants[i]}>{variants[i]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className=" w-full  h-[50dvh] max-xl:h-[35dvh]">
        {data?.length === 0 ? (
          <div className=" flex flex-col flexcenter h-[300px] w-full gap-y-4 ">
            <FileSearch2 className="h8 w-8 text-muted-foreground" />
            <p className=" text-muted-foreground text-lg">
              No Data Found for this period
            </p>
          </div>
        ) : !!data ? (
          chartType == "area" ? (
            <AreaVariant data={data} />
          ) : chartType === "bar" ? (
            <BarVariant data={data} />
          ) : (
            <LineVariant data={data} />
          )
        ) : null}
      </CardContent>
    </Card>
  );
};

export default Chart;
