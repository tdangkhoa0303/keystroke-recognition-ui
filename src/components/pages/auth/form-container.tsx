import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

const FormContainer = ({
  className,
  ...props
}: ComponentProps<typeof Card>) => (
  <Card className={cn(className, 'border-none')} {...props} />
);

export default FormContainer;
