import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Checkbox, CheckboxProps } from '../ui/checkbox';
import { useMemo } from 'react';

interface CheckboxFieldProps {
  name: string;
  label?: string;
  description?: string;
  inputProps: CheckboxProps;
}

const CheckboxField = ({
  name,
  label,
  inputProps,
  description,
}: CheckboxFieldProps) => {
  const form = useFormContext();
  const { id } = inputProps;
  const inputId = useMemo(() => id || window.crypto.randomUUID(), [id]);

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <Checkbox
              {...inputProps}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription> <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
