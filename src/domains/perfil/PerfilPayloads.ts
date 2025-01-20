import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const PerfilAdminPostRequestSchema = z.object({
	foto: z.nullable(z.string()),
	nome: z.string(),
	ativo: z.boolean(),
	usuarioId: z.nullable(z.number()),
	papelId: z.nullable(z.number()),
});

export type PerfilAdminPostRequest = z.infer<typeof PerfilAdminPostRequestSchema>;

export const PerfilAdminPatchRequestSchema = z.object({
	foto: z.optional(z.nullable(z.string())),
	nome: z.string(),
	ativo: z.boolean(),
	usuarioId: z.nullable(z.number()),
	papelId: z.nullable(z.number()),
	updatedAt: dateToApiDateTimeSchema,
});

export type PerfilAdminPatchRequest = z.infer<typeof PerfilAdminPatchRequestSchema>;