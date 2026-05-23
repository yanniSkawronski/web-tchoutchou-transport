import {z} from "zod";

import {CheckpointSchema} from "./checkpoint.schema.js";
import {SectionSchema} from "./section.schema.js";
import {ServiceSchema} from "./service.schema.js";

export const ConnectionSchema = z.object({
    from: CheckpointSchema,
    to: CheckpointSchema,
    duration: z.string().nullable(),
    service: ServiceSchema.nullable(),
    products: z.array(z.string()).nullable(),
    capacity1st: z.number().nullable(),
    capacity2nd: z.number().nullable(),
    sections: z.array(SectionSchema).nullable(),
});
