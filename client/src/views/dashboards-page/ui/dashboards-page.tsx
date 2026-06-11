"use client";
import { Button } from "@/shared/ui/button";
import Lottie from "lottie-react";
import animationData from "../animations/no-data.json";

const DashboardPage = () => {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        <Lottie animationData={animationData} className="h-48 w-48" />
        <h1>No projects yet</h1>
        <Button>Create your first</Button>
      </div>
    </div>
  );
};

export default DashboardPage;
