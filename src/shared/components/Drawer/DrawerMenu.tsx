import { Abc, Add, AddCard, Apartment, CorporateFare, CreditCard, DisplaySettings, GroupAdd, Groups, Home, Leaderboard, Palette, Settings, Workspaces, Badge as BadgeIcon, ManageAccounts } from "@mui/icons-material";
import { Badge, Collapse, Icon, List } from "@mui/material";
import { useMemo } from "react";
import { Location, useLocation } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import useEmpresaIdParam from "../../hooks/useEmpresaIdParam";
import { IEmpresaPublic } from "../../../domains/empresa/Empresa";
import { Papel, Permissao } from "../../../domains/papel/Papel";
import { IUsuarioMe } from "../../../domains/usuario/Usuario";
import { usePapelAtualQuery } from "../../../domains/papel/PapelQueries";
import { useUsuarioLogadoQuery } from "../../../domains/usuario/UsuarioQueries";
import DrawerMenuItem from "./DrawerMenuItem";
import useAppStore from "../../state/useAppStore";
import { IRelatorio } from "../../../domains/relatorio/Relatorio";
import { useRelatoriosByEmpresaIdQuery, useRelatoriosByPerfilQuery } from "../../../domains/relatorio/RelatorioQueries";
import { usePerfilAtualQuery } from "../../../domains/perfil/PerfilQueries";

export interface DrawerMenuItemContext {
	usuarioLogado?: IUsuarioMe,
	empresa?: IEmpresaPublic,
	empresaId?: number | undefined,
	papel?: Papel,
	location: Location,
	relatorios?: IRelatorio[],
}

export interface IDrawerMenuItem {
	titulo: string;
	icone: JSX.Element;
	to?: string | ((context: DrawerMenuItemContext) => string);
	match?: RegExp;
	hideOnHome?: boolean;
	condicoes?: {
		admin?: boolean;
		empresa?: boolean;
		empresaId?: boolean;
		permissao?: Permissao;
	},
	submenu?: IDrawerMenuItem[] | ((context: DrawerMenuItemContext) => IDrawerMenuItem[]);
}

