import CheckboxField from '@/components/form/checkbox-field';
import TextField from '@/components/form/text-field';
import TrackedTextField from '@/components/form/tracked-text-field';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';
import { generateKeystrokeSamples } from '@/lib/tracker';
import { cn } from '@/lib/utils';
import { KeystrokeEvent } from '@/models/sample';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';

import Logo from '@/components/logo';
import { CHALLENGE_TEXT } from '@/constants/texts';

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
});

const SIGN_UP_FORM_FIELDS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  PHONE_NUMBER: 'phoneNumber',
  SECURITY_QUESTION: 'securityQuestion',
  SECURITY_QUESTION_ANSWER: 'securityQuestionAnswer',
  TWO_FA_1: '2fa1',
  TWO_FA_2: '2fa2',
  TWO_FA_3: '2fa3',
  TWO_FA_4: '2fa4',
  TWO_FA_5: '2fa5',
  ENABLE_BEHAVIORAL_BIOMETRICS: 'enableBehavioralBiometrics',
} as const;

const formSchema = z
  .object({
    [SIGN_UP_FORM_FIELDS.FIRST_NAME]: z.string(),
    [SIGN_UP_FORM_FIELDS.LAST_NAME]: z.string(),
    [SIGN_UP_FORM_FIELDS.EMAIL]: z.string().email(),
    [SIGN_UP_FORM_FIELDS.PASSWORD]: z.string(),
    [SIGN_UP_FORM_FIELDS.CONFIRM_PASSWORD]: z.string(),
    [SIGN_UP_FORM_FIELDS.ENABLE_BEHAVIORAL_BIOMETRICS]: z.boolean(),
  })
  .superRefine((schema, ctx) => {
    if (
      schema[SIGN_UP_FORM_FIELDS.PASSWORD] !==
      schema[SIGN_UP_FORM_FIELDS.CONFIRM_PASSWORD]
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: [SIGN_UP_FORM_FIELDS.CONFIRM_PASSWORD],
      });
    }
  });

