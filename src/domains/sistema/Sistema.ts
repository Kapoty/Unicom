import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const SistemaSchema = z.object({
	sistemaId: z.number(),
	empresaId: z.number(),
	nome: z.string(),
});

export type ISistema = z.infer<typeof SistemaSchema>;

export const SistemaAdminSchema = SistemaSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type ISistemaAdmin = z.infer<typeof SistemaAdminSchema>;