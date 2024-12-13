import { User } from './user';

export interface Session {
  id: string;
  ua: string;
  ip: string;
  created_at: string;
  user: User;
}
