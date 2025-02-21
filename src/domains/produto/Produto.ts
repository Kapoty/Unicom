import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";

export const ProdutoSchema = z.object({
	produtoId: z.number(),
	empresaId: z.number(),
	nome: z.string(),
	valor: z.number(),
	ordem: z.number(),
	tipoProduto: VendaTipoProdutoSchema,
});

export type IProduto = z.infer<typeof ProdutoSchema>;

export const ProdutoAdminSchema = ProdutoSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IProdutoAdmin = z.infer<typeof ProdutoAdminSchema>;