function SignUp() {
  return (
    <>
      <div className="md:hidden h-screen max-h-screen">
        <img
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <img
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/sign-in"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          Login
        </Link>
        <div
          className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex"
          style={{
            backgroundSize: 'cover',
            backgroundImage: 'url("/decorator-2.jpg")',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo className="w-10 h-10 mr-2" />
            KDR | Keystroke Dynamics Recognition
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Unlock a new era of security. Gone are the days of
                forgotten passwords and vulnerable accounts.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 max-h-screen overflow-auto">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Start your journey with us today. Enter your email and password
                to create an account.
              </p>
            </div>
            <SignUpForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>
              &nbsp;and&nbsp;
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      enableBehavioralBiometrics: false,
    },
  });
  const { handleSubmit, watch } = form;
  const navigate = useNavigate();

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post('/api/users/sign-up', data),
    onSuccess: () => navigate({ to: '/sign-in' }),
  });

  const keystrokeEventsRef = useRef<Record<string, KeystrokeEvent[]>>({});
  const onSubmit = useCallback(
    (values: Record<string, unknown>) => {
      signUp({
        ...values,
        samples: [
          ...generateKeystrokeSamples({
            events: keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_1],
          }),
          ...generateKeystrokeSamples({
            events: keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_2],
          }),
          ...generateKeystrokeSamples({
            events: keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_3],
          }),
          ...generateKeystrokeSamples({
            events: keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_4],
          }),
          ...generateKeystrokeSamples({
            events: keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_5],
          }),
        ],
      });
    },
    [signUp]
  );

  const genernalTextFieldProps = {
    disabled: isPending,
  };

  const enableBehavioralBiometrics = watch(
    SIGN_UP_FORM_FIELDS.ENABLE_BEHAVIORAL_BIOMETRICS
  );

  return (
    <div className={cn('grid gap-6')}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Your name</Label>
              <div className="grid gap-2 grid-cols-2">
                <TextField
                  name={SIGN_UP_FORM_FIELDS.FIRST_NAME}
                  inputProps={{
                    ...genernalTextFieldProps,
                    placeholder: 'First name',
                  }}
                />
                <TextField
                  name={SIGN_UP_FORM_FIELDS.LAST_NAME}
                  inputProps={{
                    ...genernalTextFieldProps,
                    placeholder: 'Last name',
                  }}
                />
              </div>
            </div>
            <TextField
              name={SIGN_UP_FORM_FIELDS.EMAIL}
              label="Email"
              inputProps={{
                ...genernalTextFieldProps,
                type: 'email',
                placeholder: 'name@example.com',
              }}
            />
            <TrackedTextField
              name={SIGN_UP_FORM_FIELDS.PASSWORD}
              label="Password"
              inputProps={{
                disabled: isPending,
                placeholder: 'Enter your password...',
                onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                  keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.PASSWORD] =
                    events;
                },
              }}
            />
            <TrackedTextField
              name={SIGN_UP_FORM_FIELDS.CONFIRM_PASSWORD}
              label="Confirm password"
              inputProps={{
                disabled: isPending,
                placeholder: 'Confirm your password...',
                onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                  keystrokeEventsRef.current[
                    SIGN_UP_FORM_FIELDS.CONFIRM_PASSWORD
                  ] = events;
                },
              }}
            />
            <CheckboxField
              name={SIGN_UP_FORM_FIELDS.ENABLE_BEHAVIORAL_BIOMETRICS}
              label="Enable behavioral biometrics"
              inputProps={{
                value: 1,
                disabled: isPending,
              }}
            />

            {enableBehavioralBiometrics && (
              <motion.div
                initial={{
                  height: 0,
                }}
                animate={{
                  height: 'fit-content',
                }}
                exit={{ height: 0 }}
              >
                <div className="flex flex-col space-y-2 text-left">
                  <h1 className="text-xl font-semibold tracking-tight">
                    Let us know your typing pattern
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Type the text `When the stars align, we dance all night`.
                    This will be use for verify you on singning in!
                  </p>
                </div>
                <TrackedTextField
                  name={SIGN_UP_FORM_FIELDS.TWO_FA_1}
                  label={CHALLENGE_TEXT}
                  inputProps={{
                    disabled: isPending,
                    placeholder: 'Let us know your typing styles...',
                    onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                      keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_1] =
                        events;
                    },
                  }}
                />
                <TrackedTextField
                  name={SIGN_UP_FORM_FIELDS.TWO_FA_2}
                  label={CHALLENGE_TEXT}
                  inputProps={{
                    disabled: isPending,
                    placeholder: 'Let us know your typing styles...',
                    onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                      keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_2] =
                        events;
                    },
                  }}
                />
                <TrackedTextField
                  name={SIGN_UP_FORM_FIELDS.TWO_FA_3}
                  label={CHALLENGE_TEXT}
                  inputProps={{
                    disabled: isPending,
                    placeholder: 'Let us know your typing styles...',
                    onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                      keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_3] =
                        events;
                    },
                  }}
                />
                <TrackedTextField
                  name={SIGN_UP_FORM_FIELDS.TWO_FA_4}
                  label={CHALLENGE_TEXT}
                  inputProps={{
                    disabled: isPending,
                    placeholder: 'Let us know your typing styles...',
                    onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                      keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_4] =
                        events;
                    },
                  }}
                />
                <TrackedTextField
                  name={SIGN_UP_FORM_FIELDS.TWO_FA_5}
                  label={CHALLENGE_TEXT}
                  inputProps={{
                    disabled: isPending,
                    placeholder: 'Let us know your typing styles...',
                    onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
                      keystrokeEventsRef.current[SIGN_UP_FORM_FIELDS.TWO_FA_5] =
                        events;
                    },
                  }}
                />
              </motion.div>
            )}

            <Button disabled={isPending} type="submit">
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
