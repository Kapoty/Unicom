import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";
import { CampoExtraSlotSchema } from "./CampoExtra";

export const CampoExtraPostRequestSchema = z.object({
	campoExtraSlot: CampoExtraSlotSchema,
	nome: z.string(),
	ativo: z.boolean(),
	obrigatorio: z.boolean(),
	elevado: z.boolean(),
	sugestoes: z.array(z.string()),
	referencia: z.boolean(),
	regex: z.nullable(z.string()),
	valorPadrao: z.string(),
	tipoProduto: z.nullable(VendaTipoProdutoSchema),
});

export type CampoExtraPostRequest = z.infer<typeof CampoExtraPostRequestSchema>;

export const CampoExtraPatchRequestSchema = z.object({
	campoExtraSlot: CampoExtraSlotSchema,
	nome: z.string(),
	ativo: z.boolean(),
	obrigatorio: z.boolean(),
	elevado: z.boolean(),
	sugestoes: z.array(z.string()),
	referencia: z.boolean(),
	regex: z.nullable(z.string()),
	valorPadrao: z.string(),
	tipoProduto: z.nullable(VendaTipoProdutoSchema),
	updatedAt: dateToApiDateTimeSchema,
});

export type CampoExtraPatchRequest = z.infer<typeof CampoExtraPatchRequestSchema>;