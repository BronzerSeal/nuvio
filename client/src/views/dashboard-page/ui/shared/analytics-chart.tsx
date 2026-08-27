"use client";

import AreaChart, { Area } from "@shared/ui/bkit/charts/area-chart";
import Grid from "@shared/ui/bkit/charts/grid";
import { ChartTooltip } from "@shared/ui/bkit/charts/tooltip";
import XAxis from "@shared/ui/bkit/charts/x-axis";

const data = [
  { date: new Date("2026-07-28"), clicks: 420, uniques: 180 },
  { date: new Date("2026-07-29"), clicks: 560, uniques: 240 },
  { date: new Date("2026-07-30"), clicks: 610, uniques: 285 },
  { date: new Date("2026-07-31"), clicks: 540, uniques: 250 },
  { date: new Date("2026-08-01"), clicks: 690, uniques: 310 },
  { date: new Date("2026-08-02"), clicks: 760, uniques: 355 },
  { date: new Date("2026-08-03"), clicks: 810, uniques: 390 },
];

export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <AreaChart
        aspectRatio="auto"
        className="h-full"
        data={data}
        margin={{ top: 10, right: 14, bottom: 18, left: 14 }}
        style={{ height: "100%" }}
      >
        <Grid
          horizontal
          stroke="color-mix(in oklch, var(--chart-grid) 72%, transparent)"
        />
        <Area
          dataKey="clicks"
          fill="var(--chart-1)"
          fillOpacity={0.24}
          stroke="var(--chart-1)"
        />
        <Area
          dataKey="uniques"
          fill="var(--chart-2)"
          fillOpacity={0.2}
          stroke="var(--chart-2)"
        />
        <XAxis numTicks={5} />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}
