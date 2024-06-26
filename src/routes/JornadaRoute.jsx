import React, { Suspense, memo } from "react";
import ReactDOM from "react-dom";

import { Routes, Route} from "react-router-dom";

import {isAuth as isPontoAuth, getToken as getPontoToken} from "../utils/pontoAuth"

import api from "../services/api";
import {removeToken} from "../utils/auth"

import Box from '@mui/material/Box';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useNavigate, useLocation, useSearchParams, useParams } from "react-router-dom";

import dayjs from 'dayjs';

import JornadaChip from '../components/JornadaChip';

class JornadaRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			usuario: null,

			notificationsGranted: undefined,
		};

		this.lastPing = null;
		this.pingIntervalSeconds = 10;
		

		this.getUsuarioFromApi = this.getUsuarioFromApi.bind(this);

		this.logout = this.logout.bind(this);

		this.getNotificationsStatus = this.getNotificationsStatus.bind(this);
		this.requestNotificationsPermission = this.requestNotificationsPermission.bind(this);

		this.ping = this.ping.bind(this);
	}

	getUsuarioFromApi() {
		api.get("/usuario/me", {redirect401Path: "/login?jornada=true"})
			.then((response) => {
				let usuario = response.data;

				this.setState({isAuth: true, usuario: usuario});

				this.props.updateThemePrimaryColor("#" + usuario.empresa.themePrimaryColor);
				
				document.title = "UniSystem - " + usuario.empresa.nome;
			})
			.catch((err) => {
				console.error(err);
				setTimeout(this.getUsuarioFromApi, 3000);
			});
	}

	logout() {
		removeToken();
		this.props.navigate("/login?jornada=true")
	}

	componentDidMount() {
		this.getUsuarioFromApi();
		document.body.onfullscreenchange = this.fullScreenChanged;
		//window.onbeforeunload = s => "";
		//this.disableDefaultContextMenu();
		this.getNotificationsStatus();
		document.body.addEventListener('click', this.ping, true);



		document.body.style.backgroundColor = "transparent";
		document.body.height = "50px";
	}

	componentWillUnmount() {
		document.body.removeEventListener("click", this.ping, true);
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

	render() {

		if (!this.state.isAuth)
			return <Backdrop sx={{color: "primary.main"}} open={true}>
						<CircularProgress color="inherit"/>
					</Backdrop>

		return <React.Fragment>
			<Box sx={{backgroundColor: "black", width: "auto"}}>
				<JornadaChip usuario={this.state.usuario} me/>
			</Box>
		</React.Fragment>
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	return <JornadaRoute navigate={navigate} location={location} searchParams={searchParams} {...props}/>
}