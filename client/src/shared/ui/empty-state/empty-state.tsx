import Lottie from "lottie-react";
import animationData from "./animation/load-board-error.json";

const EmptyState = ({ text }: { text: string }) => {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        <Lottie animationData={animationData} className="h-48 w-48" />
        <h1>{text}</h1>
      </div>
    </div>
  );
};

export default EmptyState;
