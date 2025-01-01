import { TrackedTextField } from '@/components/form';
import { TrackerControllers } from '@/components/form/tracked-text-field';
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
import { CHALLENGE_TEXT } from '@/constants/texts';
import { generateKeystrokeSamples } from '@/lib/tracker';
import { KeystrokeEvent, Sample } from '@/models/sample';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormContainer from './form-container';

const VERIFICATION_FORM_FIELDS = {
  SAMPLES: 'samples',
} as const;

const VerificationFormSchema = z.object({
  [VERIFICATION_FORM_FIELDS.SAMPLES]: z
    .string()
    .length(CHALLENGE_TEXT.length, 'Please try to type the text correctly.'),
});

export type VerificationForData = z.infer<typeof VerificationFormSchema>;

interface VerificationFormProps {
  loading: boolean;
  onSignInWithAnotherAccount: () => void;
  onSubmit: (data: { samples: Sample[] }) => void;
}

const VerificationForm = ({
  loading,
  onSubmit,
  onSignInWithAnotherAccount,
}: VerificationFormProps) => {
  const form = useForm<VerificationForData>({
    defaultValues: {
      samples: '',
    },
    resolver: zodResolver(VerificationFormSchema),
  });

  const { handleSubmit } = form;

  const trackerRef = useRef<TrackerControllers>(null);
  const keystrokeEventsRef = useRef<KeystrokeEvent[]>([]);

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(() =>
          onSubmit({
            samples: generateKeystrokeSamples({
              events: keystrokeEventsRef.current,
            }),
          })
        )}
      >
        <FormContainer>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              Verify your typing styles...
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Prove it's really you in seconds! Type the phrase below to keep
              your account safe—your unique typing style does the rest.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <TrackedTextField
              name="samples"
              label={CHALLENGE_TEXT}
              inputProps={{
                disabled: loading,
                trackerRef: trackerRef,
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
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={onSignInWithAnotherAccount}
            >
              Sign in with another account <ArrowRight />
            </Button>
          </CardFooter>
        </FormContainer>
      </form>
    </Form>
  );
};

export default VerificationForm;
