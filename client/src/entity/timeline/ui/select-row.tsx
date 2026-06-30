import { TimelineRow } from "@/shared/types/bd-types";
import { Badge, BadgeProps } from "@shared/ui/badge";

import { Field } from "@shared/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";

type SelectTypeProps = {
  value: string;
  onChange: (value: string | null) => void;
  rows: TimelineRow[] | undefined;
};

export function SelectRow({ value, onChange, rows }: SelectTypeProps) {
  const selected = rows?.find((r) => r.id === value);
  return (
    <Field>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <span className="flex items-center gap-2">
            Row:
            <SelectValue>
              {selected && <Badge>{selected.label}</Badge>}
            </SelectValue>
          </span>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {rows?.map((row) => (
            <SelectItem key={row.id} value={row.id}>
              <Badge>{row.label}</Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
