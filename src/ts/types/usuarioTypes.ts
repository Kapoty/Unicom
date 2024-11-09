import { z } from "zod";
import { PapelSistemaSchema } from "../enums/apiEnums";
import { parseDate } from "../../utils/date";

export const AceiteTermosSchema = z.object ({
    data: z.nullable(z.string().transform(data => parseDate(data))),
    versao: z.nullable(z.number()),
})

export const UsuarioMeSchema = z.object({
    usuarioId: z.number(),
    nomeCompleto: z.string(),
    email: z.string(),
    matricula: z.nullable(z.number()),
    ativo: z.boolean(),
    papelSistema: PapelSistemaSchema,
    empresaPrincipalId: z.number(),
    aceiteTermos: z.nullable(AceiteTermosSchema),
});

export type UsuarioMe = z.infer<typeof UsuarioMeSchema>;