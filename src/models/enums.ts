import { z } from "zod";

export const PapelSistemaSchema = z.enum(["ADMIN", "USUARIO"]);

export type PapelSistema = z.infer<typeof PapelSistemaSchema>;

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