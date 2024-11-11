import { z } from "zod";

export const PapelSchema = z.object({
    papelId: z.number(),
    nome: z.string(),
    papeisAbaixo: z.array(z.number()),
    permissoes: z.array(z.string()),
});

export type Papel = z.infer<typeof PapelSchema>;