import { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SelectFieldProps {
  name: string;
  label?: string;
  description?: string;
  inputProps: ComponentProps<typeof Select> & {
    placeholder?: string;
    options: Array<{ value: string; text: string }>;
  };
}

const SelectField = ({
  name,
  label,
  inputProps,
  description,
}: SelectFieldProps) => {
  const form = useFormContext();
  const { placeholder, options } = inputProps;

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ text, value }) => (
                <SelectItem key={value} value={value}>
                  {text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
