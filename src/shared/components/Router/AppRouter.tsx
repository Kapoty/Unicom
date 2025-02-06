import React, { lazy, PropsWithChildren, Suspense, useMemo } from "react";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import useAuthStore from "../../../domains/auth/useAuthStore";
import { IEmpresaPublic } from "../../../domains/empresa/Empresa";
import { Papel, Permissao } from "../../../domains/papel/Papel";
import { usePapelAtualQuery } from "../../../domains/papel/PapelQueries";
import { IUsuarioMe } from "../../../domains/usuario/Usuario";
import { useUsuarioLogadoQuery } from "../../../domains/usuario/UsuarioQueries";
import browserHistory from "../../utils/browserHistory";
import CustomBackdrop from "../Backdrop/CustomBackdrop";

import useAppStore from "../../state/useAppStore";
import Carregando from "../Feedback/Carregando";

const LoginPage = lazy(() => import("../../../pages/LoginPage"));
const DashBoardPage = lazy(() => import("../../../pages/DashboardPage"));
const DashboardContent = lazy(() => import("../Dashboard/DashboardContent"));

/* Admin */
const ListaEmpresasPage = lazy(() => import("../../../domains/empresa/ListaEmpresasPage"));
const EmpresaFormPage = lazy(() => import("../../../domains/empresa/EmpresaFormPage"));

const ListaGruposPage = lazy(() => import("../../../domains/grupo/ListaGruposPage"));
const GrupoFormPage = lazy(() => import("../../../domains/grupo/GrupoFormPage"));

const ListaDominiosPage = lazy(() => import("../../../domains/dominio/ListaDominiosPage"));
const DominioFormPage = lazy(() => import("../../../domains/dominio/DominioFormPage"));

/* Empresa */
const HomePage = lazy(() => import('../../../pages/Dashboard/HomePage'));

const VendaFormPage = lazy(() => import('../../../domains/venda/VendaFormPage'));
const ListaVendasPage = lazy(() => import('../../../domains/venda/ListaVendasPage'));

const ListaRelatoriosPage = lazy(() => import("../../../domains/relatorio/ListaRelatoriosPage"));
const RelatorioFormPage = lazy(() => import("../../../domains/relatorio/RelatorioFormPage"));

const ListaUsuariosPage = lazy(() => import("../../../domains/usuario/ListaUsuariosPage"));
const UsuarioFormPage = lazy(() => import("../../../domains/usuario/UsuarioFormPage"));

const ListaPerfisPage = lazy(() => import("../../../domains/perfil/ListaPerfisPage"));
const PerfilFormPage = lazy(() => import("../../../domains/perfil/PerfilFormPage"));

const UsuarioMeFormPage = lazy(() => import("../../../domains/usuario/UsuarioMeFormPage"));

const EmpresaAparenciaFormPage = lazy(() => import("../../../domains/empresa/EmpresaAparenciaFormPage"));

const ListaEquipesPage = lazy(() => import("../../../domains/equipe/ListaEquipesPage"));
const EquipeFormPage = lazy(() => import("../../../domains/equipe/EquipeFormPage"));
const EquipePage = lazy(() => import("../../../domains/equipe/EquipePage"));

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
									element: <HomePage/>,
								},
								{
									path: 'vendas',
									condicoes: {
										empresa: true,
									},
									element: <ListaVendasPage />,
								},
								{
									path: 'vendas/:vendaId',
									condicoes: {
										empresa: true,
									},
									element: <VendaFormPage />,
									keys: ['vendaId'],
								},
								{
									path: 'usuarios',
									condicoes: {
										empresa: true,
										permissao: 'CADASTRAR_USUARIOS'
									},
									element: <ListaUsuariosPage/>,
								},
								{
									path: 'usuarios/me',
									condicoes: {
										empresa: true,
									},
									element: <UsuarioMeFormPage/>,
								},
								{
									path: 'usuarios/:usuarioId',
									condicoes: {
										empresa: true,
										permissao: 'CADASTRAR_USUARIOS'
									},
									element: <UsuarioFormPage/>,
									keys: ['usuarioId'],
								},
								{
									path: 'perfis',
									condicoes: {
										empresa: true,
										permissao: 'CADASTRAR_USUARIOS'
									},
									element: <ListaPerfisPage/>,
								},
								{
									path: 'perfis/:perfilId',
									condicoes: {
										empresa: true,
										permissao: 'CADASTRAR_USUARIOS'
									},
									element: <PerfilFormPage/>,
									keys: ['perfilId'],
								},
								{
									path: 'relatorios/:uri',
									condicoes: {
										empresa: true,
									},
								},
								{
									path: 'cadastros/relatorios',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaRelatoriosPage/>,
								},
								{
									path: 'cadastros/relatorios/:relatorioId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <RelatorioFormPage/>,
									keys: ['relatorioId'],
								},
								{
									path: 'equipes/:equipeId',
									condicoes: {
										empresa: true
									},
									element: <EquipePage/>,
									keys: ['equipeId'],
								},
								{
									path: 'cadastros/equipes',
									condicoes: {
										empresa: true,
										permissao: 'CADASTRAR_EQUIPES'
									},
									element: <ListaEquipesPage/>,
								},
								{
									path: 'cadastros/equipes/:equipeId',
									condicoes: {
										empresa: true,
										permissao: 'CADASTRAR_EQUIPES'
									},
									element: <EquipeFormPage/>,
									keys: ['equipeId'],
								},
								{
									path: 'empresa/aparencia',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <EmpresaAparenciaFormPage/>,
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
									element: <HomePage/>
								},
								{
									path: 'empresas',
									element: <ListaEmpresasPage/>,
								},
								{
									path: 'empresas/:empresaId',
									element: <EmpresaFormPage/>,
									keys: ['empresaId'],
								},
								{
									path: 'grupos',
									element: <ListaGruposPage/>,
								},
								{
									path: 'grupos/:grupoId',
									element: <GrupoFormPage/>,
									keys: ['grupoId'],
								},
								{
									path: 'dominios',
									element: <ListaDominiosPage/>,
								},
								{
									path: 'dominios/:dominioId',
									element: <DominioFormPage/>,
									keys: ['dominioId'],
								},
								{
									path: '*',
									element: <Navigate to='' />
								}
							]
						},
						{
							path: '*',
							element: ({ usuarioLogado }: Context) => <Navigate to={`/e/${usuarioLogado?.empresaPrincipalId}`} />,
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
		&& (context?.usuarioLogado?.isAdmin || permissao == undefined || context?.papel?.contemPermissao(permissao))
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

const AppRouter = () => {

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

	return <Suspense fallback={<CustomBackdrop />}>
		{routes}
	</Suspense>
}

export default AppRouter;