"use client";

import { TimeSpan } from "@/views/availability-page/ui/availability";
import dynamic from "next/dynamic";
import React from "react";

const Availability = dynamic(
  () =>
    import("@/views/availability-page/ui/availability").then((m) => ({
      default: m.Availability,
    })),
  {
    ssr: false,
  },
);

const AvailabilityPage = () => {
  const [data, setData] = React.useState<TimeSpan[]>([
    {
      id: "1",
      week_day: 1,
      start_time: "09:00",
      end_time: "12:00",
      active: true,
    },
    {
      id: "2",
      week_day: 3,
      start_time: "14:00",
      end_time: "16:00",
      active: true,
    },
    {
      id: "3",
      week_day: 5,
      start_time: "10:00",
      end_time: "11:30",
      active: true,
    },
  ]);
  return (
    <div className="w-full h-full p-2 bg-background border rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Configure weekly working hours and availability. These time slots can
          be used for scheduling meetings, planning workloads, and checking team
          availability.
        </p>
      </div>
      <Availability
        value={data}
        onValueChange={setData}
        startTime={4}
        endTime={24}
      />
    </div>
  );
};

export default AvailabilityPage;
