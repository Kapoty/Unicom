import { string, z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";
import { VendaStatusCategoriaSchema, VendaStatusTipoSchema } from "./VendaStatus";

export const VendaStatusPostRequestSchema = z.object({
	empresaId: z.nullable(z.number()),
	nome: z.string(),
	icone: z.string(),
	categoria: VendaStatusCategoriaSchema,
	cor: z.string(),
	ordem: z.number(),
	tipoProduto: z.nullable(VendaTipoProdutoSchema),
	tipo: VendaStatusTipoSchema,
});

export type VendaStatusPostRequest = z.infer<typeof VendaStatusPostRequestSchema>;

export const VendaStatusPatchRequestSchema = z.object({
	nome: z.string(),
	icone: z.string(),
	categoria: VendaStatusCategoriaSchema,
	cor: z.string(),
	ordem: z.number(),
	tipoProduto: z.nullable(VendaTipoProdutoSchema),
	tipo: VendaStatusTipoSchema,
	updatedAt: dateToApiDateTimeSchema,
});

export type VendaStatusPatchRequest = z.infer<typeof VendaStatusPatchRequestSchema>;