import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const SistemaPostRequestSchema = z.object({
	nome: z.string(),
});

export type SistemaPostRequest = z.infer<typeof SistemaPostRequestSchema>;

export const SistemaPatchRequestSchema = z.object({
	nome: z.string(),
	updatedAt: dateToApiDateTimeSchema,
});

export type SistemaPatchRequest = z.infer<typeof SistemaPatchRequestSchema>;