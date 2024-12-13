import { ComponentProps, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { cn } from '@/lib/utils';

type Option = {
  text: string;
  value: string;
  subText?: string;
};

export type OptionComponentProps = {
  option: Option;
  selected: boolean;
};

interface ToggleGroupFieldProps {
  name: string;
  label?: string;
  description?: string;
  inputProps: ComponentProps<typeof ToggleGroup> & {
    options: Option[];
    OptionComponent: (props: OptionComponentProps) => ReactElement;
  };
}

const isSelected = (optionValue: string, fieldValue: string | string[]) =>
  Array.isArray(fieldValue)
    ? fieldValue.includes(optionValue)
    : optionValue === fieldValue;

const ToggleGroupField = ({
  name,
  label,
  inputProps,
  description,
}: ToggleGroupFieldProps) => {
  const form = useFormContext();
  const { options, OptionComponent, ...restProps } = inputProps;

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2 w-full">
          <div className="space-y-1.5 leading-none">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <ToggleGroup
              {...restProps}
              value={field.value}
              onValueChange={(value: string | string[]) => {
                if (value) {
                  field.onChange(value);
                }
              }}
              className="flex flex-row items-stretch gap-4"
            >
              {options.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  aria-label={option.text}
                  className={cn(
                    'flex-1 max-h-full h-[unset] !bg-transparent p-2 border-2 shadow-sm',
                    isSelected(option.value, field.value)
                      ? 'outline-primary shadow-lg outline-2 outline'
                      : 'hover:shadow-xl'
                  )}
                >
                  <OptionComponent
                    option={option}
                    selected={
                      Array.isArray(field.value)
                        ? field.value.includes(option.value)
                        : option.value === field.value
                    }
                  />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ToggleGroupField;
