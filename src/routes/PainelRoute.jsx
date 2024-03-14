import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import { Routes, Route} from "react-router-dom";

import Config from "../config/Config";

import api from "../services/api";
import {removeToken} from "../utils/auth"

import Box from '@mui/material/Box';

import CustomAppBar from '../components/CustomAppBar'
import CustomNavigation from "../components/CustomNavigation"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const IframesModule = React.lazy(() => import('../modules/IframesModule'));
const UsuariosModule = React.lazy(() => import('../modules/UsuariosModule'));
const CreateEditUsuarioModule = React.lazy(() => import('../modules/CreateEditUsuarioModule'));

const RegistroPontoModule = React.lazy(() => import('../modules/RegistroPontoModule'));

import { useNavigate, useLocation, useSearchParams, useParams } from "react-router-dom";

const CreateEditUsuarioModuleWrapper = () => {
  const {usuarioId} = useParams();

  return <CreateEditUsuarioModule key={usuarioId} />
};

class PainelRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuario: null,

			iframeCategoryList: null,
			iframeCategoryByPath: null,
			iframeByPath: null,

			fullscreen: false,

			menuOpen: true,
		};

		this.getUsuarioFromApi = this.getUsuarioFromApi.bind(this);
		this.getIframeCategoryListFromApi = this.getIframeCategoryListFromApi.bind(this);

		this.logout = this.logout.bind(this);

		this.toggleMenu = this.toggleMenu.bind(this);

		this.openIframeByLocation = this.openIframeByLocation.bind(this);
		this.toggleIframeCategory = this.toggleIframeCategory.bind(this);
		this.closeIframe = this.closeIframe.bind(this);

		this.toggleFullscreen = this.toggleFullscreen.bind(this);
		this.fullScreenChanged = this.fullScreenChanged.bind(this);

	}

	getUsuarioFromApi() {
		api.get("/usuario/me")
			.then((response) => {
				this.setState({usuario: response.data});
				if (response.data.permissaoList.includes("Iframe.Read.All"))
					this.getIframeCategoryListFromApi();
			})
			.catch((err) => {
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

	logout() {
		removeToken();
		this.props.navigate("/login")
	}

	componentDidMount() {
		this.getUsuarioFromApi();
		document.body.onfullscreenchange = this.fullScreenChanged;
		//window.onbeforeunload = s => "";
		//this.disableDefaultContextMenu();
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

	render() {
	
		return <React.Fragment>
		<Box className="painelBox">
			<CustomAppBar usuario={this.state.usuario} usuarioFotoPerfil={this.state.usuarioFotoPerfil} toggleMenu={this.toggleMenu} logout={this.logout} fullscreen={this.state.fullscreen} toggleFullscreen={this.toggleFullscreen}/>
			<Box sx={{display: "flex", flexGrow: 1, flexDirection: "row", height: "100dvh", overflow: "hidden"}}>
				<CustomNavigation menuOpen={this.state.menuOpen} toggleMenu={this.toggleMenu} usuario={this.state.usuario} iframeCategoryList={this.state.iframeCategoryList} toggleIframeCategory={this.toggleIframeCategory} closeIframe={this.closeIframe}/>
				<Box sx={{flexGrow: 1, height: "100%", overflow: "auto"}}>
					<Suspense fallback={<Backdrop sx={{color: "primary.main"}} open={true}>
											<CircularProgress color="inherit"/>
										</Backdrop>}>
						{this.state.usuario !== null && this.state.usuario.permissaoList.includes("Iframe.Read.All") ? <IframesModule iframeCategoryList={this.state.iframeCategoryList}/> : ""}
							<Routes>
								<Route path="/" element={<Box></Box>}/>
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("Usuario.Read.All") ? <Route path="/usuarios/" element={<UsuariosModule usuario={this.state.usuario}/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("Usuario.Read.All") ? <Route path="/usuarios/:usuarioId" element={<CreateEditUsuarioModuleWrapper/>} /> : null}
								{this.state.usuario !== null && this.state.usuario.permissaoList.includes("Ponto.Read.All") ? <Route path="/registro-ponto/" element={<RegistroPontoModule/>} /> : null}
							</Routes>
					</Suspense>
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