import { z } from "zod";

export const GrupoSchema = z.object({
	grupoId: z.number(),
	nome: z.string(),
});

export type IGrupo = z.infer<typeof GrupoSchema>;