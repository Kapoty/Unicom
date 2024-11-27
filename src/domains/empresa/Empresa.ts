import { z } from "zod";
import { parseDate } from "../../shared/utils/dateUtil";

export const GrupoSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
});

export type IGrupo = z.infer<typeof GrupoSchema>;

export const AparenciaSchema = z.object({
	cor: z.string(),
	icone: z.string(),
});

export type IAparencia = z.infer<typeof AparenciaSchema>;

export const ContratoSchema = z.object({
	contratoId: z.number(),
	empresaId: z.number(),
	ativo: z.boolean(),
	limiteUsuarios: z.number(),
	inicio: z.nullable(z.string().transform(data => parseDate(data))),
	fim: z.nullable(z.string().transform(data => parseDate(data))),
	valor: z.nullable(z.number()),
});

export type IContrato = z.infer<typeof ContratoSchema>;

export const DominioSchema = z.object({
	dominioId: z.number(),
	dominio: z.string(),
	empresaId: z.number(),
});

export type IDominio = z.infer<typeof DominioSchema>;

export const EmpresaPublicSchema = z.object({
	empresaId: z.number(),
	grupo: GrupoSchema,
	nome: z.string(),
	aparencia: z.nullable(AparenciaSchema),
});

export type IEmpresaPublic = z.infer<typeof EmpresaPublicSchema>;

export const EmpresaSchema = EmpresaPublicSchema.extend({
	cnpj: z.string()
});

export type IEmpresa = z.infer<typeof EmpresaSchema>;

export const EmpresaAdminSchema = EmpresaSchema.extend({
	contratoId: z.number(),
	contratos: z.array(ContratoSchema),
	dominios: z.array(DominioSchema),
});

export type IEmpresaAdmin = z.infer<typeof EmpresaAdminSchema>;