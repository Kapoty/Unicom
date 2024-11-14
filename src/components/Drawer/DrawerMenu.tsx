import { Collapse, Grow, List, Stack } from "@mui/material";
import { TransitionGroup } from "react-transition-group"
import DrawerMenuItem from "./DrawerMenuItem";
import { Permissao } from "../../models/enums";
import {Home as HomeIcon, CreditCard, AddCard, Lock, Settings, HeartBroken, Star, Apartment, Groups} from "@mui/icons-material";
import { IUsuarioMe } from "../../models/Usuario";
import { IEmpresaPublic } from "../../models/Empresa";
import { useUsuarioLogadoQuery } from "../../queries/useUsuarioQueries";
import useAppStore from "../../state/useAppStore";
import { useLocation } from "react-router-dom";
import { Context, useMemo } from "react";
import { Papel } from "../../models/Papel";
import { usePapelAtualQuery } from "../../queries/usePapelQueries";
import { Location } from "react-router-dom";

export interface DrawerMenuItemContext {
	usuarioLogado?: IUsuarioMe,
	empresa?: IEmpresaPublic,
	papel?: Papel,
	location: Location,
}

export interface IDrawerMenuItem {
	titulo: string;
	icone: JSX.Element;
	to?: string | ((context: DrawerMenuItemContext) => string);
	match?: RegExp
	condicoes?: {
		admin?: boolean;
		empresa?: boolean;
		permissao?: Permissao;
	},
	submenu?: IDrawerMenuItem[];
}

const menuItems: IDrawerMenuItem[] = [
	{
		titulo: "Admin",
		icone: <Lock/>,
		to: `/admin`,
		match: /^\/admin$/,
		condicoes: {
			admin: true,
			empresa: false,
		}
	},
	{
		titulo: "Empresas",
		icone: <Apartment/>,
		to: `/admin/empresas`,
		match: /^\/admin\/empresas$/,
		condicoes: {
			admin: true,
			empresa: false,
		}
	},
	{
		titulo: "Início",
		icone: <HomeIcon/>,
		match: /^\/e\/\d+$/,
		to: (context) => `/e/${context?.empresa?.empresaId}`,
		condicoes: {
			empresa: true,
		}
	},
	{
		titulo: "Vendas",
		icone: <CreditCard/>,
		match: /^\/e\/\d+\/vendas/,
		condicoes: {
			empresa: true,
		},
		submenu: [
			{
				titulo: "Vendas",
				icone: <CreditCard/>,
				match: /^\/e\/\d+\/vendas$/,
				to: (context) => `/e/${context?.empresa?.empresaId}/vendas`,
				condicoes: {
					empresa: true,
				}
			},
			{
				titulo: "Nova Venda",
				icone: <AddCard/>,
				match: /^\/e\/\d+\/vendas\/\w+/,
				to: (context) => `/e/${context?.empresa?.empresaId}/vendas/add`,
				condicoes: {
					empresa: true,
				}
			}
		]
	},
	{
		titulo: "Usuários",
		icone: <Groups/>,
		match: /^\/e\/\d+\/usuarios/,
		to: (context) => `/e/${context?.empresa?.empresaId}/usuarios`,
		condicoes: {
			empresa: true,
			permissao: "CADASTRAR_USUARIOS"
		}
	},
	{
		titulo: "Configurações",
		icone: <Settings/>,
		match: /^\/e\/\d+\/configuracoes\/\w+/,
		to: (context) => `/e/${context?.empresa?.empresaId}/configuracoes`,
		condicoes: {
			empresa: true,
			permissao: "CONFIGURAR_EMPRESA",
		}
	},
	{
		titulo: "Estrela",
		icone: <Star/>,
		match: /^\/e\/\d+\/configuracoes\/\w+/,
		to: (context) => `/e/${context?.empresa?.empresaId}/configuracoes`,
		condicoes: {
			empresa: true,
		}
	},
	{
		titulo: "Coração",
		icone: <HeartBroken/>,
		match: /^\/e\/\d+\/configuracoes\/\w+/,
		to: (context) => `/e/${context?.empresa?.empresaId}/configuracoes`,
		condicoes: {
			empresa: true,
			permissao: "CONFIGURAR_EMPRESA",
		}
	},
];

const renderMenuItems = (items: IDrawerMenuItem[], context: DrawerMenuItemContext, depth = 1) => {
	return items.map((menuItem, i) => {

		const { titulo, icone, to, match, condicoes, submenu } = menuItem;

		const { admin, empresa, permissao } = condicoes ?? {};

		const shouldRender = (
			(admin == undefined || admin == context?.usuarioLogado?.isAdmin)
			&& (empresa == undefined || empresa == !!context.empresa)
			&& (admin || permissao == undefined || context?.papel?.contemPermissao(permissao))
		)

		if (shouldRender) {
			return <Collapse key={i} >
				<DrawerMenuItem
					key={i}
					to={(typeof to === 'function') ? to(context) : to}
					titulo={titulo}
					icone={icone}
					selected={match?.test(context.location.pathname) ?? false}
					depth={depth}
				>
					{submenu && renderMenuItems(submenu, context, depth + 1)}
				</DrawerMenuItem>
			</Collapse>
		}
	});
}

const DrawerMenu = () => {

	const {data: usuarioLogado} = useUsuarioLogadoQuery();
	const empresa = useAppStore(s => s.empresa);
	const location = useLocation();
	const {data: papel} = usePapelAtualQuery();

	const items = useMemo(() => renderMenuItems(menuItems, {
			usuarioLogado: usuarioLogado,
			empresa: empresa,
			location: location,
			papel: papel,
	}	), [usuarioLogado, empresa, location, papel]);

	return <List disablePadding>
		{usuarioLogado &&
			<TransitionGroup>
				{items}
			</TransitionGroup>}
		</List>
}

export default DrawerMenu;