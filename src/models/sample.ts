export interface KeystrokeEvent {
  key: string;
  direction: 0 | 1;
  timestamp: number;
}

export interface Sample {
  createdAt: number;
  events: KeystrokeEvent[];
}
