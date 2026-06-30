import { ReactNode } from "react";
import { DotmSquare11 } from "./dotm-square-11";

export default function GridButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer justify-center gap-1 border-border bg-background border p-1 rounded active:translate-y-0.5 transition-all duration-75 active:scale-[0.98] ${className}`}
    >
      <Box />
      {children}
    </button>
  );
}

const Box = () => {
  return (
    <div className="bg-purple-400 size-7  rounded flex items-center justify-center">
      <DotmSquare11
        dotSize={2}
        cellPadding={1}
        className="text-white"
        boxSize={21}
        minSize={16}
      />
    </div>
  );
};
