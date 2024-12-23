import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const GrupoSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IGrupo = z.infer<typeof GrupoSchema>;