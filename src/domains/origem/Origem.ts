import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const OrigemSchema = z.object({
	origemId: z.number(),
	empresaId: z.number(),
	nome: z.string(),
});

export type IOrigem = z.infer<typeof OrigemSchema>;

export const OrigemAdminSchema = OrigemSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IOrigemAdmin = z.infer<typeof OrigemAdminSchema>;