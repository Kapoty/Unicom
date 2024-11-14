import { Stack } from "@mui/material";
import React, { lazy, LazyExoticComponent, PropsWithChildren, ReactNode, Suspense, useCallback, useMemo } from "react";
import { Navigate, Outlet, Params, redirect, Route, Routes, useMatch, useMatches, useParams } from "react-router-dom";
import DashboardContent from "../Dashboard/DashboardContent";
import { usePapelAtualQuery } from "../../queries/usePapelQueries";
import { useUsuarioLogadoQuery } from "../../queries/useUsuarioQueries";
import useAppStore from "../../state/useAppStore";
import { Permissoes } from "../../ts/enums/apiEnums";
import { EmpresaPublic } from "../../ts/types/empresaTypes";
import { Papel } from "../../ts/types/papelTypes";
import { UsuarioMe } from "../../ts/types/usuarioTypes";
import Carregando from "../../pages/Dashboard/Carregando";
import ListaVendas from "../../pages/Dashboard/Empresa/ListaVendas";
import EditarVenda from "../../pages/Dashboard/Empresa/EditarVenda";
import DashBoardPage from "../../pages/DashboardPage";
import LoginPage from "../../pages/LoginPage";
import CustomBackdrop from "../Backdrop/CustomBackdrop";
import useAuthStore from "../../state/useAuthStore";
import { BrowserHistory } from "history";
import browserHistory from "../../utils/browserHistory";

interface Context {
	auth?: boolean,
	usuarioLogado?: UsuarioMe,
	empresa?: EmpresaPublic,
	papel?: Papel,
	browserHistory: BrowserHistory,
}

export interface IRoute {
	path: string;
	element?: JSX.Element | ((context: Context) => JSX.Element) | React.LazyExoticComponent<() => JSX.Element>
	id: string;
	keys?: string[];
	auth?: boolean,
	usuarioLogado?: boolean;
	admin?: boolean;
	empresa?: boolean;
	papel?: boolean;
	permissao?: Permissoes;
	routes?: IRoute[];
}

export const indexRoute: IRoute = {
	path: '*',
	id: "1",
	routes: [
		{
			path: 'login',
			id: "-1",
			auth: false,
			element: <LoginPage />
		},
		{
			path: '*',
			id: "-2",
			auth: true,
			element: <DashBoardPage />,
			routes: [
				{
					path: '*',
					id: "2",
					usuarioLogado: true,
					routes: [
						{
							path: 'e/:empresaId',
							id: "3",
							keys: ['empresaId'],
							routes: [
								{
									path: '',
									id: "4",
									empresa: true,
									element: <ListaVendas />,
								},
								{
									path: 'vendas/:vendaId',
									id: "5",
									empresa: true,
									element: <EditarVenda />,
									keys: ['vendaId'],
								},
								{
									path: 'usuarios',
									id: "6",
									empresa: true,
									element: <DashboardContent titulo='Usuários' />,
									permissao: Permissoes.CADASTRAR_USUARIOS

								},
								{
									path: '*',
									id: "7",
									empresa: true,
									papel: true,
									element: <Navigate to='' />,

								},
								{
									path: '*',
									id: "8",
									papel: false,
									element: <Carregando />,
								}
							]
						},
						{
							path: 'admin',
							id: "9",
							admin: true,
							routes: [
								{
									path: '',
									id: "10",
									element: <DashboardContent titulo='Admin' />
								},
								{
									path: 'empresas',
									id: "11",
									element: <DashboardContent titulo='Empresas' />,
								},
								{
									path: '*',
									id: "12",
									element: <Navigate to='' />
								}
							]
						},
						{
							path: '*',
							id: "13",
							element: ({ usuarioLogado }: Context) => <Navigate to={`/e/${usuarioLogado?.empresaPrincipalId}`} />
						},
					]
				},
				{
					path: '*',
					id: "14",
					usuarioLogado: false,
					element: <Carregando />
				},
			]
		},
		{
			path: '*',
			id: "-4",
			auth: false,
			element: ({ browserHistory }: Context) => {
				const pathname = browserHistory.location.pathname;
				return <Navigate to={`/login${pathname !== '/' ? `?redirect=${pathname}` : ''}`} />
			},
		},
		{
			path: '*',
			id: "-3",
			element: <CustomBackdrop />
		},
	]
};

interface WrapperProps {
	keys?: string[];
}

const Wrapper = ({ keys, children }: PropsWithChildren<WrapperProps>) => {

	const params = useParams();
	const key = keys && keys.map(k => params?.[k]).join('/');

	return <React.Fragment key={key}>{children}</React.Fragment>
}

const renderRoute = (dashboardRoute: IRoute, context: Context) => {

	const { path, element, id, keys, auth, usuarioLogado, admin, empresa, papel, permissao, routes } = dashboardRoute;

	const shouldRender = (
		(auth == undefined || auth == context.auth)
		&& (usuarioLogado == undefined || usuarioLogado == !!context.usuarioLogado)
		&& (admin == undefined || admin == context?.usuarioLogado?.isAdmin)
		&& (empresa == undefined || empresa == !!context.empresa)
		&& (papel == undefined || papel == !!context.papel)
		&& (admin || permissao == undefined || context?.papel?.permissoes.includes(permissao))
	)

	if (shouldRender) {
		//console.log(dashboardRoute);

		return (<Route
			path={path}
			element={
				<Wrapper keys={keys}>
					{(typeof element === 'function'
						? element(context)
						: element)
						?? <Outlet />
					}
				</Wrapper>
			}
			id={id}
			key={id}
		>
			{routes && routes.map(route => renderRoute(route, context))}
		</Route>
		)
	}
}

const DashboardRouter = () => {

	const isAuth = useAuthStore(s => s.isAuth)
	const { data: usuarioLogado } = useUsuarioLogadoQuery();
	const empresa = useAppStore(s => s.empresa);
	const { data: papel } = usePapelAtualQuery();

	const routes = useMemo(() => {
		//console.log('---')
		return <Routes>
			{renderRoute(indexRoute, {
				usuarioLogado: usuarioLogado,
				empresa: empresa,
				papel: papel,
				auth: isAuth,
				browserHistory: browserHistory,
			})}
		</Routes>
	}, [isAuth, usuarioLogado, empresa, papel]);

	return <Suspense fallback={<Carregando />}>
		{routes}
	</Suspense>
}

export default DashboardRouter;