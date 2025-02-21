import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";

export const ProdutoPostRequestSchema = z.object({
	nome: z.string(),
	valor: z.number(),
	ordem: z.number(),
	tipoProduto: VendaTipoProdutoSchema,
});

export type ProdutoPostRequest = z.infer<typeof ProdutoPostRequestSchema>;

export const ProdutoPatchRequestSchema = z.object({
	nome: z.string(),
	valor: z.number(),
	ordem: z.number(),
	tipoProduto: VendaTipoProdutoSchema,
	updatedAt: dateToApiDateTimeSchema,
});

export type ProdutoPatchRequest = z.infer<typeof ProdutoPatchRequestSchema>;