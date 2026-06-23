import { Badge, BadgeProps } from "@shared/ui/badge";

import { Field } from "@/shared/ui/field/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select/select";
import { SelectRootChangeEventDetails } from "@base-ui/react";

export type PriorityOption = {
  value: string;
  label: string;
  variant: BadgeProps["variant"];
};

export function SelectPriority({
  options,
  value,
  onChange,
  className,
}: {
  options: PriorityOption[];
  value?: string;
  onChange: (
    value: string | null,
    eventDetails: SelectRootChangeEventDetails,
  ) => void;
  className?: string;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <Field className={`max-w-xs ${className}`}>
      <Select
        value={value}
        onValueChange={onChange}
        defaultValue={options[0].value}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue>
            {selected ? (
              <Badge variant={selected.variant} size="sm">
                {selected.label}
              </Badge>
            ) : null}
          </SelectValue>
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {options.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                <span className="flex items-center gap-2">
                  <Badge variant={priority.variant} size="sm">
                    {priority.label}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
