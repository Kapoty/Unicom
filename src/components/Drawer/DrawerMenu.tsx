import { Collapse, Grow, List, Stack } from "@mui/material";
import { TransitionGroup } from "react-transition-group"
import DrawerMenuItem from "./DrawerMenuItem";
import { Permissao } from "../../models/enums";
import {Home as HomeIcon, CreditCard, AddCard, Lock, Settings, HeartBroken, Star, Apartment, Groups, Add} from "@mui/icons-material";
import { IUsuarioMe } from "../../models/Usuario";
import { IEmpresaPublic } from "../../models/Empresa";
import { useUsuarioLogadoQuery } from "../../queries/useUsuarioQueries";
import useAppStore from "../../state/useAppStore";
import { useLocation } from "react-router-dom";
import { Context, useMemo } from "react";
import { Papel } from "../../models/Papel";
import { usePapelAtualQuery } from "../../queries/usePapelQueries";
import { Location } from "react-router-dom";
import useEmpresaIdParam from "../../hooks/params/useEmpresaIdParam";

export interface DrawerMenuItemContext {
	usuarioLogado?: IUsuarioMe,
	empresa?: IEmpresaPublic,
	empresaId?: number | undefined,
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
		empresaId?: boolean;
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
			empresaId: false,
		}
	},
	{
		titulo: "Empresas",
		icone: <Apartment/>,
		match: /^\/admin\/empresas/,
		condicoes: {
			admin: true,
			empresaId: false,
		},
		submenu: [
			{
				titulo: "Empresas",
				icone: <CreditCard/>,
				match: /^\/admin\/empresas$/,
				to: '/admin/empresas',
				condicoes: {
					admin: true,
					empresaId: false,
				},
			},
			{
				titulo: "Nova Empresa",
				icone: <Add/>,
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
	}
];

const renderMenuItems = (items: IDrawerMenuItem[], context: DrawerMenuItemContext, depth = 1) => {
	return items.map((menuItem, i) => {

		const { titulo, icone, to, match, condicoes, submenu } = menuItem;

		const { admin, empresa, empresaId, permissao } = condicoes ?? {};

		const shouldRender = (
			(admin == undefined || admin == context?.usuarioLogado?.isAdmin)
			&& (empresa == undefined || empresa == !!context.empresa)
			&& (empresaId == undefined || empresaId == !!context.empresaId)
			&& (admin || permissao == undefined || context?.papel?.contemPermissao(permissao))
		)

		if (shouldRender) {
			return <Collapse in={depth !== 1} key={i} >
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
	const empresaId = useEmpresaIdParam();

	const items = useMemo(() => renderMenuItems(menuItems, {
			usuarioLogado: usuarioLogado,
			empresa: empresa,
			empresaId: empresaId,
			location: location,
			papel: papel,
	}	), [usuarioLogado, empresa, empresaId, location, papel]);

	return <List disablePadding>
		{usuarioLogado &&
			<TransitionGroup>
				{items}
			</TransitionGroup>}
		</List>
}

export default DrawerMenu;