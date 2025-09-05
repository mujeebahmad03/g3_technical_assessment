import type { ReactElement, ReactNode } from "react";
import type {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

interface TextareaFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  required?: boolean;
  label?: string;
  additionalLabel?: string;
  description?: string | ReactNode;
  className?: string;
  disabled?: boolean;
  rows?: number;
  renderChild?: (field: ControllerRenderProps<T, Path<T>>) => ReactElement;
}

export function TextareaFormField<T extends FieldValues>({
  form,
  name,
  placeholder,
  required,
  label,
  additionalLabel,
  description,
  className,
  disabled,
  rows = 4,
  renderChild,
}: TextareaFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
            {additionalLabel && (
              <span className="text-muted-foreground text-sm">
                {additionalLabel}
              </span>
            )}
          </div>
          <FormControl>
            {renderChild ? (
              renderChild(field)
            ) : (
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={cn(
                  fieldState.error ? "border-destructive" : "",
                  className
                )}
              />
            )}
          </FormControl>
          <FormMessage className="text-destructive" />
          {description && (
            <FormDescription className="text-muted-foreground text-sm">
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
