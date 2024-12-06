import { z } from "zod";
import { DatagridVisaoTipoSchema } from "../datagridVisao/DatagridVisao";

export const MarcarDatagridVisaoAtualRequestSchema = z.object({
	tipo: DatagridVisaoTipoSchema,
    nome: z.optional(z.string()),
	datagridVisaoId: z.optional(z.nullable(z.number())),
});

export type MarcarDatagridVisaoAtualRequest = z.infer<typeof MarcarDatagridVisaoAtualRequestSchema>;