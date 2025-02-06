import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";
import { PerfilSchema } from "../perfil/Perfil";

export const EquipeSchema = z.object({
	equipeId: z.number(),
	empresaId: z.number(),
	supervisorId: z.number(),
	nome: z.string(),
	icone: z.nullable(z.string()),
});

export type IEquipe = z.infer<typeof EquipeSchema>;

export const EquipeAdminSchema = z.object({
	equipeId: z.number(),
	empresaId: z.number(),
	supervisorId: z.number(),
	nome: z.string(),
	icone: z.nullable(z.string()),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IEquipeAdmin = z.infer<typeof EquipeAdminSchema>;

export const EquipeInfoSchema = z.object({
	equipeId: z.number(),
	empresaId: z.number(),
	supervisorId: z.number(),
	nome: z.string(),
	icone: z.nullable(z.string()),
	supervisor: PerfilSchema,
	membros: z.array(PerfilSchema),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IEquipeInfo = z.infer<typeof EquipeInfoSchema>;