import {z} from 'zod';

export const CoordinateSchema = z.object({
    type: z.string(),
    x: z.number(),
    y: z.number()
});

