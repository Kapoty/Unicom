import { z } from "zod";

export const PerfilSchema = z.object({
	perfilId: z.number(),
	usuarioId: z.nullable(z.number()),
	empresaId: z.number(),
	papelId: z.number(),
	aceito: z.boolean(),
	ativo: z.boolean(),
	nome: z.string(),
	foto: z.nullable(z.string()),
});

export type IPerfil = z.infer<typeof PerfilSchema>;