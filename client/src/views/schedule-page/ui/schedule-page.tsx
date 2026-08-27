"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Main } from "@shared/ui/main";
import AvailabilityTab from "./availability-tab";
import TimelineTab from "./timeline-tab";
import React from "react";
import { useParams } from "next/navigation";
import { socket } from "@/shared/api/websockets";

export default function SchedulePage() {
  const { companyId } = useParams() as { companyId?: string };
  //WEBSOCKETS
  React.useEffect(() => {
    if (!companyId) return;

    const joinSchedule = () => {
      socket.emit("join-schedule", companyId);
    };

    joinSchedule();

    socket.on("connect", joinSchedule);

    return () => {
      socket.off("connect", joinSchedule);
      socket.emit("leave-schedule", companyId);
    };
  }, [companyId]);

  return (
    <>
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        </div>
        <Tabs defaultValue="availability">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="availability" className="space-y-4">
            <AvailabilityTab />
          </TabsContent>
          <TabsContent value="timeline" className="space-y-4">
            <TimelineTab />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
