import {z} from 'zod';

export const createPhoneSchema = z.object({
  phoneRecords: z.array(z.string())
    .nonempty()
    .min(1, 'You must provide at least one phone number.')
    .max(100_000, 'You can only add up to 100,000 records at once.'),
  appId: z.number()
    .int('App ID must be an integer.')
    .positive('App ID must be a positive integer.'),
  countryId: z.number()
    .int('Country ID must be an integer.')
    .positive('Country ID must be a positive integer.'),
});