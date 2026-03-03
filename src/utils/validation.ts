import { z } from 'zod';

export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};
