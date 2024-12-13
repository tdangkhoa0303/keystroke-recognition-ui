import { Session } from './session';
import { SecurityLevel } from './user';

export interface KeystrokeEvent {
  key: string;
  direction: 0 | 1;
  timestamp: number;
}

export interface Sample {
  events: KeystrokeEvent[];
  created_at: string;
  is_legitimate: boolean;
  predicted_score: number;
  security_level: SecurityLevel;
  sesssion: Session;
}
