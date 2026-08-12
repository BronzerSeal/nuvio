import { cn } from "@shared/lib/utils";

export function Content({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-full flex flex-col items-start gap-y-4 ", className)}
      {...props}
    />
  );
}
