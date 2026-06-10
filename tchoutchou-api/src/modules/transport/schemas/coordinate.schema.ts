import {z} from 'zod';

export const CoordinateSchema = z.object({
    type: z.string(),
    x: z.union([z.string(), z.number(), z.bigint()]).nullable(),
    y: z.union([z.string(), z.number(), z.bigint()]).nullable(),
});
