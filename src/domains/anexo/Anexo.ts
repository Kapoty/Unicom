import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const AnexoSchema = z.object({
	id: z.string(),
	name: z.string(),
	thumbnailLink: z.nullable(z.string()),
	trashed: z.boolean(),
});

export type IAnexo = z.infer<typeof AnexoSchema>;