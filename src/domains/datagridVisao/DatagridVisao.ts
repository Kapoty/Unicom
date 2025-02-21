import { z } from "zod";
import { GridInitialStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";

export const DatagridVisaoTipoSchema = z.enum(["PADRAO", "PERSONALIZADA"]);

export type DatagridVisaoTipo = z.infer<typeof DatagridVisaoTipoSchema>;

export const DatagridVisaoAPISchema = z.object({
    datagridVisaoId: z.number(),
    usuarioId: z.number(),
    datagrid: z.string(),
    nome: z.string(),
    state: z.unknown(),
});

export type IDatagridVisaoAPI = z.infer<typeof DatagridVisaoAPISchema>;

export const DatagridVisaoSchema = DatagridVisaoAPISchema.pick({
	nome: true,
	state: true,
}).extend({
	datagridVisaoId: z.optional(z.number()),
	tipo: DatagridVisaoTipoSchema,
});

export type IDatagridVisao = z.infer<typeof DatagridVisaoSchema>;

export const APItoModelConverter = DatagridVisaoAPISchema.transform<IDatagridVisao>((data) => ({
	...data,
	tipo: "PERSONALIZADA"
}));

export const DatagridVisaoPostRequestSchema = z.object({
	nome: z.string(),
	state: z.unknown(),
});

export type DatagridVisaoPostRequest = z.infer<typeof DatagridVisaoPostRequestSchema>;

export const DatagridVisaoPatchRequestSchema = DatagridVisaoPostRequestSchema.partial();

export type DatagridVisaoPatchRequest = z.infer<typeof DatagridVisaoPatchRequestSchema>;