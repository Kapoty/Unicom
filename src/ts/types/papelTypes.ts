import { z } from "zod";
import { Permissoes } from "../enums/apiEnums";

export const PapelSchema = z.object({
    papelId: z.number(),
    nome: z.string(),
    papeisAbaixo: z.array(z.number()),
    permissoes: z.array(z.nativeEnum(Permissoes).or(z.string())),
});

export type Papel = z.infer<typeof PapelSchema>;