import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const OrigemPostRequestSchema = z.object({
	nome: z.string(),
});

export type OrigemPostRequest = z.infer<typeof OrigemPostRequestSchema>;

export const OrigemPatchRequestSchema = z.object({
	nome: z.string(),
	updatedAt: dateToApiDateTimeSchema,
});

export type OrigemPatchRequest = z.infer<typeof OrigemPatchRequestSchema>;