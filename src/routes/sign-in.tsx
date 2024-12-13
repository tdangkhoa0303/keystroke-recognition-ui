import { useAuth } from '@/auth';
import TextField from '@/components/form/text-field';
import TrackedTextField, {
  TrackerControllers,
} from '@/components/form/tracked-text-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { useTypingInstance } from '@/context';
import { useCustomMutation } from '@/hooks/api';
import apiClient from '@/lib/api-client';
import { generateKeystrokeSamples } from '@/lib/tracker';
import { KeystrokeEvent } from '@/models/sample';
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const fallback = '/' as const;

export const Route = createFileRoute('/sign-in')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: SignIn,
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
});

function SignIn() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = form;
  const { login } = useAuth();
  const navigate = useNavigate();
  const tdnaInstance = useTypingInstance();

  const trackerRef = useRef<TrackerControllers>(null);
  const { mutate: signIn, isPending } = useCustomMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient
        .post('/api/users/sign-in', data)
        .then((response) => response.data)
        .then((responseData) => {
          const accessToken = responseData['accessToken'];
          apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          login(accessToken);
        }),
    notify: {
      success: 'Login successfully!',
      error: 'Login failed!',
    },
    onSuccess: () => navigate({ to: '/' }),
  });

  const keystrokeEventsRef = useRef<KeystrokeEvent[]>([]);

  const onSubmit = useCallback(
    (values: Record<string, unknown>) => {
      signIn({
        ...values,
        samples: generateKeystrokeSamples({
          events: keystrokeEventsRef.current,
        }),
        tp: tdnaInstance?.getTypingPattern({
          type: 0,
          text: String(values['password']),
        }),
      });
      trackerRef.current?.reset?.();
    },
    [signIn, tdnaInstance]
  );

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-screen h-screen flex items-center justify-center">
          <Card className="min-w-[440px]">
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
              <TrackedTextField
                name="confirmIdentity"
                label="When the dream come true, we go to bed"
                inputProps={{
                  disabled: isPending,
                  placeholder:
                    'Type the above string to confirm your identity...',
                  onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                    keystrokeEventsRef.current = events;
                  },
                }}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>

              <Link to="/sign-up" className="url">
                Create a new account
              </Link>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}
