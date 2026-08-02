"use client";

import { useTimeSpans } from "@/entity/availability";
import { socket } from "@/shared/api/websockets";
import { queryClient } from "@/shared/lib/query-client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React from "react";
import AvailabilitySkeleton from "./availability-skeleton";

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
  const { availabilityId } = useParams() as {
    availabilityId: string | undefined;
  };
  const { data: stamps, isLoading } = useTimeSpans(
    availabilityId!,
    !!availabilityId,
  );
  console.log(stamps);

  //WEBSOCKETS
  React.useEffect(() => {
    socket.emit("join-availability", availabilityId);
  }, [availabilityId]);

  React.useEffect(() => {
    socket.on("availability-updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["availability-time-spans", availabilityId],
      });
    });

    return () => {
      socket.off("availability-updated");
    };
  }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div className="w-full h-full p-2   rounded-lg">
      {/* <div className="-z-10">
        <BackgroundRippleEffect />
      </div> */}

      <div className="mb-6 z-20">
        <h1 className="text-2xl font-semibold tracking-tight">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Configure weekly working hours and availability. These time slots can
          be used for scheduling meetings, planning workloads, and checking team
          availability.
        </p>
      </div>
      {isLoading ? (
        <AvailabilitySkeleton />
      ) : (
        <Availability value={stamps} startTime={4} endTime={24} />
      )}
    </div>
  );
};

export default AvailabilityPage;
