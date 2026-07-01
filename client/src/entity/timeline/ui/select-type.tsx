import { Badge, BadgeProps } from "@shared/ui/badge";

import { Field } from "@shared/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";

const statuses = [
  { value: "review", label: "Review", variant: "warning-outline" },
  { value: "meeting", label: "Meeting", variant: "blue-outline" },
  { value: "break", label: "Break", variant: "info-outline" },
  { value: "workshop", label: "Workshop", variant: "primary-outline" },
];
type StatusValue = "meeting" | "workshop" | "break" | "review";

type SelectTypeProps = {
  value: StatusValue;
  onChange: (value: StatusValue | null) => void;
};

export function SelectType({ value, onChange }: SelectTypeProps) {
  const selected = statuses.find((o) => o.value === value);
  return (
    <Field>
      <Select value={value} onValueChange={onChange} items={statuses}>
        <SelectTrigger className="w-[200px]">
          <span className="flex items-center gap-2">
            Status:
            <SelectValue>
              {selected && (
                <Badge variant={selected.variant as BadgeProps["variant"]}>
                  {selected.label}
                </Badge>
              )}
            </SelectValue>
          </span>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <Badge variant={status.variant as BadgeProps["variant"]}>
                {status.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
