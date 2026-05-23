import {z} from 'zod';

export const ServiceSchema = z.object({
    regular: z.string().nullable(),
    irregular: z.string().nullable(),
});
