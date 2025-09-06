import { LucideIcon } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import { ReactNode } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectFormFieldProps<TFieldValues extends FieldValues, TOption> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  options: TOption[];
  getLabel: (option: TOption) => string;
  getValue: (option: TOption) => string;
  icon?: LucideIcon;
  renderOption?: (option: TOption) => ReactNode;
}

export const SelectFormField = <TFieldValues extends FieldValues, TOption>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  getLabel,
  getValue,
  icon: Icon,
  renderOption,
}: SelectFormFieldProps<TFieldValues, TOption>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <div className="relative">
            {Icon && (
              <div className="absolute left-2 top-2 w-4 h-4 text-muted-foreground z-10">
                <Icon size={16} />
              </div>
            )}
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className={cn(Icon && "pl-10", "w-full")}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={getValue(option)} value={getValue(option)}>
                    {renderOption ? renderOption(option) : getLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
