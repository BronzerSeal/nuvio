"use client";

import { Fragment } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/shared/ui/combobox/combobox";
import { Field } from "@shared/ui/field";

type Item =
  | {
      id: string;
      label: string;
      title?: never;
    }
  | {
      id: string;
      title: string;
      label?: never;
    };

interface Props {
  placeholder?: string;
  className?: string;
  items: Item[];
  value: string[];
  onValueChange: (value: string[]) => void;
}

export function MultiSelect({
  className,
  placeholder,
  items,
  value,
  onValueChange,
}: Props) {
  const anchor = useComboboxAnchor();

  const selectedItems = items.filter((item) => value.includes(item.id));
  return (
    <Field className={`max-w-xs ${className}`}>
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={selectedItems}
        onValueChange={(selected: Item[]) => {
          onValueChange(selected.map((s) => s.id));
        }}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: Item[]) => (
              <Fragment>
                {values.map((item) => (
                  <ComboboxChip key={item.id}>
                    {item?.label || item?.title}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={placeholder} />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: Item) => (
              <ComboboxItem key={item.id} value={item}>
                {item?.label || item?.title}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
