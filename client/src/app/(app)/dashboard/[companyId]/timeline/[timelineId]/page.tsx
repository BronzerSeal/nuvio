"use client";
import TimelinePageSkeleton from "@/views/timeline-page/ui/timeline-page-skeleton";
// import TimelinePage from "@/views/timeline-page";
import dynamic from "next/dynamic";

// const TimelinePageRoute = () => {
//   return <TimelinePage />;
// };
// export default TimelinePageRoute;

const TimelinePage = dynamic(() => import("@/views/timeline-page"), {
  ssr: false,
  loading: () => <TimelinePageSkeleton />,
});

export default function TimelinePageRoute() {
  return <TimelinePage />;
}
