import {z} from 'zod';

export const PrognosisSchema = z.object({
    platform: z.string().nullable(),
    departure: z.string().nullable(),
    arrival: z.string().nullable(),
    capacity1st: z.string().nullable(),
    capacity2nd: z.string().nullable(),
});
