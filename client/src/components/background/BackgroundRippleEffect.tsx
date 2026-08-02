import { cn } from "@/shared/lib/utils";

export function BackgroundRippleEffect({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 ripple-bg" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="ripple-ring ripple-ring-1" />
        <div className="ripple-ring ripple-ring-2" />
        <div className="ripple-ring ripple-ring-3" />
        <div className="ripple-ring ripple-ring-4" />
      </div>
    </div>
  );
}
