"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

export type BaseItem = {
  name: string;
};

type ItemWithId = BaseItem & {
  id: string;
};

interface ComboboxFormFieldProps<
  TFieldValues extends FieldValues,
  TItem extends BaseItem | ItemWithId,
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  items: TItem[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export const ComboboxFormField = <
  TFieldValues extends FieldValues,
  TItem extends BaseItem | ItemWithId,
>({
  name,
  control,
  items,
  label,
  placeholder = "Select item",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  className,
}: ComboboxFormFieldProps<TFieldValues, TItem>) => {
  const [open, setOpen] = useState(false);

  // Helper function to get the value to store
  const getValue = (item: TItem) => {
    return "id" in item ? item.id : item.name;
  };

  // Helper function to get the display name
  const getDisplayName = (item: TItem) => item.name;

  // Helper function to find the selected item
  const findSelectedItem = (value: string) =>
    items.find((item) => getValue(item) === value);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? getDisplayName(findSelectedItem(field.value) as TItem)
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0"
              align="start"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput placeholder={searchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={getValue(item)}
                        value={getDisplayName(item)}
                        onSelect={() => {
                          field.onChange(getValue(item));
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            getValue(item) === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {getDisplayName(item)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
