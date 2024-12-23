import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const RelatorioPostRequestSchema = z.object({
	titulo: z.string(),
	uri: z.string(),
	link: z.string(),
	linkMobile: z.nullable(z.string()),
	icone: z.nullable(z.string()),
	ativo: z.boolean(),
	novaGuia: z.boolean(),
	papelId: z.nullable(z.number()),
});

export type RelatorioPostRequest = z.infer<typeof RelatorioPostRequestSchema>;

export const RelatorioPatchRequestSchema = z.object({
	titulo: z.string(),
	uri: z.string(),
	link: z.string(),
	linkMobile: z.nullable(z.string()),
	icone: z.nullable(z.string()),
	ativo: z.boolean(),
	novaGuia: z.boolean(),
	papelId: z.nullable(z.number()),
	updatedAt: dateToApiDateTimeSchema,
});

export type RelatorioPatchRequest = z.infer<typeof RelatorioPatchRequestSchema>;