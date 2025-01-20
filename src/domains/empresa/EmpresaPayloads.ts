import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";
import { AparenciaCorSchema } from "./Empresa";

export const ContratoRequestSchema = z.object({
	ativo: z.boolean(),
	limiteUsuarios: z.number(),
	inicio: z.nullable(dateToApiDateTimeSchema),
	fim: z.nullable(dateToApiDateTimeSchema),
	valor: z.nullable(z.number()),
});

export const GoogleDriveRequestSchema = z.object({
	folderId: z.nullable(z.string())
});

export const EmpresaAdminPostRequestSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
	cnpj: z.string(),
	contratoAtualId: z.number(),
	contratos: z.array(ContratoRequestSchema),
	googleDrive: GoogleDriveRequestSchema,
});

export type EmpresaAdminPostRequest = z.infer<typeof EmpresaAdminPostRequestSchema>;

export const EmpresaAdminPatchRequestSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
	cnpj: z.string(),
	contratoAtualId: z.number(),
	contratos: z.array(ContratoRequestSchema),
	googleDrive: GoogleDriveRequestSchema,
	updatedAt: dateToApiDateTimeSchema,
});

export type EmpresaAdminPatchRequest = z.infer<typeof EmpresaAdminPatchRequestSchema>;

export const EmpresaAparenciaPatchRequestSchema = z.object({
	icone: z.optional(z.nullable(z.string())),
	cor: z.nullable(AparenciaCorSchema),
	updatedAt: dateToApiDateTimeSchema,
});

export type EmpresaAparenciaPatchRequest = z.infer<typeof EmpresaAparenciaPatchRequestSchema>;

export const EmpresaLimitesResponseSchema = z.object({
	limiteUsuarios: z.number(),
	usuariosAtivos: z.number(),
});

export type EmpresaLimitesResponse = z.infer<typeof EmpresaLimitesResponseSchema>;