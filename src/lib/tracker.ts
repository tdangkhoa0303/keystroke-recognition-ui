import { KeystrokeEvent, Sample } from '@/models/sample';

export const SPECIAL_KEYS = [
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'CapsLock',
  'Backspace',
  'Space',
  'Capslock',
];

export const generateKeystrokeSamples = ({
  events,
  trackingGap = 2000,
}: {
  trackingGap?: number;
  events: KeystrokeEvent[];
}): Sample[] => {
  const boundaryIndexes: number[] = [-1];
  events.forEach((currentEvent, currentIndex) => {
    if (currentIndex === events.length - 1) {
      return;
    }

    const nextEvent = events[currentIndex + 1];
    if (
      currentIndex === events.length ||
      (currentEvent.direction === 1 &&
        nextEvent.direction === 0 &&
        nextEvent.timestamp - currentEvent.timestamp >= trackingGap)
    ) {
      boundaryIndexes.push(currentIndex);
    }
  });

  return boundaryIndexes
    .map((boundaryIndex, idx) => {
      const tailIndex =
        idx + 1 < boundaryIndexes.length
          ? boundaryIndexes[idx + 1] + 1
          : events.length;

      return {
        _id: crypto.randomUUID(),
        createdAt: Date.now(),
        events: events.slice(boundaryIndex + 1, tailIndex),
      };
    })
    .filter((sample) => sample.events.length > 10);
};

export const getNormalizedKey = (event: KeyboardEvent) => {
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

export class KeystrokeTracker {
  private static initialized = false;
  private static keyPressedTracker: Record<string, boolean> = {};
  private static events: KeystrokeEvent[] = [];
  private gap: number;

  constructor({ gap = 2000 }: { gap?: number } = {}) {
    this.gap = gap;

    if (KeystrokeTracker.initialized || !document) return;

    KeystrokeTracker.initialized = true;
    document.addEventListener('keydown', KeystrokeTracker.onKeyDown);
    document.addEventListener('keyup', KeystrokeTracker.onKeyUp);
  }

  private static onKeyDown = (event: KeyboardEvent) => {
    if (!KeystrokeTracker.isValidKey(event.key)) return;

    const key = getNormalizedKey(event);
    if (!KeystrokeTracker.keyPressedTracker[key]) {
      KeystrokeTracker.keyPressedTracker[key] = true;
      KeystrokeTracker.events.push({
        key,
        direction: 0,
        timestamp: Date.now(),
      });
    }
  };

  private static onKeyUp = (event: KeyboardEvent) => {
    if (!KeystrokeTracker.isValidKey(event.key)) return;

    const key = getNormalizedKey(event);
    KeystrokeTracker.keyPressedTracker[key] = false;
    KeystrokeTracker.events.push({
      key,
      direction: 1,
      timestamp: Date.now(),
    });
  };

  static isValidKey(key?: string) {
    return (
      !!key &&
      !['tab', 'enter', 'meta', 'unidentified'].includes(key.toLowerCase())
    );
  }

  getTypingSamples = (reset = false): Sample[] => {
    const events = [...KeystrokeTracker.events];
    const samples = generateKeystrokeSamples({
      events,
      trackingGap: this.gap,
    });

    if (reset) {
      KeystrokeTracker.events = [];
    }

    return samples;
  };
}

const tracker = new KeystrokeTracker();

export default tracker;
