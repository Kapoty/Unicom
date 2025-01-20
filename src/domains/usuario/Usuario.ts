import { z } from "zod";
import { apiDateTimeToDateSchema, parseDate } from "../../shared/utils/dateUtils";
import { EmpresaPublicSchema } from "../empresa/Empresa";
import { PerfilSchema } from "../perfil/Perfil";

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
    papelSistema: PapelSistemaSchema,
    empresaPrincipalId: z.number(),
    aceiteTermos: z.nullable(AceiteTermosSchema),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IUsuarioMeAPI = z.infer<typeof UsuarioMeAPISchema>;

export const UsuarioMeSchema = UsuarioMeAPISchema.transform((data) => ({
	...data,
	isAdmin: data.papelSistema == 'ADMIN'
}));

export type IUsuarioMe = z.infer<typeof UsuarioMeSchema>;

export const UsuarioAdminAPISchema = z.object({
    usuarioId: z.number(),
    nomeCompleto: z.string(),
    email: z.string(),
    matricula: z.nullable(z.number()),
    papelSistema: PapelSistemaSchema,
    empresaPrincipalId: z.number(),
    aceiteTermos: z.nullable(AceiteTermosSchema),
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IUsuarioAdminAPI = z.infer<typeof UsuarioAdminAPISchema>;

export const UsuarioAdminSchema = UsuarioAdminAPISchema.transform((data) => ({
	...data,
	isAdmin: data.papelSistema == 'ADMIN'
}));

export type IUsuarioAdmin = z.infer<typeof UsuarioAdminSchema>;

export const UsuarioPublicAPISchema = z.object({
    usuarioId: z.number(),
    nomeCompleto: z.string(),
    email: z.string(),
    matricula: z.nullable(z.number()),
    papelSistema: PapelSistemaSchema,
	empresaPrincipal: EmpresaPublicSchema,
	perfilPrincipal: PerfilSchema,
});

export type IUsuarioPublicAPI = z.infer<typeof UsuarioPublicAPISchema>;

export const UsuarioPublicSchema = UsuarioPublicAPISchema.transform((data) => ({
	...data,
	isAdmin: data.papelSistema == 'ADMIN'
}));

export type IUsuarioPublic = z.infer<typeof UsuarioPublicSchema>;