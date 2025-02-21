import { z } from "zod";

export const VendaTipoProdutoSchema = z.enum(['FIBRA', 'MOVEL'
])

export type VendaTipoProduto = z.infer<typeof VendaTipoProdutoSchema>;