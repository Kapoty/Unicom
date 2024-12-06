import { z } from "zod";
import { parseDate } from "../../shared/utils/dateUtils";

export const PapelSistemaSchema = z.enum(["ADMIN", "USUARIO"]);

export type PapelSistema = z.infer<typeof PapelSistemaSchema>;

export const AceiteTermosSchema = z.object ({
    data: z.nullable(z.string().transform(data => parseDate(data))),
    versao: z.nullable(z.number()),
})

export const UsuarioMeAPISchema = z.object({
    usuarioId: z.number(),
    nomeCompleto: z.string(),
    email: z.string(),
    matricula: z.nullable(z.number()),
    ativo: z.boolean(),
    papelSistema: PapelSistemaSchema,
    empresaPrincipalId: z.number(),
    aceiteTermos: z.nullable(AceiteTermosSchema),
});

export type IUsuarioMeAPI = z.infer<typeof UsuarioMeAPISchema>;

export const UsuarioMeSchema = UsuarioMeAPISchema.transform((data) => ({
	...data,
	isAdmin: data.papelSistema == 'ADMIN'
}));

export type IUsuarioMe = z.infer<typeof UsuarioMeSchema>;