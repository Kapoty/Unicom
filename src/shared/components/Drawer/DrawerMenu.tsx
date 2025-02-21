import { Abc, Add, AddCard, Apartment, CorporateFare, CreditCard, DisplaySettings, GroupAdd, Groups, Home, Leaderboard, Palette, Settings, Workspaces, Badge as BadgeIcon, ManageAccounts, People, PersonAddAlt1, Description, NoteAdd, Note, Place, AddLocation, AddCircle, AirlineStops, Computer, AccountBalance, Info, Input } from "@mui/icons-material";
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
import { IEquipe } from "../../../domains/equipe/Equipe";
import { useEquipesAdminByEmpresaIdQuery, useEquipesByPerfilQuery } from "../../../domains/equipe/EquipeQueries";

export interface DrawerMenuItemContext {
	usuarioLogado?: IUsuarioMe,
	empresa?: IEmpresaPublic,
	empresaId?: number | undefined,
	papel?: Papel,
	location: Location,
	relatorios?: IRelatorio[],
	equipes?: IEquipe[],
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
		custom?: ((context: DrawerMenuItemContext) => boolean);
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
		titulo: "Bancos",
		icone: <AccountBalance />,
		match: /^\/admin\/bancos/,
		condicoes: {
			admin: true,
			empresaId: false,
		},
		submenu: [
			{
				titulo: "Bancos",
				icone: <AccountBalance />,
				match: /^\/admin\/bancos$/,
				to: '/admin/bancos',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			},
			{
				titulo: "Novo Banco",
				icone: <Add />,
				match: /^\/admin\/bancos\/\w+/,
				to: '/admin/bancos/add',
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
				icone: <Add />,
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
		titulo: "Equipes",
		icone: <Groups />,
		match: /^\/e\/\d+\/equipes/,
		condicoes: {
			empresa: true,
		},
		submenu: (context) => context.equipes?.map(equipe => ({
			titulo: equipe.nome,
			icone: <Icon>{equipe?.icone ?? 'groups'}</Icon>,
			match: new RegExp(`^\/e\/\\d+\/equipes\/${equipe.equipeId}$`),
			to: `/e/${context?.empresa?.empresaId}/equipes/${equipe.equipeId}`,
			condicoes: {
				empresa: true,
			}
		})).toSorted((a, b) => a.titulo.localeCompare(b.titulo)) ?? []
	},
	{
		titulo: "Usuários e Perfis",
		icone: <People />,
		match: /(^\/e\/\d+\/usuarios(?!\/me))|^\/e\/\d+\/perfis/,
		condicoes: {
			empresa: true,
			permissao: "CADASTRAR_USUARIOS"
		},
		submenu: [
			{
				titulo: "Usuários",
				icone: <People />,
				match: /^\/e\/\d+\/usuarios$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/usuarios`,
				condicoes: {
					empresa: true,
				}
			},
			{
				titulo: "Novo Usuário",
				icone: <Add />,
				match: /^\/e\/\d+\/usuarios\/(?!me)\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/usuarios/add`,
				condicoes: {
					empresa: true,
				}
			},
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
		titulo: "Cadastros e Configurações",
		icone: <Settings />,
		match: /(^\/e\/\d+\/cadastros)|(^\/e\/\d+\/empresa)/,
		condicoes: {
			empresa: true,
			custom: (context) => (context?.usuarioLogado?.isAdmin || context?.papel?.contemPermissao('CADASTRAR_EQUIPES') || context?.papel?.contemPermissao('CONFIGURAR_EMPRESA')) ?? false,
		},
		submenu: [
			{
				titulo: "Aparência",
				icone: <Palette />,
				match: /^\/e\/\d+\/empresa\/aparencia$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/empresa/aparencia`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Relatórios",
				icone: <DisplaySettings />,
				match: /^\/e\/\d+\/cadastros\/relatorios$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/relatorios`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Relatório",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/relatorios\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/relatorios/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Equipes",
				icone: <Groups />,
				match: /^\/e\/\d+\/cadastros\/equipes$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/equipes`,
				condicoes: {
					empresa: true,
					permissao: "CADASTRAR_EQUIPES"
				}
			},
			{
				titulo: "Nova Equipe",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/equipes\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/equipes/add`,
				condicoes: {
					empresa: true,
					permissao: "CADASTRAR_EQUIPES"
				}
			},
			{
				titulo: "Produtos",
				icone: <Description />,
				match: /^\/e\/\d+\/cadastros\/produtos$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/produtos`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Produto",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/produtos\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/produtos/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Adicionais",
				icone: <Note />,
				match: /^\/e\/\d+\/cadastros\/adicionais$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/adicionais`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Adicional",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/adicionais\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/adicionais/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Pdvs",
				icone: <Place />,
				match: /^\/e\/\d+\/cadastros\/pdvs$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/pdvs`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Pdv",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/pdvs\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/pdvs/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Origens",
				icone: <AirlineStops />,
				match: /^\/e\/\d+\/cadastros\/origens$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/origens`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Nova Origem",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/origens\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/origens/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Sistemas",
				icone: <Computer />,
				match: /^\/e\/\d+\/cadastros\/sistemas$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/sistemas`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Sistema",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/sistemas\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/sistemas/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Venda Status",
				icone: <Info />,
				match: /^\/e\/\d+\/cadastros\/venda-status$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/venda-status`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Venda Status",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/venda-status\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/venda-status/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Campo Extra",
				icone: <Input />,
				match: /^\/e\/\d+\/cadastros\/campos-extras$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/campos-extras`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
				}
			},
			{
				titulo: "Novo Campo Extra",
				icone: <Add />,
				match: /^\/e\/\d+\/cadastros\/campos-extras\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/cadastros/campos-extras/add`,
				condicoes: {
					empresa: true,
					permissao: "CONFIGURAR_EMPRESA"
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

		const { admin, empresa, empresaId, permissao, custom } = condicoes ?? {};

		const shouldRender = (
			(admin == undefined || admin == context?.usuarioLogado?.isAdmin)
			&& (empresa == undefined || empresa == !!context.empresa)
			&& (empresaId == undefined || empresaId == !!context.empresaId)
			&& (context?.usuarioLogado?.isAdmin || permissao == undefined || context?.papel?.contemPermissao(permissao))
			&& (custom == undefined || custom(context))
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
	const { data: equipes } = useEquipesByPerfilQuery(perfil?.perfilId);
	const { data: equipesAdmin } = useEquipesAdminByEmpresaIdQuery(empresa?.empresaId, usuarioLogado?.isAdmin ?? false);

	const items = useMemo(() => {
		const context = {
			usuarioLogado: usuarioLogado,
			empresa: empresa,
			empresaId: empresaId,
			location: location,
			papel: papel,
			relatorios: relatoriosAdmin?.filter(relatorio => relatorio.ativo) || relatorios,
			equipes: equipesAdmin || equipes,
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