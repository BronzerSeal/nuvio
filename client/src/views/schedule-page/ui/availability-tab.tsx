"use client";

import { useCompanyAvailability, useTimeSpans } from "@/entity/availability";
import { socket } from "@/shared/api/websockets";
import { queryClient } from "@shared/lib/query-client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React from "react";
import { AvailabilitySkeleton } from "@entity/availability";

const Availability = dynamic(
  () =>
    import("@entity/availability").then((m) => ({
      default: m.Availability,
    })),
  {
    ssr: false,
  },
);

interface AvailabilityTabProps {
  active: boolean;
}

const AvailabilityTab = ({ active }: AvailabilityTabProps) => {
  const { companyId } = useParams() as { companyId?: string };
  const { data: availability, isLoading: isAvailabilityLoading } =
    useCompanyAvailability(companyId!, !!companyId);
  // console.log(availability);
  const availabilityId = availability?.id;
  const { data: stamps, isLoading } = useTimeSpans(
    availabilityId!,
    !!availabilityId,
  );
  console.log("AVAILABILITY TAB", {
    active,
    availabilityId,
  });
  //WEBSOCKETS
  React.useEffect(() => {
    if (!active || !availabilityId) return;

    const joinAvailability = () => {
      socket.emit("join-availability", availabilityId);
    };

    joinAvailability();
    socket.on("connect", joinAvailability);

    return () => {
      socket.off("connect", joinAvailability);

      socket.emit("leave-availability", availabilityId);
    };
  }, [active, availabilityId]);

  React.useEffect(() => {
    if (!availabilityId) return;

    const handleAvailabilityUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["availability-time-spans", availabilityId],
      });
    };

    socket.on("availability-updated", handleAvailabilityUpdated);

    return () => {
      socket.off("availability-updated", handleAvailabilityUpdated);
    };
  }, [availabilityId]);

  const isGlobalLoading = isAvailabilityLoading || isLoading;
  return (
    <div className="w-full h-full rounded-lg">
      {isGlobalLoading ? (
        <AvailabilitySkeleton />
      ) : (
        <Availability value={stamps} startTime={4} endTime={24} />
      )}
    </div>
  );
};

export default AvailabilityTab;
