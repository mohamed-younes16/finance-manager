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
import PieVariant from "./PieVariant";
import RadarVariant from "./RadarVariant";
import RadialVariant from "./RadialVariant";

const variants = ["pie", "radar", "radio"] as const;
type VariantChartType = (typeof variants)[number];
const SpendingCategory = ({
  data,
}: {
  data: {
    category: string;
    value: number;
  }[];
}) => {
  const [chartType, setChartType] = useState<VariantChartType>("pie");
  return (
    <Card className=" shadow-2xl">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className=" text-2xl">Categories</CardTitle>
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
      <CardContent className=" w-full  h-] max-xl:h-[40dvh]">
        {data?.length === 0 ? (
          <div className=" flex flex-col flexcenter h-[300px] w-full gap-y-4 ">
            <FileSearch2 className="h8 w-8 text-muted-foreground" />
            <p className=" text-muted-foreground text-lg">
              No Data Found for this period
            </p>
          </div>
        ) : !!data ? (
          chartType == "pie" ? (
            <PieVariant data={data} />
          ) : chartType === "radar" ? (
            <RadarVariant data={data} />
          ) : (
            <RadialVariant data={data} />
          )
        ) : null}
      </CardContent>
    </Card>
  );
};

export default SpendingCategory;
