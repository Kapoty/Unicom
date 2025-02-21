import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const PdvSchema = z.object({
	pdvId: z.number(),
	empresaId: z.number(),
	nome: z.string(),
});

export type IPdv = z.infer<typeof PdvSchema>;

export const PdvAdminSchema = PdvSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IPdvAdmin = z.infer<typeof PdvAdminSchema>;