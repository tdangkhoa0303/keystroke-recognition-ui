import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';
import { ComponentProps } from 'react';

interface SwitchFieldProps {
  name: string;
  label?: string;
  description?: string;
  inputProps?: ComponentProps<typeof Switch>;
}

const SwitchField = ({
  name,
  label,
  inputProps,
  description,
}: SwitchFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2 space-y-0">
          <FormControl>
            <Switch
              {...inputProps}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="mt-0">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription> <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default SwitchField;
