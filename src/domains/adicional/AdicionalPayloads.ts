import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";

export const AdicionalPostRequestSchema = z.object({
	nome: z.string(),
	tipoProduto: VendaTipoProdutoSchema,
});

export type AdicionalPostRequest = z.infer<typeof AdicionalPostRequestSchema>;

export const AdicionalPatchRequestSchema = z.object({
	nome: z.string(),
	tipoProduto: VendaTipoProdutoSchema,
	updatedAt: dateToApiDateTimeSchema,
});

export type AdicionalPatchRequest = z.infer<typeof AdicionalPatchRequestSchema>;