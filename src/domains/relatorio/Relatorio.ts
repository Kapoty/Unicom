import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const RelatorioSchema = z.object({
	relatorioId: z.number(),
	empresaId: z.number(),
	titulo: z.string(),
	uri: z.string(),
	link: z.string(),
	linkMobile: z.nullable(z.string()),
	icone: z.nullable(z.string()),
	ativo: z.boolean(),
	novaGuia: z.boolean(),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IRelatorio = z.infer<typeof RelatorioSchema>;

export const RelatorioAdminSchema = RelatorioSchema.extend({
	papelId: z.nullable(z.number()),
});

export type IRelatorioAdmin = z.infer<typeof RelatorioAdminSchema>;