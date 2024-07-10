import React, { Suspense, memo } from "react";
import ReactDOM from "react-dom";

import { Routes, Route} from "react-router-dom";

import api from "../services/api";
import {setToken} from "../utils/auth"
import {isPontoAuth, getPontoToken, setPontoToken} from "../utils/pontoAuth"

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Collapse from '@mui/material/Collapse';

import { useNavigate, useLocation, useSearchParams, useParams } from "react-router-dom";

import dayjs from 'dayjs';

import JornadaChip from '../components/JornadaChip';

class JornadaRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			usuario: null,
			open: true,

			notificationsGranted: undefined,

			n: 0,
		};

		this.lastPing = null;
		this.pingIntervalSeconds = 10;
		

		this.getUsuarioFromApi = this.getUsuarioFromApi.bind(this);

		this.logout = this.logout.bind(this);

		this.getNotificationsStatus = this.getNotificationsStatus.bind(this);
		this.requestNotificationsPermission = this.requestNotificationsPermission.bind(this);
		this.getTokensFromSearchParams = this.getTokensFromSearchParams.bind(this);

		this.handleOpen = this.handleOpen.bind(this);

		this.ping = this.ping.bind(this);
	}

	getUsuarioFromApi() {
		api.get("/usuario/me", {redirect401: false})
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
		this.setState({isAuth: false});
	}

	componentDidMount() {
		this.getTokensFromSearchParams();
		this.getUsuarioFromApi();
		this.getNotificationsStatus();
		document.body.addEventListener('mousemove', this.ping, true);
		window?.electron?.onMouseMove?.(this.ping);

		document.body.style.backgroundColor = "transparent";
		document.body.height = "50px";
	}

	componentWillUnmount() {
		document.body.removeEventListener("mousemove", this.ping, true);
	}

	getTokensFromSearchParams() {
		setToken(this.props.searchParams.get("token"));
		setPontoToken(this.props.searchParams.get("ponto-token"));
	}

	getNotificationsStatus() {
		if (!("Notification" in window)) {
			this.setState({notificationsGranted: null})
 		} else if (Notification.permission === "granted") {
 			this.setState({notificationsGranted: true})
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

	handleOpen() {
		this.setState({open: !this.state.open});
	}

	ping() {
		this.setState({n: this.state.n + 1});
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

		return <Stack
				direction="row"
				justifyContent="end"
			>
			<Box
				onMouseOver={() => window?.electron?.setIgnoreMouseEvents?.(false)}
				onMouseOut={() => window?.electron?.setIgnoreMouseEvents?.(true, { forward: true })}
				sx={{position: "relative", mr: "200px"}}
			>
				
				{!this.state.isAuth ? <Box sx={{width: 200, backgroundColor: "rgba(0,0,0,0.5)"}}>
					<Stack gap={2} alignItems="center">
						<CircularProgress color="inherit"/>
						<Typography textAlign="center">Aguardando identificação do usuário!</Typography>
					</Stack>
				</Box> :
				<Paper
					sx={{padding: 0}}
				>
					<Stack
						gap={1}
						direction="row"
						alignItems="center"
					>
						{/*this.state.n*/}
						<Tooltip title={this.state.open ? "Ocultar" : "Exibir"}>
							<IconButton size="small" onClick={this.handleOpen}>
								{this.state.open ? <ArrowRightIcon onClick={this.handleOpen}/> : <ArrowLeftIcon onClick={this.handleOpen}/>}
							</IconButton>
						</Tooltip>
						<Collapse in={this.state.open} orientation="horizontal">
							<Stack
								gap={1}
								direction="row"
								alignItems="center"
							>
								<JornadaChip usuario={this.state.usuario} me/>
								<Tooltip title="Fechar">
									<IconButton size="small" onClick={() => window?.electron?.quit?.()}>
										<CloseIcon/>
									</IconButton>
								</Tooltip>
								{/*<DragIndicatorIcon
									sx={{"-webkit-app-region": "drag"}}
								/>*/}
							</Stack>
						</Collapse>
					</Stack>
				</Paper>}
			</Box>
		</Stack>
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	return <JornadaRoute navigate={navigate} location={location} searchParams={searchParams} {...props}/>
}