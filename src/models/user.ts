export enum SecurityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  enableBehaviouralBiometrics: boolean;
  securityLevel: SecurityLevel;
  role: UserRole;
}
