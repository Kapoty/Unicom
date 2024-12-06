import { z } from "zod";
import { DatagridVisaoTipoSchema } from "../datagridVisao/DatagridVisao";

export const DatagridVisaoAtualIdSchema = z.object({
	usuarioId: z.number(),
	datagrid: z.string(),
});

export const DatagridVisaoAtualSchema = z.object({
    datagridVisaoAtualId: DatagridVisaoAtualIdSchema,
	tipo: DatagridVisaoTipoSchema,
    nome: z.nullable(z.string()),
	datagridVisaoId: z.nullable(z.number()),
});

export type IDatagridVisaoAtual = z.infer<typeof DatagridVisaoAtualSchema>;