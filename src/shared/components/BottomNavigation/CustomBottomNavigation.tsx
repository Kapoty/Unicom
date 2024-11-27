import { Add, AddCard, Apartment, CreditCard, Home } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Divider, Paper } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Location, useLocation } from "react-router-dom";
import useEmpresaIdParam from "../../hooks/useEmpresaIdParam";
import { IEmpresaPublic } from "../../../domains/empresa/Empresa";
import { Papel, Permissao } from "../../../domains/papel/Papel";
import { IUsuarioMe } from "../../../domains/usuario/Usuario";
import { usePapelAtualQuery } from "../../../domains/papel/PapelQueries";
import { useUsuarioLogadoQuery } from "../../../domains/usuario/UsuarioQueries";
import browserHistory from "../../utils/browserHistory";
import useAppStore from "../../state/useAppStore";

export interface BNavItemContext {
	usuarioLogado?: IUsuarioMe,
	empresa?: IEmpresaPublic,
	empresaId?: number | undefined,
	papel?: Papel,
	location: Location,
}

export interface BNavItem {
	titulo: string;
	icone: JSX.Element;
	to?: string | ((context: BNavItemContext) => string);
	match?: RegExp
	condicoes?: {
		admin?: boolean;
		empresa?: boolean;
		empresaId?: boolean,
		permissao?: Permissao;
	},
}

const bNavItems: BNavItem[] = [
	{
		titulo: "Início",
		icone: <Home />,
		match: /^\/e\/\d+$/,
		to: (context) => `/e/${context?.empresa?.empresaId}`,
		condicoes: {
			empresa: true,
		}
	},
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
	},
	{
		titulo: "Início",
		icone: <Home />,
		match: /^\/admin$/,
		to: '/admin',
		condicoes: {
			admin: true,
			empresaId: false,
		}
	},
	{
		titulo: "Empresas",
		icone: <Apartment />,
		match: /^\/admin\/empresas$/,
		to: `/admin/empresas`,
		condicoes: {
			admin: true,
			empresaId: false,
		}
	},
	{
		titulo: "Nova Empresa",
		icone: <Add />,
		match: /^\/admin\/empresas\/\w+$/,
		to: `/admin/empresas/add`,
		condicoes: {
			admin: true,
			empresaId: false,
		}
	}
];

const renderBNavItems = (items: BNavItem[], context: BNavItemContext) => {
	return items.map((bNavItem, i) => {

		const { titulo, icone, to, match, condicoes } = bNavItem;

		const { admin, empresa, empresaId, permissao } = condicoes ?? {};

		const shouldRender = (
			(admin == undefined || admin == context?.usuarioLogado?.isAdmin)
			&& (empresa == undefined || empresa == !!context.empresa)
			&& (empresaId == undefined || empresaId == !!context.empresaId)
			&& (admin || permissao == undefined || context?.papel?.contemPermissao(permissao))
		)

		if (shouldRender) {
			return <BottomNavigationAction
				key={i}
				label={titulo}
				icon={icone}
			/>
		}
	});
}

const getSelectedValue = (location: Location) => {
	for (let i = 0; i < bNavItems.length; i++)
		if (bNavItems[i]?.match?.test(location.pathname))
			return i;
}

const CustomBottomNavigation = () => {

	const { data: usuarioLogado } = useUsuarioLogadoQuery();
	const empresa = useAppStore(s => s.empresa);
	const location = useLocation();
	const { data: papel } = usePapelAtualQuery();
	const empresaId = useEmpresaIdParam();

	const items = useMemo(() => renderBNavItems(bNavItems, {
		usuarioLogado: usuarioLogado,
		empresa: empresa,
		empresaId: empresaId,
		location: location,
		papel: papel,
	}), [usuarioLogado, empresa, empresaId, location, papel]);

	const selectedValue = useMemo(() => getSelectedValue(location),
		[location]);

	const handleChange = useCallback((event: React.SyntheticEvent, value: any) => {
		let to = bNavItems?.[value]?.to
		if (to)
			browserHistory.push((typeof to === 'function') ? to({
				usuarioLogado: usuarioLogado,
				empresa: empresa,
				location: location,
				papel: papel,
			}) : to);
	}, [usuarioLogado, empresa, location, papel])

	return <Paper elevation={0}>
		<Divider />
		<BottomNavigation
			showLabels
			value={selectedValue}
			onChange={handleChange}
		>
			{items}
		</BottomNavigation>
	</Paper>
}

export default CustomBottomNavigation;