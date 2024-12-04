import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input, InputProps } from '../ui/input';
import {
  useCallback,
  useEffect,
  useRef,
  KeyboardEvent as HTMLKeyboardEvent,
  RefObject,
  useImperativeHandle,
} from 'react';
import { KeystrokeTracker, SPECIAL_KEYS } from '@/lib/tracker';
import { KeystrokeEvent, Sample } from '@/models/sample';

export interface TrackerControllers {
  reset: () => void;
}

interface TrackedTextFieldProps {
  name: string;
  label?: string;
  description?: string;
  inputProps: InputProps & {
    trackerRef?: RefObject<TrackerControllers>;
    onKeystokeEventsChange?: (events: KeystrokeEvent[]) => void;
  };
}

export const getNormalizedKey = (event: HTMLKeyboardEvent) => {
  const { key, location } = event;
  const rawKey = SPECIAL_KEYS.includes(key)
    ? key.toUpperCase()
    : key.toLowerCase();

  switch (location) {
    case KeyboardEvent.DOM_KEY_LOCATION_LEFT:
      return `L${rawKey}`;
    case KeyboardEvent.DOM_KEY_LOCATION_RIGHT:
      return `R${rawKey}`;
    case KeyboardEvent.DOM_KEY_LOCATION_NUMPAD:
      return `N${rawKey}`;
    default:
      return rawKey;
  }
};

const TrackedTextField = ({
  name,
  label,
  description,
  inputProps: {
    onKeyDown,
    onKeyUp,
    trackerRef,
    onKeystokeEventsChange,
    ...inputProps
  },
}: TrackedTextFieldProps) => {
  const form = useFormContext();
  const eventsRef = useRef<KeystrokeEvent[]>([]);
  const keyPressedTrackerRef = useRef<Record<string, boolean>>({});
  const fieldValue = useWatch({
    name,
  });

  const handleKeyDown = useCallback(
    (event: HTMLKeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (!KeystrokeTracker.isValidKey(event.key)) return;

      const key = getNormalizedKey(event);
      if (!keyPressedTrackerRef.current[key]) {
        keyPressedTrackerRef.current[key] = true;
        eventsRef.current.push({
          key,
          direction: 0,
          timestamp: Date.now(),
        });
      }
    },
    []
  );

  const handleKeyUp = useCallback(
    (event: HTMLKeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(event);
      if (!KeystrokeTracker.isValidKey(event.key)) return;

      const key = getNormalizedKey(event);
      keyPressedTrackerRef.current[key] = false;
      const newEvents: KeystrokeEvent[] = [
        ...eventsRef.current,
        {
          key,
          direction: 1,
          timestamp: Date.now(),
        },
      ];
      eventsRef.current = newEvents;
      onKeystokeEventsChange?.(newEvents);
    },
    []
  );

  const resetTracker = useCallback(() => {
    eventsRef.current = [];
    keyPressedTrackerRef.current = {};
    onKeystokeEventsChange?.([]);
  }, [onKeystokeEventsChange]);

  useEffect(() => {
    if (!fieldValue?.trim()) {
      resetTracker();
    }
  }, [fieldValue]);

  useImperativeHandle(
    trackerRef,
    () => ({
      reset: resetTracker,
    }),
    [resetTracker]
  );

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...inputProps}
              {...field}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              value={field.value || ''}
              autoComplete="off"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TrackedTextField;
