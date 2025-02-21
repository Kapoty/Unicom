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

const ListaBancosPage = lazy(() => import("../../../domains/banco/ListaBancosPage"));
const BancoFormPage = lazy(() => import("../../../domains/banco/BancoFormPage"));

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

const ListaProdutosPage = lazy(() => import("../../../domains/produto/ListaProdutosPage"));
const ProdutoFormPage = lazy(() => import("../../../domains/produto/ProdutoFormPage"));

const ListaAdicionaisPage = lazy(() => import("../../../domains/adicional/ListaAdicionaisPage"));
const AdicionalFormPage = lazy(() => import("../../../domains/adicional/AdicionalFormPage"));

const ListaPdvsPage = lazy(() => import("../../../domains/pdv/ListaPdvsPage"));
const PdvFormPage = lazy(() => import("../../../domains/pdv/PdvFormPage"));

const ListaOrigensPage = lazy(() => import("../../../domains/origem/ListaOrigensPage"));
const OrigemFormPage = lazy(() => import("../../../domains/origem/OrigemFormPage"));

const ListaSistemasPage = lazy(() => import("../../../domains/sistema/ListaSistemasPage"));
const SistemaFormPage = lazy(() => import("../../../domains/sistema/SistemaFormPage"));

const ListaVendaStatusPage = lazy(() => import("../../../domains/vendaStatus/ListaVendaStatusPage"));
const VendaStatusFormPage = lazy(() => import("../../../domains/vendaStatus/VendaStatusFormPage"));

const ListaCamposExtrasPage = lazy(() => import("../../../domains/campoExtra/ListaCamposExtrasPage"));
const CampoExtraFormPage = lazy(() => import("../../../domains/campoExtra/CampoExtraFormPage"));

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
									path: 'empresa/aparencia',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <EmpresaAparenciaFormPage/>,
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
									path: 'cadastros/produtos',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaProdutosPage/>,
								},
								{
									path: 'cadastros/produtos/:produtoId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ProdutoFormPage/>,
									keys: ['produtoId'],
								},
								{
									path: 'cadastros/adicionais',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaAdicionaisPage/>,
								},
								{
									path: 'cadastros/adicionais/:adicionalId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <AdicionalFormPage/>,
									keys: ['adicionalId'],
								},
								{
									path: 'cadastros/pdvs',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaPdvsPage/>,
								},
								{
									path: 'cadastros/pdvs/:pdvId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <PdvFormPage/>,
									keys: ['pdvId'],
								},
								{
									path: 'cadastros/origens',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaOrigensPage/>,
								},
								{
									path: 'cadastros/origens/:origemId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <OrigemFormPage/>,
									keys: ['origemId'],
								},
								{
									path: 'cadastros/sistemas',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaSistemasPage/>,
								},
								{
									path: 'cadastros/sistemas/:sistemaId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <SistemaFormPage/>,
									keys: ['sistemaId'],
								},
								{
									path: 'cadastros/venda-status',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaVendaStatusPage/>,
								},
								{
									path: 'cadastros/venda-status/:vendaStatusId',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <VendaStatusFormPage/>,
									keys: ['vendaStatusId'],
								},
								{
									path: 'cadastros/campos-extras',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <ListaCamposExtrasPage/>,
								},
								{
									path: 'cadastros/campos-extras/:campoExtraSlot',
									condicoes: {
										empresa: true,
										permissao: 'CONFIGURAR_EMPRESA'
									},
									element: <CampoExtraFormPage/>,
									keys: ['campoExtraSlot'],
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
									path: 'bancos',
									element: <ListaBancosPage/>,
								},
								{
									path: 'bancos/:bancoId',
									element: <BancoFormPage/>,
									keys: ['bancoId'],
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