import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const PdvPostRequestSchema = z.object({
	nome: z.string(),
});

export type PdvPostRequest = z.infer<typeof PdvPostRequestSchema>;

export const PdvPatchRequestSchema = z.object({
	nome: z.string(),
	updatedAt: dateToApiDateTimeSchema,
});

export type PdvPatchRequest = z.infer<typeof PdvPatchRequestSchema>;