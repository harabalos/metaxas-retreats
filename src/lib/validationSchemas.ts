import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .trim()
    .toLowerCase(),
  
  phone: z.string()
    .max(30, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  specialRequests: z.string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional()
    .or(z.literal(''))
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
