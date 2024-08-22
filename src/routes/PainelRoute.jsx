import React, { Suspense, memo } from "react";
import ReactDOM from "react-dom";

import { Routes, Route} from "react-router-dom";

import Config from "../config/Config";

import api from "../services/api";
import {removeToken} from "../utils/auth"
import {isPontoAuth, getPontoToken} from "../utils/pontoAuth"

import Box from '@mui/material/Box';

import CustomAppBar from '../components/CustomAppBar'
import CustomNavigation from "../components/CustomNavigation"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const IframesModule = React.lazy(() => import('../modules/IframesModule'));
const UsuariosModule = React.lazy(() => import('../modules/UsuariosModule'));
const CreateEditUsuarioModule = React.lazy(() => import('../modules/CreateEditUsuarioModule'));
const MinhaEquipeModule = React.lazy(() => import('../modules/MinhaEquipeModule'));
const EquipesModule = React.lazy(() => import('../modules/EquipesModule'));
const CreateEditEquipeModule = React.lazy(() => import('../modules/CreateEditEquipeModule'));
const VendasModule = React.lazy(() => import('../modules/VendasModule'));
const CreateEditVendaModule = React.lazy(() => import('../modules/CreateEditVendaModule'));
const AutomacoesFaturasModule = React.lazy(() => import('../modules/AutomacoesFaturasModule'));

const RegistroPontoModule = React.lazy(() => import('../modules/RegistroPontoModule'));

import { useNavigate, useLocation, useSearchParams, useParams } from "react-router-dom";

import dayjs from 'dayjs';

const CreateEditVendaModuleWrapper = (props) => {
  const {vendaId} = useParams();

  return <CreateEditVendaModule key={vendaId} {...props}/>
};

const CreateEditEquipeModuleWrapper = () => {
  const {equipeId} = useParams();

  return <CreateEditEquipeModule key={equipeId} />
};

const CreateEditUsuarioModuleWrapper = () => {
  const {usuarioId} = useParams();

  return <CreateEditUsuarioModule key={usuarioId} />
};

const MinhaEquipeModuleWrapper = (props) => {
  const {equipeId} = useParams();

  return <MinhaEquipeModule key={equipeId} {...props} />
};

