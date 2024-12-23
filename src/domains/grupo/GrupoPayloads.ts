import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const GrupoPostRequestSchema = z.object({
	nome: z.string(),
});

export type GrupoPostRequest = z.infer<typeof GrupoPostRequestSchema>;

export const GrupoPatchRequestSchema = z.object({
	nome: z.string(),
	updatedAt: dateToApiDateTimeSchema,
});

export type GrupoPatchRequest = z.infer<typeof GrupoPatchRequestSchema>;