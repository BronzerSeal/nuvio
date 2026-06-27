"use client";
// import TimelinePage from "@/views/timeline-page";
import dynamic from "next/dynamic";

// const TimelinePageRoute = () => {
//   return <TimelinePage />;
// };
// export default TimelinePageRoute;

const TimelinePage = dynamic(() => import("@/views/timeline-page"), {
  ssr: false,
});

export default function TimelinePageRoute() {
  return <TimelinePage />;
}
