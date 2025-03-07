export enum SessionStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export type SessionData = {
  id: string;
  ua: string;
  ip: string;
  created_at: string;
  is_revoked: boolean;
  samples: [
    {
      total_legitimate: number;
      total_samples: number;
    }
  ];
  user: {
    id: string;
    email: string;
    last_name: string;
    created_at: string;
    first_name: string;
    security_level: string;
    enable_behavioural_biometrics: boolean;
  };
  status: SessionStatus;
};
