import { z } from "zod";
import { DatagridVisaoTipoSchema } from "../datagridVisao/DatagridVisao";

export const DatagridVisaoAtualMarcarRequestSchema = z.object({
	tipo: DatagridVisaoTipoSchema,
    nome: z.optional(z.string()),
	datagridVisaoId: z.optional(z.nullable(z.number())),
});

export type DatagridVisaoAtualMarcarRequest = z.infer<typeof DatagridVisaoAtualMarcarRequestSchema>;