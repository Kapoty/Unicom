import React, { PropsWithChildren, Suspense, useMemo } from "react";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { IEmpresaPublic } from "../../models/Empresa";
import { Permissao, PermissaoSchema } from "../../models/enums";
import { Papel } from "../../models/Papel";
import Carregando from "../../pages/Dashboard/Carregando";
import EditarVenda from "../../pages/Dashboard/Empresa/EditarVenda";
import ListaVendas from "../../pages/Dashboard/Empresa/ListaVendas";
import DashBoardPage from "../../pages/DashboardPage";
import LoginPage from "../../pages/LoginPage";
import { usePapelAtualQuery } from "../../queries/usePapelQueries";
import { useUsuarioLogadoQuery } from "../../queries/useUsuarioQueries";
import useAppStore from "../../state/useAppStore";
import useAuthStore from "../../state/useAuthStore";
import { IUsuarioMe } from "../../models/Usuario";
import browserHistory from "../../utils/browserHistory";
import CustomBackdrop from "../Backdrop/CustomBackdrop";
import DashboardContent from "../Dashboard/DashboardContent";
import ListaEmpresas from "../../pages/Dashboard/Admin/ListaEmpresas";
import EditarEmpresa from "../../pages/Dashboard/Admin/EditarEmpresa";

export interface Context {
	auth?: boolean,
	usuarioLogado?: IUsuarioMe,
	empresa?: IEmpresaPublic,
	papel?: Papel,
}

export interface IRoute {
	path: string;
	element?: JSX.Element | ((context: Context) => JSX.Element) | React.LazyExoticComponent<() => JSX.Element>
	id?: string;
	keys?: string[];
	condicoes?: {
		auth?: boolean,
		usuarioLogado?: boolean;
		admin?: boolean;
		empresa?: boolean;
		papel?: boolean;
		permissao?: Permissao;
	},
	routes?: IRoute[];
}

const indexRouteWithoutIds: IRoute = {
	path: '*',
	routes: [
		{
			path: 'login',
			condicoes: {
				auth: false,
			},
			element: <LoginPage />
		},
		{
			path: '*',
			condicoes: {
				auth: true,
			},
			element: <DashBoardPage />,
			routes: [
				{
					path: '*',
					condicoes: {
						usuarioLogado: true,
					},
					routes: [
						{
							path: 'e/:empresaId',
							keys: ['empresaId'],
							routes: [
								{
									path: '',
									condicoes: {
										empresa: true,
									},
									element: <DashboardContent titulo="Início"/>,
								},
								{
									path: 'vendas',
									condicoes: {
										empresa: true,
									},
									element: <ListaVendas />,
								},
								{
									path: 'vendas/:vendaId',
									condicoes: {
										empresa: true,
									},
									element: <EditarVenda />,
									keys: ['vendaId'],
								},
								{
									path: 'usuarios',
									condicoes: {
										empresa: true,
										permissao: PermissaoSchema.enum.CADASTRAR_USUARIOS
									},
									element: <DashboardContent titulo='Usuários' />,

								},
								{
									path: '*',
									condicoes: {
										empresa: true,
										papel: true,
									},
									element: <Navigate to='' />,

								},
								{
									path: '*',
									condicoes: {
										papel: false,
									},
									element: <Carregando />,
								}
							]
						},
						{
							path: 'admin',
							condicoes: {
								admin: true,
							},
							routes: [
								{
									path: '',
									element: <DashboardContent titulo='Admin' />
								},
								{
									path: 'empresas',
									element: <ListaEmpresas/>,
								},
								{
									path: 'empresas/:empresaId',
									element: <EditarEmpresa/>,
									keys: ['empresaId'],
								},
								{
									path: '*',
									element: <Navigate to='' />
								}
							]
						},
						{
							path: '*',
							element: ({ usuarioLogado }: Context) => <Navigate to={`/e/${usuarioLogado?.empresaPrincipalId}`} />
						},
					]
				},
				{
					path: '*',
					condicoes: {
						usuarioLogado: false,
					},
					element: <Carregando />
				},
			]
		},
		{
			path: '*',
			condicoes: {
				auth: false,
			},
			element: () => {
				const pathname = browserHistory.location.pathname;
				return <Navigate to={`/login${pathname !== '/' ? `?redirect=${pathname}` : ''}`} />
			},
		},
		{
			path: '*',
			element: <CustomBackdrop />
		},
	]
};

const setIds = (route: IRoute, currentId = 1) => {

	const {id, routes} = route;

	route.id = currentId.toString();
	currentId++;

	routes?.forEach(r => currentId = setIds(r, currentId));

	return currentId;
}

setIds(indexRouteWithoutIds);

export const indexRoute = indexRouteWithoutIds;

interface WrapperProps {
	keys?: string[];
}

const Wrapper = ({ keys, children }: PropsWithChildren<WrapperProps>) => {

	const params = useParams();
	const key = keys && keys.map(k => params?.[k]).join('/');

	return <React.Fragment key={key}>{children}</React.Fragment>
}

const renderRoute = (dashboardRoute: IRoute, context: Context) => {

	const { path, element, id, keys, condicoes, routes } = dashboardRoute;

	const { auth, usuarioLogado, admin, empresa, papel, permissao } = condicoes ?? {};

	const shouldRender = (
		(auth == undefined || auth == context.auth)
		&& (usuarioLogado == undefined || usuarioLogado == !!context.usuarioLogado)
		&& (admin == undefined || admin == context?.usuarioLogado?.isAdmin)
		&& (empresa == undefined || empresa == !!context.empresa)
		&& (papel == undefined || papel == !!context.papel)
		&& (admin || permissao == undefined || context?.papel?.contemPermissao(permissao))
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
			{routes?.map(route => renderRoute(route, context))}
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
			{renderRoute(indexRouteWithoutIds, {
				usuarioLogado: usuarioLogado,
				empresa: empresa,
				papel: papel,
				auth: isAuth
			})}
		</Routes>
	}, [isAuth, usuarioLogado, empresa, papel]);

	return <Suspense fallback={<Carregando />}>
			{routes}
	</Suspense>
}

export default DashboardRouter;