const ModuleRoutes = memo(function ModuleRoutes({ usuario, iframeCategoryList, location}) {
  //console.log("ModuleRoutes was rendered at", new Date().toLocaleTimeString());
  return (
  	<Suspense
  		fallback={<Backdrop sx={{color: "primary.main"}} open={true}>
		<CircularProgress color="inherit"/>
		</Backdrop>}
	>
		{usuario !== null && usuario.permissaoList.includes("VER_MODULO_IFRAME") ? <IframesModule iframeCategoryList={iframeCategoryList}/> : ""}
		<Routes>
			<Route path="/" element={<Box></Box>}/>
			{usuario !== null && usuario.permissaoList.includes("CADASTRAR_USUARIOS") ? <Route path="/usuarios/" element={<UsuariosModule usuario={usuario}/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("CADASTRAR_USUARIOS") ? <Route path="/usuarios/:usuarioId" element={<CreateEditUsuarioModuleWrapper/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("Ponto.Read.All") ? <Route path="/registro-ponto/" element={<RegistroPontoModule usuario={usuario}/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("VER_MODULO_MINHA_EQUIPE") ? <Route path="/minhas-equipes/:equipeId" element={<MinhaEquipeModuleWrapper usuario={usuario}/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("CADASTRAR_EQUIPES") ? <Route path="/equipes/" element={<EquipesModule usuario={usuario}/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("CADASTRAR_EQUIPES") ? <Route path="/equipes/:equipeId" element={<CreateEditEquipeModuleWrapper/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("CADASTRAR_VENDAS") ? <Route path="/vendas/" element={<VendasModule usuario={usuario}/>} /> : null}
			{usuario !== null && usuario.permissaoList.includes("CADASTRAR_VENDAS") ? <Route path="/vendas/:vendaId" element={<CreateEditVendaModuleWrapper usuario={usuario}/>} /> : null}
		</Routes>
	</Suspense>
	);
});

class PainelRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			usuario: null,

			iframeCategoryList: null,
			iframeCategoryByPath: null,
			iframeByPath: null,

			minhaEquipeList: null,

			fullscreen: false,

			notificationsGranted: undefined,

			menuOpen: false,
		};

		this.lastPing = null;
		this.pingIntervalSeconds = 10;
		

		this.getUsuarioFromApi = this.getUsuarioFromApi.bind(this);
		this.getIframeCategoryListFromApi = this.getIframeCategoryListFromApi.bind(this);
		this.getMinhaEquipeListFromApi = this.getMinhaEquipeListFromApi.bind(this);

		this.logout = this.logout.bind(this);

		this.toggleMenu = this.toggleMenu.bind(this);

		this.openIframeByLocation = this.openIframeByLocation.bind(this);
		this.toggleIframeCategory = this.toggleIframeCategory.bind(this);
		this.closeIframe = this.closeIframe.bind(this);

		this.toggleFullscreen = this.toggleFullscreen.bind(this);
		this.fullScreenChanged = this.fullScreenChanged.bind(this);

		this.getNotificationsStatus = this.getNotificationsStatus.bind(this);
		this.requestNotificationsPermission = this.requestNotificationsPermission.bind(this);

		this.loadUploadImageFromApi = this.loadUploadImageFromApi.bind(this);

		this.ping = this.ping.bind(this);
	}

	getUsuarioFromApi() {
		api.get("/usuario/me")
			.then((response) => {
				let usuario = response.data;

				this.setState({isAuth: true, usuario: usuario});
				
				if (usuario.permissaoList.includes("VER_MODULO_IFRAME"))
					this.getIframeCategoryListFromApi();
				if (usuario.permissaoList.includes("VER_MODULO_MINHA_EQUIPE"))
					this.getMinhaEquipeListFromApi();

				this.props.updateThemePrimaryColor("#" + usuario.empresa.themePrimaryColor);

				if (usuario.empresa?.iconFilename)
					this.loadUploadImageFromApi(usuario.empresa?.iconFilename, this.updateFavicon);
				
				document.title = "UniSystem - " + usuario.empresa.nome;
			})
			.catch((err) => {
				console.error(err);
				setTimeout(this.getUsuarioFromApi, 3000);
			});
	}

	getIframeCategoryListFromApi() {
		api.get("/usuario/me/iframe-category")
			.then((response) => {
				let iframeCategoryList = response.data;
				let iframeCategoryByPath = {}
				let iframeByPath = {};
				iframeCategoryList.forEach((iframeCategory, i) => {
						iframeCategory.open = false;
						iframeCategoryByPath[iframeCategory.uri] = iframeCategory;
						iframeByPath[iframeCategory.uri] = {}
						iframeCategory.iframeList.forEach((iframe, j) => {
							if (!iframe.novaGuia) {
								iframe.open = false;
								iframeByPath[iframeCategory.uri][iframe.uri] = iframeCategoryList[i].iframeList[j];
							}
						});
					});
				this.setState({iframeCategoryList: iframeCategoryList, iframeCategoryByPath: iframeCategoryByPath, iframeByPath: iframeByPath}, this.openIframeByLocation);
			})
			.catch((err) => {
				setTimeout(this.getIframeCategoryListFromApi, 3000);
			});
	}

	getMinhaEquipeListFromApi() {
		api.get("/usuario/me/minha-equipe")
			.then((response) => {
				this.setState({minhaEquipeList: response.data});
			})
			.catch((err) => {
				setTimeout(this.getMinhaEquipeListFromApi, 3000);
			});
	}

	logout() {
		removeToken();
		this.props.navigate("/login")
	}

	componentDidMount() {
		this.getUsuarioFromApi();
		document.body.onfullscreenchange = this.fullScreenChanged;
		//window.onbeforeunload = s => "";
		//this.disableDefaultContextMenu();
		this.getNotificationsStatus();
		document.body.addEventListener('click', this.ping, true); 
	}

	componentWillUnmount() {
		document.body.removeEventListener("click", this.ping, true);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location !== prevProps.location) {
			this.openIframeByLocation()
		}
	}

	openIframeByLocation() {
		let match = /^\/i\/(.+)\/(.+)$/.exec(this.props.location.pathname);
		if (match !== null && match.length == 3) {
			if (match[1] in this.state.iframeByPath && match[2] in this.state.iframeByPath[match[1]]) {
				this.state.iframeCategoryByPath[match[1]].open = true;
				this.state.iframeByPath[match[1]][match[2]].open = true;
				this.setState({iframeByPath: this.state.iframeByPath});
			} else this.props.navigate("/")
		}
	}

	toggleIframeCategory(iframeCategory) {
		iframeCategory.open = !iframeCategory.open;
		this.setState({ìframeCategoryList: this.state.iframeCategoryList});
	}

	closeIframe(iframe, redirect) {
		iframe.open = false;
		if (redirect)
			this.props.navigate("/");
		this.setState({iframeCategoryList: this.state.iframeCategoryList});
	}

	toggleMenu() {
		this.setState({menuOpen: !this.state.menuOpen})
	}

	disableDefaultContextMenu() {
		if (document.addEventListener) {
			document.addEventListener('contextmenu', function(e) {
				e.preventDefault();
			}, false);
		} else {
			document.attachEvent('oncontextmenu', function() {
				window.event.returnValue = false;
			});
		}
	}

	toggleFullscreen() {
		if(document.fullscreenElement){ 
			document.exitFullscreen() 
			this.setState({fullscreen: false});
		} else { 
			document.body.requestFullscreen({navigationUI: "hide"});
			this.setState({fullscreen: true});
		} 
		
	}

	fullScreenChanged() {
		this.setState({fullscreen: document.fullscreenElement ? true : false});
	}

	getNotificationsStatus() {
		if (!("Notification" in window)) {
			this.setState({notificationsGranted: null})
 		} else if (Notification.permission === "granted") {
 			this.setState({notificationsGranted: true})
			/*let title = 'Hi!';
			let options = {
				body: 'Very Important Message',
			};

			navigator.serviceWorker.ready.then(function(registration) {
				registration.showNotification(title, options);
			});*/
			
 		} else if (Notification.permission !== "denied") {
 			this.setState({notificationsGranted: false})
			//this.requestNotificationsPermission();
		} else {
			this.setState({notificationsGranted: false});
		}
	}

	requestNotificationsPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				this.setState({notificationsGranted: true})
			} else {
				this.setState({notificationsGranted: false});
			}
		});
	}

	ping() {
		if (!isPontoAuth())
			return;
		if (this.state.usuario !== null) {
			let now = dayjs();
			if (this.lastPing == null || now.diff(this.lastPing, 'second') >= this.pingIntervalSeconds) {
				this.lastPing = now;
				api.post("/usuario/me/ping", {
					token: getPontoToken()
				})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	}

	loadUploadImageFromApi(filename, callback) {
		api.get("/empresa/me/upload/" + filename, {responseType: "blob"})
		.then((response) => {
			let blob = response.data;
			let reader = new FileReader();
			reader.onload = () => {
				const base64data = reader.result;
				callback(base64data);
			}
			reader.readAsDataURL(blob);
		})
		.catch((err) => {
			console.error(err);
		});
	}

	updateFavicon(href) {
		document.querySelector("link[rel~='icon']").href = href;
	}

	render() {

		//console.log("PainelRoute was rendered at", new Date().toLocaleTimeString());

		if (!this.state.isAuth)
			return <Backdrop sx={{color: "primary.main"}} open={true}>
						<CircularProgress color="inherit"/>
					</Backdrop>

		return <React.Fragment>
		<Box className="painelBox" sx={{height: "100dvh"}}>
			<CustomAppBar usuario={this.state.usuario} usuarioFotoPerfil={this.state.usuarioFotoPerfil} toggleMenu={this.toggleMenu} logout={this.logout} fullscreen={this.state.fullscreen} toggleFullscreen={this.toggleFullscreen} notificationsGranted={this.state.notificationsGranted} requestNotificationsPermission={this.requestNotificationsPermission}/>
			<Box sx={{display: "flex", flexGrow: 1, flexDirection: "row", overflow: "hidden"}}>
				<CustomNavigation menuOpen={this.state.menuOpen} toggleMenu={this.toggleMenu} usuario={this.state.usuario} iframeCategoryList={this.state.iframeCategoryList} minhaEquipeList={this.state.minhaEquipeList} toggleIframeCategory={this.toggleIframeCategory} closeIframe={this.closeIframe}/>
				<Box sx={{flexGrow: 1, height: "100%", overflow: "auto"}}>
					{this.state.usuario !== null && this.state.usuario.permissaoList.includes("VER_MODULO_IFRAME") ? <IframesModule iframeCategoryList={this.state.iframeCategoryList}/> : ""}
					{/*this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_VENDAS") ? <VendasModule usuario={this.state.usuario}/> : null*/}
					{<Suspense fallback={<Backdrop sx={{color: "primary.main"}} open={true}>
											<CircularProgress color="inherit"/>
										</Backdrop>}>
							<Routes>
								<Route path="/" element={<Box></Box>}/>
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_USUARIOS") ? <Route path="/usuarios/" element={<UsuariosModule usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_USUARIOS") ? <Route path="/usuarios/:usuarioId" element={<CreateEditUsuarioModuleWrapper/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("Ponto.Read.All") ? <Route path="/registro-ponto/" element={<RegistroPontoModule usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("VER_MODULO_MINHA_EQUIPE") ? <Route path="/minhas-equipes/:equipeId" element={<MinhaEquipeModuleWrapper usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_EQUIPES") ? <Route path="/equipes/" element={<EquipesModule usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_EQUIPES") ? <Route path="/equipes/:equipeId" element={<CreateEditEquipeModuleWrapper/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_VENDAS") ? <Route path="/vendas/" element={<VendasModule usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("CADASTRAR_VENDAS") ? <Route path="/vendas/:vendaId" element={<CreateEditVendaModuleWrapper usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("AUTOMACOES") ? <Route path="/automacoes/faturas" element={<AutomacoesFaturasModule usuario={this.state.usuario}/>} /> : null}
							</Routes>
					</Suspense>}
					{/*<ModuleRoutes usuario={this.state.usuario} iframeCategoryList={this.state.iframeCategoryList} location={this.props.location} />*/}
				</Box>
			</Box>
		</Box>
		</React.Fragment>
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	return <PainelRoute navigate={navigate} location={location} searchParams={searchParams} {...props}/>
}