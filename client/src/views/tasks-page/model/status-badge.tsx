import { cn } from "@/shared/lib/utils";

type STATUS = "backlog" | "done" | "inProgress";

const STATUS_STYLES: Record<STATUS, string> = {
  backlog: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  inProgress: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function StatusBadge({ status }: { status: STATUS }) {
  return (
    <span
      className={cn(
        "rounded-sm px-2 py-0.5 font-medium text-xs capitalize",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
