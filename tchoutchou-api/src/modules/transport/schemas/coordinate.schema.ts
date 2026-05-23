import {z} from 'zod';

export const CoordinateSchema = z.object({
    type: z.string(),
    x: z.union([z.string(), z.number(), z.bigint()]),
    y: z.union([z.string(), z.number(), z.bigint()]),
});
