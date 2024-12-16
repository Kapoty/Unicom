import { z } from "zod";

export const RelatorioSchema = z.object({
	relatorioId: z.number(),
	empresaId: z.number(),
	titulo: z.string(),
	uri: z.string(),
	link: z.string(),
	linkMobile: z.string(),
	icone: z.string(),
	ativo: z.boolean(),
	novaGuia: z.boolean(),
});

export type IRelatorio = z.infer<typeof RelatorioSchema>;

export const RelatorioAdminSchema = RelatorioSchema.extend({
	papelId: z.number(),
});

export type IRelatorioAdmin = z.infer<typeof RelatorioAdminSchema>;