export const menuItems: IDrawerMenuItem[] = [
	{
		titulo: "Início",
		icone: <Home />,
		to: `/admin`,
		match: /^\/admin$/,
		hideOnHome: true,
		condicoes: {
			admin: true,
			empresaId: false,
		}
	},
	{
		titulo: "Empresas",
		icone: <CorporateFare />,
		match: /^\/admin\/empresas/,
		condicoes: {
			admin: true,
			empresaId: false,
		},
		submenu: [
			{
				titulo: "Empresas",
				icone: <CorporateFare />,
				match: /^\/admin\/empresas$/,
				to: '/admin/empresas',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			},
			{
				titulo: "Nova Empresa",
				icone: <Add />,
				match: /^\/admin\/empresas\/\w+/,
				to: '/admin/empresas/add',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			}
		]
	},
	{
		titulo: "Grupos",
		icone: <Workspaces />,
		match: /^\/admin\/grupos/,
		condicoes: {
			admin: true,
			empresaId: false,
		},
		submenu: [
			{
				titulo: "Grupos",
				icone: <Workspaces />,
				match: /^\/admin\/grupos$/,
				to: '/admin/grupos',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			},
			{
				titulo: "Novo Grupo",
				icone: <Add />,
				match: /^\/admin\/grupos\/\w+/,
				to: '/admin/grupos/add',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			}
		]
	},
	{
		titulo: "Domínios",
		icone: <Abc />,
		match: /^\/admin\/dominios/,
		condicoes: {
			admin: true,
			empresaId: false,
		},
		submenu: [
			{
				titulo: "Domínios",
				icone: <Abc />,
				match: /^\/admin\/dominios$/,
				to: '/admin/dominios',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			},
			{
				titulo: "Novo Domínio",
				icone: <Add />,
				match: /^\/admin\/dominios\/\w+/,
				to: '/admin/dominios/add',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			}
		]
	},
	{
		titulo: "Início",
		icone: <Home />,
		match: /^\/e\/\d+$/,
		to: (context) => `/e/${context?.empresa?.empresaId}`,
		hideOnHome: true,
		condicoes: {
			empresa: true,
		}
	},
	{
		titulo: "Vendas",
		icone: <CreditCard />,
		match: /^\/e\/\d+\/vendas/,
		condicoes: {
			empresa: true,
		},
		submenu: [
			{
				titulo: "Vendas",
				icone: <CreditCard />,
				match: /^\/e\/\d+\/vendas$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/vendas`,
				condicoes: {
					empresa: true,
				}
			},
			{
				titulo: "Nova Venda",
				icone: <AddCard />,
				match: /^\/e\/\d+\/vendas\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/vendas/add`,
				condicoes: {
					empresa: true,
				}
			}
		]
	},
	{
		titulo: "Relatórios",
		icone: <Leaderboard />,
		match: /^\/e\/\d+\/relatorios/,
		condicoes: {
			empresa: true,
		},
		submenu: (context) => context.relatorios?.map(relatorio => ({
			titulo: relatorio.titulo,
			icone: <Icon>{relatorio?.icone ?? 'leaderboard'}</Icon>,
			match: new RegExp(`^\/e\/\\d+\/relatorios\/${relatorio.uri}$`),
			to: `/e/${context?.empresa?.empresaId}/relatorios/${relatorio.uri}`,
			condicoes: {
				empresa: true,
			}
		})).toSorted((a, b) => a.titulo.localeCompare(b.titulo)) ?? []
	},
	{
		titulo: "Usuários",
		icone: <Groups />,
		match: /^\/e\/\d+\/usuarios/,
		condicoes: {
			empresa: true,
			permissao: "CADASTRAR_USUARIOS"
		},
		submenu: [
			{
				titulo: "Usuários",
				icone: <Groups />,
				match: /^\/e\/\d+\/usuarios$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/usuarios`,
				condicoes: {
					empresa: true,
				}
			},
			{
				titulo: "Novo Usuário",
				icone: <GroupAdd />,
				match: /^\/e\/\d+\/usuarios\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/usuarios/add`,
				condicoes: {
					empresa: true,
				}
			}
		]
	},
	{
		titulo: "Perfis",
		icone: <BadgeIcon />,
		match: /^\/e\/\d+\/perfis/,
		condicoes: {
			empresa: true,
			permissao: "CADASTRAR_USUARIOS"
		},
		submenu: [
			{
				titulo: "Perfis",
				icone: <BadgeIcon />,
				match: /^\/e\/\d+\/perfis$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/perfis`,
				condicoes: {
					empresa: true,
				}
			},
			{
				titulo: "Novo Perfil",
				icone: <Add />,
				match: /^\/e\/\d+\/perfis\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/perfis/add`,
				condicoes: {
					empresa: true,
				}
			}
		]
	},
	{
		titulo: "Cadastrar Relatórios",
		icone: <DisplaySettings />,
		match: /^\/e\/\d+\/cadastrar-relatorios/,
		condicoes: {
			empresa: true,
			permissao: "CONFIGURAR_EMPRESA"
		},
		submenu: [
			{
				titulo: "Relatórios",
				icone: <DisplaySettings />,
				match: /^\/e\/\d+\/cadastrar-relatorios$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastrar-relatorios`,
				condicoes: {
					empresa: true,
				}
			},
			{
				titulo: "Novo Relatório",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastrar-relatorios\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastrar-relatorios/add`,
				condicoes: {
					empresa: true,
				}
			}
		]
	},
	{
		titulo: "Configurar Empresa",
		icone: <Settings />,
		match: /^\/e\/\d+\/configurar-empresa/,
		condicoes: {
			empresa: true,
			permissao: "CONFIGURAR_EMPRESA"
		},
		submenu: [
			{
				titulo: "Aparência",
				icone: <Palette />,
				match: /^\/e\/\d+\/configurar-empresa\/aparencia$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/configurar-empresa/aparencia`,
				condicoes: {
					empresa: true,
				}
			},
		]
	},
	{
		titulo: "Meu Usuário",
		icone: <ManageAccounts />,
		match: /^\/e\/\d+\/usuarios\/me/,
		to: (context) => `/e/${context?.usuarioLogado?.empresaPrincipalId}/usuarios/me`,
		condicoes: {
			empresa: true,
		}
	},
];

export const getActiveMenuItems = (items: IDrawerMenuItem[], context: DrawerMenuItemContext): IDrawerMenuItem[] => {
	let menuItems: IDrawerMenuItem[] = [];
	items.forEach((menuItem, i) => {

		const { condicoes } = menuItem;

		const { admin, empresa, empresaId, permissao } = condicoes ?? {};

		const shouldRender = (
			(admin == undefined || admin == context?.usuarioLogado?.isAdmin)
			&& (empresa == undefined || empresa == !!context.empresa)
			&& (empresaId == undefined || empresaId == !!context.empresaId)
			&& (context?.usuarioLogado?.isAdmin || permissao == undefined || context?.papel?.contemPermissao(permissao))
		)

		if (shouldRender) {
			menuItems.push({
				...menuItem,
				...(menuItem.submenu ? { submenu: getActiveMenuItems((typeof menuItem.submenu === 'function') ? menuItem.submenu(context) : menuItem.submenu, context) } : {}),
			});
		}
	});

	return menuItems;
}

const renderMenuItems = (items: IDrawerMenuItem[], context: DrawerMenuItemContext, depth = 1) => {
	return items.map((menuItem, i) => {

		const { titulo, icone, to, match, submenu } = menuItem;

		return <Collapse in={depth !== 1} key={i} >
			<DrawerMenuItem
				key={i}
				to={(typeof to === 'function') ? to(context) : to}
				titulo={titulo}
				icone={icone}
				selected={match?.test(context.location.pathname) ?? false}
				depth={depth}
			>
				{submenu && renderMenuItems((typeof submenu === 'function') ? submenu(context) : submenu, context, depth + 1)}
			</DrawerMenuItem>
		</Collapse>
	});
}

const DrawerMenu = () => {

	const { data: usuarioLogado } = useUsuarioLogadoQuery();
	const empresa = useAppStore(s => s.empresa);
	const location = useLocation();
	const { data: papel } = usePapelAtualQuery();
	const empresaId = useEmpresaIdParam();
	const { data: perfil } = usePerfilAtualQuery();
	const { data: relatorios } = useRelatoriosByPerfilQuery(perfil?.perfilId);
	const { data: relatoriosAdmin } = useRelatoriosByEmpresaIdQuery(empresa?.empresaId, usuarioLogado?.isAdmin ?? false);

	const items = useMemo(() => {
		const context = {
			usuarioLogado: usuarioLogado,
			empresa: empresa,
			empresaId: empresaId,
			location: location,
			papel: papel,
			relatorios: relatoriosAdmin?.filter(relatorio => relatorio.ativo) || relatorios,
		};
		const activeMenuItems = getActiveMenuItems(menuItems, context);
		return renderMenuItems(activeMenuItems, context);
	}, [usuarioLogado, empresa, empresaId, location, papel]);

	return <List disablePadding>
		{usuarioLogado &&
			<TransitionGroup>
				{items}
			</TransitionGroup>}
	</List>
}

export default DrawerMenu;