import TextField from '@/components/form/text-field';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormContainer from './form-container';

const SIGN_IN_FORM_FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
} as const;

const signInFormSchema = z.object({
  [SIGN_IN_FORM_FIELDS.EMAIL]: z.string().email(),
  [SIGN_IN_FORM_FIELDS.PASSWORD]: z.string(),
});

export type SignInForData = z.infer<typeof signInFormSchema>;

interface SignInFormProps {
  loading: boolean;
  onSubmit: (data: SignInForData) => void;
}

const SignInForm = ({ loading, onSubmit }: SignInFormProps) => {
  const form = useForm<SignInForData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInFormSchema),
  });

  const { handleSubmit } = form;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription>Enter your email below to login</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <TextField
              name="email"
              label="Email"
              inputProps={{
                type: 'email',
                placeholder: 'name@example.com',
              }}
            />
            <TextField
              name="password"
              label="Password"
              inputProps={{
                placeholder: 'Enter your password...',
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
            <p className="mt-4 text-sm font-medium">Don't have an account?</p>
            <Link
              to="/sign-up"
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
            >
              Create a new account
            </Link>
          </CardFooter>
        </FormContainer>
      </form>
    </Form>
  );
};

export default SignInForm;
