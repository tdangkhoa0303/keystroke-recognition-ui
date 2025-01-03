import { CheckboxField, TrackedTextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { CHALLENGE_TEXT } from '@/constants/texts';
import { useCustomMutation } from '@/hooks/api';
import apiClient from '@/lib/api-client';
import { generateKeystrokeSamples } from '@/lib/tracker';
import { KeystrokeEvent, Sample } from '@/models/sample';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

const PostSamples = ({
  onClose,
  retrainModel,
}: {
  onClose: () => void;
  retrainModel: () => void;
}) => {
  const form = useForm({
    defaultValues: {
      sample1: '',
      sample2: '',
      shouldRetrainAfterSubmit: false,
    },
  });
  const { handleSubmit, watch } = form;
  const shouldRetrainAfterSubmit = watch('shouldRetrainAfterSubmit');

  const { mutate: postSamples, isPending: isPostingSamples } =
    useCustomMutation({
      mutationFn: (data: Sample[]) =>
        apiClient
          .post('/api/users/samples', { samples: data })
          .then((response) => response.data),
      onSuccess: () => {
        if (shouldRetrainAfterSubmit) {
          retrainModel();
        }

        form.reset();
        onClose();
      },
    });

  const keystrokeEventsRef = useRef<Record<string, KeystrokeEvent[]>>({});

  return (
    <Form {...form}>
      <form autoComplete="off" className="flex flex-col gap-4">
        <TrackedTextField
          name="sample1"
          label={CHALLENGE_TEXT}
          inputProps={{
            placeholder: 'Enter the text below to submit your sample...',
            onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
              keystrokeEventsRef.current['sample1'] = events;
            },
          }}
        />
        <TrackedTextField
          name="sample2"
          label={CHALLENGE_TEXT}
          inputProps={{
            placeholder: 'Enter the text below to submit your sample...',
            onKeystokeEventsChange: (events: KeystrokeEvent[]) => {
              keystrokeEventsRef.current['sample2'] = events;
            },
          }}
        />
        <CheckboxField name="shouldRetrainAfterSubmit" label="Retrain model" />
        <div className="flex justify-end items-center mt-4 gap-4">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={isPostingSamples}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(() =>
              postSamples([
                ...generateKeystrokeSamples({
                  events: keystrokeEventsRef.current['sample1'],
                }),
                ...generateKeystrokeSamples({
                  events: keystrokeEventsRef.current['sample2'],
                }),
              ])
            )}
          >
            {isPostingSamples && (
              <Icons.spinner className="mr-1 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostSamples;
