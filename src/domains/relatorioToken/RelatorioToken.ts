import { z } from "zod";

export const RelatorioTokenSchema = z.object({
	usuarioId: z.number(),
	token: z.string(),
});

export type IRelatorioToken = z.infer<typeof RelatorioTokenSchema>;