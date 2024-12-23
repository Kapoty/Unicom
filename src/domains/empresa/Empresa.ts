import { z } from "zod";
import { apiDateTimeToDateSchema, parseDate } from "../../shared/utils/dateUtils";
import { GrupoSchema } from "../grupo/Grupo";
import { DominioSchema } from "../dominio/Dominio";

export const AparenciaCorSchema = z.enum([
	'red',
	'pink',
	'purple',
	'deepPurple',
	'indigo',
	'blue',
	'lightBlue',
	'cyan',
	'teal',
	'green',
	'lightGreen',
	'lime',
	'yellow',
	'amber',
	'orange',
	'deepOrange'
])

export type AparenciaCor = z.infer<typeof AparenciaCorSchema>;

export const AparenciaSchema = z.object({
	cor: z.nullable(AparenciaCorSchema),
	icone: z.nullable(z.string()),
});

export type IAparencia = z.infer<typeof AparenciaSchema>;

export const ContratoKeySchema = z.object({
	contratoId: z.number(),
	empresaId: z.number(),
});

export type IContratoKey = z.infer<typeof ContratoKeySchema>;

export const ContratoSchema = z.object({
	contratoId: ContratoKeySchema,
	ativo: z.boolean(),
	limiteUsuarios: z.number(),
	inicio: z.nullable(apiDateTimeToDateSchema),
	fim: z.nullable(apiDateTimeToDateSchema),
	valor: z.nullable(z.number()),
});

export type IContrato = z.infer<typeof ContratoSchema>;

export const EmpresaPublicSchema = z.object({
	empresaId: z.number(),
	grupoId: z.number(),
	grupo: GrupoSchema,
	nome: z.string(),
	aparencia: z.nullable(AparenciaSchema),
});

export type IEmpresaPublic = z.infer<typeof EmpresaPublicSchema>;

export const EmpresaSchema = EmpresaPublicSchema.extend({
	cnpj: z.string(),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IEmpresa = z.infer<typeof EmpresaSchema>;

export const EmpresaAdminSchema = EmpresaSchema.extend({
	contratoAtualId: z.number(),
	contratoAtual: ContratoSchema,
	contratos: z.array(ContratoSchema),
	dominios: z.array(DominioSchema),
});

export type IEmpresaAdmin = z.infer<typeof EmpresaAdminSchema>;