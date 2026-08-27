"use client";

import BarChart from "@shared/ui/bkit/charts/bar-chart";
import BarXAxis from "@shared/ui/bkit/charts/bar-x-axis";
import Grid from "@shared/ui/bkit/charts/grid";
import { ChartTooltip } from "@shared/ui/bkit/charts/tooltip";
import Bar from "@shared/ui/bkit/charts/bar";

const data = [
  { name: "Jan", total: 1800 },
  { name: "Feb", total: 2400 },
  { name: "Mar", total: 2100 },
  { name: "Apr", total: 2900 },
  { name: "May", total: 3400 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 3800 },
  { name: "Aug", total: 3600 },
  { name: "Sep", total: 4100 },
  { name: "Oct", total: 3900 },
  { name: "Nov", total: 4300 },
  { name: "Dec", total: 4700 },
];

export function Overview() {
  return (
    <div className="h-[350px] w-full">
      <BarChart aspectRatio="auto" className="h-full" data={data}>
        <Grid
          horizontal
          stroke="color-mix(in oklch, var(--chart-grid) 72%, transparent)"
        />
        <Bar dataKey="total" fill="var(--chart-1)" />
        <BarXAxis maxLabels={12} />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}

export default Overview;
