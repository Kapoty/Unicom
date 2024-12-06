import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const ContratoRequestSchema = z.object({
	ativo: z.boolean(),
	limiteUsuarios: z.number(),
	inicio: z.nullable(dateToApiDateTimeSchema),
	fim: z.nullable(dateToApiDateTimeSchema),
	valor: z.nullable(z.number()),
})

export const PostEmpresaAdminRequestSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
	cnpj: z.string(),
	contratoId: z.number(),
	contratos: z.array(ContratoRequestSchema),
});

export type PostEmpresaAdminRequest = z.infer<typeof PostEmpresaAdminRequestSchema>;

export const PatchEmpresaAdminRequestSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
	cnpj: z.string(),
	contratoId: z.number(),
	contratos: z.array(ContratoRequestSchema),
	updatedAt: dateToApiDateTimeSchema,
});

export type PatchEmpresaAdminRequest = z.infer<typeof PatchEmpresaAdminRequestSchema>;