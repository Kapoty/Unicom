import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";
import { UsuarioPublicAPISchema } from "../usuario/Usuario";

export const PerfilAdminSchema = z.object({
	perfilId: z.number(),
	usuarioId: z.nullable(z.number()),
	usuario: z.nullable(UsuarioPublicAPISchema),
	empresaId: z.number(),
	papelId: z.number(),
	papelNome: z.string(),
	aceito: z.boolean(),
	ativo: z.boolean(),
	nome: z.string(),
	foto: z.nullable(z.string()),
	equipeId: z.nullable(z.number()),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IPerfilAdmin = z.infer<typeof PerfilAdminSchema>;