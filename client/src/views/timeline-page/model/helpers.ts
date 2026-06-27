// Styling helper
export function getSlotBgColorClass(type: string): string {
  const colors = {
    meeting: "bg-blue-500",
    workshop: "bg-emerald-500",
    break: "bg-purple-500",
    review: "bg-amber-500",
  };
  return colors[type as keyof typeof colors] || "bg-foreground";
}
export function getSlotTextColorClass(type: string): string {
  const colors = {
    meeting: "text-blue-500",
    workshop: "text-emerald-500",
    break: "text-purple-500",
    review: "text-amber-500",
  };
  return colors[type as keyof typeof colors] || "text-gray-500";
}
