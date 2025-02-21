import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const BancoSchema = z.object({
	bancoId: z.number(),
	nome: z.string(),
});

export type IBanco = z.infer<typeof BancoSchema>;

export const BancoAdminSchema = BancoSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IBancoAdmin = z.infer<typeof BancoAdminSchema>;