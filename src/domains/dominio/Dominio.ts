import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const DominioSchema = z.object({
	dominioId: z.number(),
	empresaId: z.number(),
	dominio: z.string(),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IDominio = z.infer<typeof DominioSchema>;