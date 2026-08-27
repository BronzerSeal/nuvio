import { useServerStatus } from "@/entity/server";
import { AnimatedBadge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

const ServerStatus = () => {
  const { data: status } = useServerStatus();
  const CHIP_COLOR = status?.status === "ok" ? "success" : "warning";
  const CHIP_TEXT = status?.status === "ok" ? "Active" : "Enabling";
  return (
    <Card className="fixed top-4 right-4 z-50  p-2 rounded-sm gap-0">
      <div className="flex flex-row justify-center items-center gap-2">
        <p>Server status: </p>
        <AnimatedBadge status={CHIP_COLOR} size="sm">
          {CHIP_TEXT}
        </AnimatedBadge>
      </div>

      {CHIP_COLOR === "warning" && (
        <p className="text-[12px] text-gray-400">wait 1-2 minutes</p>
      )}
    </Card>
  );
};

export default ServerStatus;
