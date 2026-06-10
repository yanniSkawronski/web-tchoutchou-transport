import {z} from "zod";

import {CoordinateSchema} from "./coordinate.schema.js";
export const LocationSchema = z.object({
    id: z.string().nullable(),
    name: z.string(),
    type: z.string().optional(),
    score: z.number().nullable(),
    coordinate: CoordinateSchema,
    distance: z.number().nullable(),
});

