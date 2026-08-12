"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Main } from "@shared/ui/main";
import AvailabilityTab from "./availability-tab";
import TimelineTab from "./timeline-tab";
import React from "react";
// import TimelineTab from "./timeline-tab";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = React.useState("availability");
  return (
    <>
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        </div>
        <Tabs
          defaultValue="availability"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="availability" className="space-y-4">
            <AvailabilityTab active={activeTab === "availability"} />
          </TabsContent>
          <TabsContent value="timeline" className="space-y-4">
            <TimelineTab active={activeTab === "timeline"} />
            {/* <p>some</p> */}
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
