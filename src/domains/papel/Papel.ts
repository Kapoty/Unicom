import { z } from "zod";

export const PermissaoSchema = z.enum([
	'CONFIGURAR_EMPRESA',
	'CADASTRAR_USUARIOS',
	'CADASTRAR_EQUIPES',
	'VER_TODAS_VENDAS',
	'VER_TODAS_EQUIPES',
	'AUDITAR_VENDA',
	'ALTERAR_VENDEDOR',
	'REALIZAR_AUTOMACOES',
	'VER_LIXEIRA',
])

export type Permissao = z.infer<typeof PermissaoSchema>;

export const PapelAPISchema = z.object({
    papelId: z.number(),
    nome: z.string(),
    papeisAbaixo: z.array(z.number()),
    permissoes: z.array(PermissaoSchema.or(z.string())),
});

export type IPapelAPI = z.infer<typeof PapelAPISchema>;

export const PapelSchema = PapelAPISchema.transform((data) => ({
	...data
}));

export type IPapel = z.infer<typeof PapelSchema>;

export class Papel implements IPapel {
	papelId!: IPapel['papelId'];
    nome!: IPapel['nome'];
    papeisAbaixo!: IPapel['papeisAbaixo'];
    permissoes!: IPapel['permissoes'];

	private constructor(dados: IPapel) {
		Object.assign(this, dados);
	}

	static create(dados: IPapelAPI) {
		return new Papel(PapelSchema.parse(dados));
	}

	contemPermissao(permissao: Permissao) {
		return this.permissoes.includes(permissao);
	}
}