import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";
import { PapelSistemaSchema } from "./Usuario";

export const UsuarioPostRequestSchema = z.object({
	nomeCompleto: z.string(),
	email: z.string(),
	matricula: z.nullable(z.number()),
	papelSistema: PapelSistemaSchema,
	senha: z.string(),
	confirmacaoSenha: z.string(),
	pin: z.nullable(z.string()),
	confirmacaoPin: z.nullable(z.string()),
});

export type UsuarioPostRequest = z.infer<typeof UsuarioPostRequestSchema>;

export const UsuarioPatchRequestSchema = z.object({
	nomeCompleto: z.string(),
	email: z.string(),
	matricula: z.nullable(z.number()),
	papelSistema: PapelSistemaSchema,
	senha: z.optional(z.string()),
	confirmacaoSenha: z.optional(z.string()),
	pin: z.optional(z.nullable(z.string())),
	confirmacaoPin: z.optional(z.nullable(z.string())),
	updatedAt: dateToApiDateTimeSchema,
});

export type UsuarioPatchRequest = z.infer<typeof UsuarioPatchRequestSchema>;

export const UsuarioBuscarRequestSchema = z.object({
	dominio: z.string(),
	email: z.string(),
});

export type UsuarioBuscarRequest = z.infer<typeof UsuarioBuscarRequestSchema>;

export const UsuarioMePatchRequestSchema = z.object({
	senha: z.optional(z.string()),
	confirmacaoSenha: z.optional(z.string()),
	pin: z.optional(z.nullable(z.string())),
	confirmacaoPin: z.optional(z.nullable(z.string())),
	updatedAt: dateToApiDateTimeSchema,
});

export type UsuarioMePatchRequest = z.infer<typeof UsuarioMePatchRequestSchema>;