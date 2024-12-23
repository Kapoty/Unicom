import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const DominioPostRequestSchema = z.object({
	empresaId: z.number(),
	dominio: z.string(),
});

export type DominioPostRequest = z.infer<typeof DominioPostRequestSchema>;

export const DominioPatchRequestSchema = z.object({
	empresaId: z.number(),
	dominio: z.string(),
	updatedAt: dateToApiDateTimeSchema,
});

export type DominioPatchRequest = z.infer<typeof DominioPatchRequestSchema>;