import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNameAvatar(name: string) {
  if (!name || typeof name !== 'string') {
    return 'KD';
  }

  const parts = name.trim().split(/\s+/);
  const rawName =
    parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`
      : `${parts[0][0]}${parts[0][0]}`;

  return rawName.toUpperCase();
}
