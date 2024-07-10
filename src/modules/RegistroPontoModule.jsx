import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { green, yellow, blue, red } from '@mui/material/colors';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Tooltip from '@mui/material/Tooltip';
import ScheduleIcon from '@mui/icons-material/Schedule';

import {isPontoAuth, getPontoToken, setPontoToken, removePontoToken} from "../utils/pontoAuth"

import api from "../services/api";

import { useParams, useLocation } from 'react-router-dom';

class RegistroPontoModule extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isPontoAuth: isPontoAuth(),

			registroPonto: null,

			naoRegistraReason: null,
			lockedSeconds: null,
			color: "primary",

			calling: false,
			logging: false,
			authenticating: false,

			alertOpen: false,
			alert: null
		}

		this.getUsuarioRegistroPontoFromApi = this.getUsuarioRegistroPontoFromApi.bind(this);
		this.registrarPonto = this.registrarPonto.bind(this);
		this.getLockedSecondsFromApi = this.getLockedSecondsFromApi.bind(this);
		this.handleAuthenticate = this.handleAuthenticate.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.validateToken = this.validateToken.bind(this);

		this.minusOneSecond = this.minusOneSecond.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getUsuarioRegistroPontoFromApi();
		if (this.state.isPontoAuth)
			this.validateToken();
	}

	getUsuarioRegistroPontoFromApi() {
		this.setState({calling: true, naoRegistraReason: null, lockedSeconds: null});
		api.get("/registro-ponto/me/hoje")
			.then((response) => {
				let registroPonto = response.data;
				let naoRegistraReason = null;
				let color = "primary";
				if (registroPonto.entrada == null)
					color = "success"
				else if (registroPonto.intervaloInicio == null)
					color = "warning"
				else if (registroPonto.intervaloFim == null)
					color = "info"
				else if (registroPonto.saida == null)
					color = "error"
				else
					naoRegistraReason = "Dia registrado com sucesso!"

				this.setState({
					registroPonto: registroPonto,
					color: color,
					naoRegistraReason: naoRegistraReason,
					calling: false
				});
				this.getLockedSecondsFromApi();
			})
			.catch((err) => {
				let errors = {};
				let naoRegistraReason = null;
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					if ("contrato" in errors)
						naoRegistraReason = "Usuário sem contrato cadastrado!"
					else if ("jornada" in errors)
						naoRegistraReason = "Usuário sem jornada cadastrada!"
					else if ("hoje" in errors)
						naoRegistraReason = "Usuário não registra ponto hoje!"
					else
						naoRegistraReason = "Falha inesperada!"
				}
				else {
					naoRegistraReason = "O servidor não respondeu a solicitação!"
					setTimeout(this.getUsuarioRegistroPontoFromApi, 3000);
				}
				this.setState({calling: false, naoRegistraReason: naoRegistraReason});
			});
	}

	registrarPonto() {
		this.setState({calling: true, logging: true})
		api.post("/registro-ponto/me/hoje/registrar", {
				token: getPontoToken(),
			})
			.then((response) => {
				this.setState({
					calling: false,
					logging: false
				});
				this.openAlert("success", "Ponto registrado com sucesso!");
				this.getUsuarioRegistroPontoFromApi();
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					if ("full" in errors)
						this.openAlert("error", "Todos os pontos já foram batidos hoje!");
					else if ("locked" in errors)
						this.openAlert("error", "Por favor, aguarde os segundos restantes...");
					else
						if ("token" in errors)
							this.openAlert("error", "Dispositivo não autorizado!");
					else
						this.openAlert("error", "Erro inesperado!");
				} else 
					this.openAlert("error", "Falha ao registrar ponto!");
				this.setState({calling: false, logging: false});
				this.getUsuarioRegistroPontoFromApi();
			});
	}

	getLockedSecondsFromApi() {
		this.setState({lockedSeconds: null});
		api.get("/registro-ponto/me/hoje/locked-seconds")
			.then((response) => {
				this.setState({
					lockedSeconds: response.data.lockedSeconds
				}, () => setTimeout(this.minusOneSecond, 1000));
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getLockedSecondsFromApi, 3000);
			});
	}

	minusOneSecond() {
		let lockedSeconds = this.state.lockedSeconds;
		if (lockedSeconds > 0) {
			lockedSeconds -= 1;
			if (lockedSeconds !== 0)
				setTimeout(this.minusOneSecond, 1000);
			this.setState({lockedSeconds: lockedSeconds})
		}
		
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	handleAuthenticate() {
		if (this.state.isPontoAuth) {
			this.openAlert("success", "Dispositivo desautorizado com sucesso!");
			removeToken();
			this.setState({isPontoAuth: false});
		} else
			this.authenticate();
	}

	authenticate() {
		this.setState({authenticating: true});
		api.get("/registro-ponto/generate-token")
			.then((response) => {
				this.openAlert("success", "Dispositivo autorizado com sucesso!");
				setPontoToken(response.data.token);
				this.setState({authenticating: false, isPontoAuth: true})
			})
			.catch((err) => {
				console.log(err);
				this.openAlert("error", "Falha ao autorizar dispositivo!");
				this.setState({authenticating: false})
			});
	}

	validateToken() {
		api.post("/registro-ponto/validate-token", {
			token: getPontoToken()
			})
			.then((response) => {
				this.setState({isPontoAuth: true});
			})
			.catch((err) => {
				this.openAlert("error", "Autorização do dispositivo expirou!");
				removeToken();
				this.setState({isPontoAuth: false});
			});
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "900px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Box sx={{ flexGrow: 1 }}>
						<Grid container spacing={3} sx={{margin: 0}}>
							<Grid item xs={3}>
								<Stack alignItems="center">
									<Tooltip title="Horário do Registro"><Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom color={green[400]}>{this.state.registroPonto !== null && this.state.registroPonto.entrada !== null ? this.state.registroPonto.entrada : "-"}</Typography></Tooltip>
									<Typography variant="h6">Entrada</Typography>
									<Tooltip title="Jornada Padrão"><Typography variant="h6" color={green[700]}>{this.state.registroPonto !== null ? this.state.registroPonto.jornadaEntrada : "-"}</Typography></Tooltip>
								</Stack>
							</Grid>
							<Grid item xs={3}>
								<Stack alignItems="center">
									<Tooltip title="Horário do Registro"><Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom color={yellow[400]}>{this.state.registroPonto !== null && this.state.registroPonto.intervaloInicio !== null ? this.state.registroPonto.intervaloInicio : "-"}</Typography></Tooltip>
									<Typography variant="h6">Início do Intervalo</Typography>
									<Tooltip title="Jornada Padrão"><Typography variant="h6" color={yellow[700]}>{this.state.registroPonto !== null ? this.state.registroPonto.jornadaIntervaloInicio : "-"}</Typography></Tooltip>
								</Stack>
							</Grid>
							<Grid item xs={3}>
								<Stack alignItems="center">
									<Tooltip title="Horário do Registro"><Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom color={blue[400]}>{this.state.registroPonto !== null && this.state.registroPonto.intervaloFim !== null ? this.state.registroPonto.intervaloFim : "-"}</Typography></Tooltip>
									<Typography variant="h6">Fim do Intervalo</Typography>
									<Tooltip title="Jornada Padrão"><Typography variant="h6" color={blue[700]}>{this.state.registroPonto !== null ? this.state.registroPonto.jornadaIntervaloFim : "-"}</Typography></Tooltip>
								</Stack>
							</Grid>
							<Grid item xs={3}>
								<Stack alignItems="center">
									<Tooltip title="Horário do Registro"><Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom color={red[400]}>{this.state.registroPonto !== null && this.state.registroPonto.saida !== null ? this.state.registroPonto.saida : "-"}</Typography></Tooltip>
									<Typography variant="h6">Saída</Typography>
									<Tooltip title="Jornada Padrão"><Typography variant="h6" color={red[700]}>{this.state.registroPonto !== null ? this.state.registroPonto.jornadaSaida : "-"}</Typography></Tooltip>
								</Stack>
							</Grid>
							<Grid item container xs={12} justifyContent="center" sx={{marginTop: 5}}s>
								<LoadingButton
								 	variant="contained"
								 	sx={{width: 400, height: 120}}
								 	color={this.state.color}
								 	loading={this.state.logging}
								 	disabled={this.state.calling || this.state.naoRegistraReason !== null || this.state.lockedSeconds !== 0 || !this.state.isPontoAuth}
								 	onClick={this.registrarPonto}
								>
									{!this.state.isPontoAuth ?  <Stack justifyContent="center" alignItems="center" gap={1}><LockIcon sx={{fontSize: 60}}/>Dispositivo não autorizado!</Stack> :
									this.state.naoRegistraReason != null ?  <Stack justifyContent="center" alignItems="center" gap={1}><LockIcon sx={{fontSize: 60}}/> {this.state.naoRegistraReason}</Stack> :
									this.state.lockedSeconds == null ? <CircularProgress color="inherit"/> :
								 	this.state.lockedSeconds == 0 ? <FingerprintIcon sx={{fontSize: 60}} /> : <Stack justifyContent="center" alignItems="center" gap={1}><LockIcon sx={{fontSize: 60}}/> {`Aguarde ${this.state.lockedSeconds} segundos...`}</Stack>}
								 </LoadingButton>
							</Grid>
							{this.props.usuario !== null && this.props.usuario.permissaoList.includes("Ponto.Write.All") ? <Grid item container xs={12} justifyContent="center" sx={{marginTop: 5}}s>
								<LoadingButton
								 	variant="contained"
								 	size="large"
								 	loading={this.state.authenticating}
								 	startIcon={this.state.isPontoAuth ? <LockIcon /> : <LockOpenIcon/>}
								 	loadingPosition="start"
								 	color={this.state.isPontoAuth ? "error" : "success"}
								 	disabled={this.state.isPontoAuth}
								 	onClick={this.handleAuthenticate}
								>
									{this.state.isPontoAuth ? "Desautorizar Dispositivo" : "Autorizar Dispositivo"}
								 </LoadingButton>
							</Grid> : ""}
						</Grid>
					</Box>
					<Collapse in={this.state.alertOpen}>
						{this.state.alert}
					</Collapse>
				</Paper>
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const params = useParams();
	const location = useLocation()
	return <RegistroPontoModule params={params} location={location} {...props}/>
}