import React from "react";

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import LoadingButton from '@mui/lab/LoadingButton';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Stack from '@mui/material/Stack';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import WarningIcon from '@mui/icons-material/Warning';
import Paper from '@mui/material/Paper';
import CircleIcon from '@mui/icons-material/Circle';

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import api from "../services/api";

import {isAuth, getToken, setToken, removeToken} from "../utils/pontoAuth"

export default class JornadaChip extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: isAuth(),

			registroJornada: null,
			error: null,
			lastSuccessRefreshTime: null,

			popoverOpen: false,

			alertAusente: false,

			calling: false,
			authenticating: false,
			refreshing: false,
			logando: false,
			deslogando: false,
			iniciandoHoraExtra: false,
			togglingHoraExtraAuto: false,
			togglingHoraExtraPermitida: false,
			tellingImHere: false,
			alterandoStatus: false,
		}

		this.usuarioId = "me";
		if (!props.me)
			this.usuarioId = this.props.usuarioId;

		this.notifyAlertAusente = true;
		this.notifyAusente = true;
		this.notifyHoraExtra = false;
		this.notifyLogado = false;
		this.notifyDeslogado = false;

		this.alertAusenteSeconds = 300;

		this.refreshTimeoutTime = 10000;
		this.refreshTimeout = null;

		this.chipRef = React.createRef();

		this.getUsuarioRegistroJornadaFromApi = this.getUsuarioRegistroJornadaFromApi.bind(this);

		this.handleAuthenticate = this.handleAuthenticate.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.validateToken = this.validateToken.bind(this);
		this.logar = this.logar.bind(this);
		this.deslogar = this.deslogar.bind(this);
		this.iniciarHoraExtra = this.iniciarHoraExtra.bind(this);
		this.toggleHoraExtraAuto = this.toggleHoraExtraAuto.bind(this);
		this.toggleHoraExtraPermitida = this.toggleHoraExtraPermitida.bind(this);
		this.imHere = this.imHere.bind(this);
		this.handleAlterarStatus = this.handleAlterarStatus.bind(this);
		this.openPopover = this.openPopover.bind(this);

		this.handleNotifyAlertAusente = this.handleNotifyAlertAusente.bind(this);
		this.handleNotifyAusente = this.handleNotifyAusente.bind(this);

		this.startRefreshTimeout = this.startRefreshTimeout.bind(this);
		this.stopRefreshTimeout = this.stopRefreshTimeout.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getUsuarioRegistroJornadaFromApi();
		if (this.state.isAuth)
			this.validateToken();
	}

	componentWillUnmount() {
		this.stopRefreshTimeout();
	}

	openPopover() {
		this.setState({popoverOpen: true}, () => this.getUsuarioRegistroJornadaFromApi());
	}

	getUsuarioRegistroJornadaFromApi() {
		this.stopRefreshTimeout();
		this.setState({calling: true, error: null, refreshing: true});
		api.get(`/registro-jornada/${this.usuarioId}/hoje?completo=${this.state.popoverOpen ? "true" : "false"}`, {redirect403: false})
			.then((response) => {
				let registroJornada = response.data;
				if (registroJornada.statusOptionList !== null && registroJornada.statusAtual !== null && registroJornada.completo) {
					registroJornada.statusOptionList = registroJornada.statusOptionList.filter((status) => {
						if (status.jornadaStatusId == registroJornada.statusRegularId && !registroJornada.emHoraExtra ||
							status.jornadaStatusId == registroJornada.statusHoraExtraId && registroJornada.emHoraExtra)
							return 1;
						if (status.jornadaStatusId == registroJornada.statusAtual.jornadaStatusId)
							return 1;
						if (this.props.me)
							return status.usuarioPodeAtivar;
						else
							return status.supervisorPodeAtivar;
					});
					registroJornada.statusOptionList.sort((a, b) => {
						return (b.jornadaStatusId == registroJornada.statusRegularId || b.jornadaStatusId == registroJornada.statusHoraExtraId) - (a.jornadaStatusId == registroJornada.statusRegularId || a.jornadaStatusId == registroJornada.statusHoraExtraId) ||
							b.usuarioPodeAtivar - a.usuarioPodeAtivar;
					});
				}
				this.setState({
					registroJornada: registroJornada,
					error: null,
					calling: false,
					refreshing: false,
					lastSuccessRefreshTime: dayjs().format("HH:mm:ss"),
					alertAusente: this.props.me && registroJornada.secondsToAusente !== -1 ? registroJornada.secondsToAusente <= this.alertAusenteSeconds : false,
				}, () => {
					if (this.state.isAuth && this.props.me) {
						this.handleNotifyAlertAusente();
						this.handleNotifyAusente();
					}
				});
				this.startRefreshTimeout();
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.setState({registroJornada: null, calling: false, error: "Não permitido!", refreshing: false});
					return;
				}
				let error = null;
				if ("response" in err && typeof err.response.data === "object" && "errors" in err.response.data) {
					let errors = err.response.data.errors;
					if ("contrato" in errors)
						error = "Usuário sem contrato cadastrado!"
					else if ("jornada" in errors)
						error = "Usuário sem jornada cadastrada!"
					else if ("hoje" in errors)
						error = "Usuário não registra ponto hoje!"
					else
						error = "Falha inesperada!"
				} else {
					error = "O servidor não respondeu a solicitação!"
				}
				this.setState({registroJornada: null, calling: false, error: error, refreshing: false});
			});
	}

	startRefreshTimeout() {
		if (this.refreshTimeout !== null)
			this.stopRefreshTimeout();
		this.refreshTimeout = setTimeout(this.getUsuarioRegistroJornadaFromApi, this.refreshTimeoutTime);
	}

	stopRefreshTimeout() {
		clearTimeout(this.refreshTimeout);
	}

	handleAuthenticate() {
		if (this.state.isAuth) {
			this.openAlert("success", "Dispositivo desautorizado com sucesso!");
			removeToken();
			this.setState({isAuth: false});
		} else
			this.authenticate();
	}

	authenticate() {
		this.setState({authenticating: true});
		api.get("/registro-jornada/generate-token")
			.then((response) => {
				this.openAlert("success", "Dispositivo autorizado com sucesso!");
				setToken(response.data.token);
				this.setState({authenticating: false, isAuth: true})
			})
			.catch((err) => {
				console.log(err);
				this.openAlert("error", "Falha ao autorizar dispositivo!");
				this.setState({authenticating: false})
			});
	}

	validateToken() {
		api.post("/registro-jornada/validate-token", {
			token: getToken()
			})
			.then((response) => {
				this.setState({isAuth: true});
			})
			.catch((err) => {
				this.openAlert("error", "Autorização do dispositivo expirou!");
				removeToken();
				this.setState({isAuth: false});
			});
	}

	logar() {
		this.setState({logando: true})
		api.post(`/registro-jornada/${this.usuarioId}/logar`, {
				token: getToken(),
			}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Logado com sucesso!");
				this.getUsuarioRegistroJornadaFromApi();
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao logar!");
			})
			.finally(() => {
				this.setState({
					logando: false,
				});
			});
	}

	deslogar() {
		this.setState({deslogando: true})
		api.post(`/registro-jornada/${this.usuarioId}/deslogar`, {
				token: getToken(),
			}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Deslogado com sucesso!");
				this.getUsuarioRegistroJornadaFromApi();
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deslogar!");
			})
			.finally(() => {
				this.setState({
					deslogando: false,
				});
			});
	}

	iniciarHoraExtra() {
		this.setState({iniciandoHoraExtra: true})
		api.post(`/registro-jornada/${this.usuarioId}/iniciar-hora-extra`, {
				token: getToken(),
			}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Hora extra iniciada com sucesso!");
				this.getUsuarioRegistroJornadaFromApi();
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao iniciar hora extra!");
			})
			.finally(() => {
				this.setState({
					iniciandoHoraExtra: false,
				});
			});
	}

	toggleHoraExtraPermitida() {
		this.setState({togglingHoraExtraPermitida: true})
		api.post(`/registro-jornada/${this.usuarioId}/toggle-hora-extra-permitida`, {
				token: getToken(),
			}, {redirect403: false})
			.then((response) => {
				this.getUsuarioRegistroJornadaFromApi();
			})
			.catch((err) => {
			})
			.finally(() => {
				this.setState({
					togglingHoraExtraPermitida: false,
				});
			});
	}

	toggleHoraExtraAuto() {
		this.setState({togglingHoraExtraAuto: true})
		api.post(`/registro-jornada/${this.usuarioId}/toggle-hora-extra-auto`, {
				token: getToken(),
			}, {redirect403: false})
			.then((response) => {
				this.getUsuarioRegistroJornadaFromApi();
			})
			.catch((err) => {
			})
			.finally(() => {
				this.setState({
					togglingHoraExtraAuto: false,
				});
			});
	}

	imHere() {
		this.setState({tellingImHere: true})
		api.post("/registro-jornada/me/im-here", {
				token: getToken(),
			})
			.then((response) => {
				this.getUsuarioRegistroJornadaFromApi();
			})
			.catch((err) => {
			})
			.finally(() => {
				this.setState({
					tellingImHere: false,
				});
			});
	}

	handleAlterarStatus(e) {
		this.setState({alterandoStatus: true})
		api.post(`/registro-jornada/${this.usuarioId}/alterar-status`, {
				token: getToken(),
				jornadaStatusId: e.target.value,
			}, {redirect403: false})
			.then((response) => {
				this.getUsuarioRegistroJornadaFromApi();
				this.openAlert("success", "Status alterado!");
			})
			.catch((err) => {
				let error = null;
				if ("response" in err && "errors" in err.response.data) {
					let errors = err.response.data.errors;
					if ("jornadaStatus" in errors)
						this.openAlert("error", "Status não permitido!");
					else
						this.openAlert("error", "Falha inesperada!");
				}
				else {
					this.openAlert("error", "O servidor não respondeu a solicitação!");
				}
			})
			.finally(() => {
				this.setState({
					alterandoStatus: false,
				});
			});
	}

	handleNotifyAusente() {
		if (this.state.registroJornada.secondsToAusente != 0) {
				this.notifyAusente = true;
			}
		if (this.notifyAusente && this.state.registroJornada.secondsToAusente == 0 && this.state.registroJornada.statusAtual !== null) {
			this.notifyAusente = false;
			let title = 'Você está ausente!';
			let options = {
				body: "Você está ausente!",
				icon: "/assets/image/pwa_icon_256.png",
				requireInteraction: true,
				actions: [
					{
						action: "im-here",
						title: "Verificar no App"
					}
				]
			};

			navigator.serviceWorker.ready.then(function(registration) {
				registration.showNotification(title, options);
			});
		}
	}

	handleNotifyAlertAusente() {
		if (this.state.registroJornada.secondsToAusente > this.alertAusenteSeconds || this.state.registroJornada.secondsToAusente <= 0) {
			this.notifyAlertAusente = true;
		}
		if (this.notifyAlertAusente && this.state.registroJornada.secondsToAusente > 0 && this.state.registroJornada.secondsToAusente <= this.alertAusenteSeconds && this.state.registroJornada.statusAtual !== null) {
			this.notifyAlertAusente = false;
			let title = 'Você está aí?';
			let options = {
				body: "Você ficará ausente em breve...",
				icon: "/assets/image/pwa_icon_256.png",
				requireInteraction: true,
				actions: [
					{
						action: "im-here",
						title: "Confirmar no App"
					}
				]
			};

			navigator.serviceWorker.ready.then(function(registration) {
				registration.showNotification(title, options);
			});
		}
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {

		let chipColor = "auto";
		let chipLabel;

		if (this.state.error !== null) {
			chipColor = "error"
			chipLabel = <Stack gap={1} direction="row" justifyContent="center" alignItems="center">--:--<ErrorIcon color="error"/></Stack>
		}
		else if (this.state.registroJornada == null) {
			chipColor = "auto"
			chipLabel = <Stack gap={1} direction="row" justifyContent="center" alignItems="center">--:--<CircularProgress size={20} color="inherit"/></Stack>
		}
		else if (this.state.registroJornada.statusAtual == null) {
			chipColor = "auto"
			chipLabel = "Deslogado";
		}
		else {
			chipColor = "#" + this.state.registroJornada.statusAtual.cor;
			let duracao = dayjs.duration(this.state.registroJornada.statusAtual.duracao, 'seconds').format('HH[h]mm[m]');
			if (this.state.registroJornada.statusAtual.maxDuracao !== null)
				duracao = dayjs.duration(this.state.registroJornada.statusAtual.maxDuracao - this.state.registroJornada.statusAtual.duracao, 'seconds').format('HH[h]mm[m]');
			chipLabel = <Stack gap={1} direction="row" justifyContent="center" alignItems="center">{duracao}<CircleIcon size={20} color="inherit"/></Stack>
		}
		
	
		return (
			<React.Fragment>
				<Chip
		      		clickable
		      		variant="outlined"
		      		sx={{
		      			borderColor: chipColor,
		      			color: chipColor
		      		}}
		      		label={chipLabel}
		      		ref={this.chipRef}
		      		onClick={this.openPopover}
		      	/>
		      	<Popover
					id="popover"
					open={this.state.popoverOpen}
					anchorEl={this.chipRef.current}
					onClose={() => this.setState({popoverOpen: false})}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: (this.props.me ? 'right' : 'center'),
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: (this.props.me ? 'right' : 'center'),
					}}
					PaperProps={{
			         	sx: {width: 300}
			         }}
				>
					<Stack gap={1} sx={{padding: 1}}>
						<LoadingButton
							loading={this.state.refreshing}
							variant="outlined"
							onClick={this.getUsuarioRegistroJornadaFromApi}
						>
							Atualizar
						</LoadingButton>
						{this.state.error ?
						<Alert severity="error">{this.state.error}</Alert>
						: ""}
						{this.state.registroJornada !== null && this.state.registroJornada.completo ? <React.Fragment>
							<Typography variant="caption" color={grey[600]} gutterBottom align="center">
								última atualização às {this.state.lastSuccessRefreshTime}
							</Typography>
							<Stack gap={0} direction="row" justifyContent="space-around">
								<Typography variant="caption" color={green[400]} gutterBottom align="center">
									{dayjs(this.state.registroJornada.jornadaEntrada, "HH:mm:ss").format("HH:mm")}
								</Typography>
								<Typography variant="caption" color={yellow[400]} gutterBottom align="center">
									{dayjs(this.state.registroJornada.jornadaIntervaloInicio, "HH:mm:ss").format("HH:mm")}
								</Typography>
								<Typography variant="caption" color={blue[400]} gutterBottom align="center">
									{dayjs(this.state.registroJornada.jornadaIntervaloFim, "HH:mm:ss").format("HH:mm")}
								</Typography>
								<Typography variant="caption" color={red[400]} gutterBottom align="center">
									{dayjs(this.state.registroJornada.jornadaSaida, "HH:mm:ss").format("HH:mm")}
								</Typography>
							</Stack>
							{this.state.registroJornada.emHoraExtra && this.state.registroJornada.statusAtual != null ? <Alert severity="warning">Hora Extra</Alert> : ""}
							{this.state.registroJornada.statusAtual != null ? <FormControl fullWidth>
								<Select
									id="status"
									value={this.state.registroJornada.statusAtual.jornadaStatusId}
									onChange={this.handleAlterarStatus}
									displayEmpty
									disabled={this.alterandoStatus}
								>
									{this.state.registroJornada.statusOptionList.map(status =>
										<MenuItem
											key={status.jornadaStatusId}
											value={status.jornadaStatusId}
											disabled={
												(!this.state.registroJornada.statusAtual.usuarioPodeAtivar && this.props.me) ||
												(!this.state.registroJornada.statusAtual.supervisorPodeAtivar && !this.props.me && this.state.registroJornada.statusAtual.jornadaStatusId !== this.state.registroJornada.statusAusenteId) ||
												(status.maxUso !==null && status.usos >= status.maxUso && this.props.me) ||
												(status.jornadaStatusId == this.state.registroJornada.statusRegularId && this.state.registroJornada.emHoraExtra) ||
												(status.jornadaStatusId == this.state.registroJornada.statusHoraExtraId && !this.state.registroJornada.emHoraExtra)
											}
										>
											{status.nome + ( (status.maxUso != null) ? ` (${status.usos}/${status.maxUso})`: "")}
										</MenuItem>)}
								</Select>
							</FormControl> : ""}
							{this.state.registroJornada.statusAtual !== null && this.state.registroJornada.canUsuarioIniciarHoraExtra ? <LoadingButton loading={this.state.iniciandoHoraExtra} variant="contained" color="warning" startIcon={<MoreTimeIcon />} onClick={this.iniciarHoraExtra}>Iniciar Hora Extra</LoadingButton> : ""}
							{((this.state.registroJornada.canUsuarioLogar && this.props.me) || (this.state.registroJornada.canSupervisorLogar && !this.props.me)) ? !this.state.registroJornada.canUsuarioIniciarHoraExtra ? 
								<LoadingButton loading={this.state.logando} variant="contained" color="success" loadingPosition="start" startIcon={<LoginIcon />} onClick={this.logar}>Logar</LoadingButton>
								: <LoadingButton loading={this.state.logando} variant="contained" color="warning" loadingPosition="start" startIcon={<MoreTimeIcon />} onClick={this.logar}>Logar (hora extra)</LoadingButton> : ""}
							{this.state.registroJornada.canUsuarioDeslogar ? <LoadingButton loading={this.state.deslogando} variant="contained" color="error" startIcon={<LogoutIcon />} onClick={this.deslogar}>Deslogar</LoadingButton> : ""}
							{((!this.state.registroJornada.canUsuarioLogar && this.props.me) || (!this.state.registroJornada.canSupervisorLogar && !this.props.me)) && this.state.registroJornada.statusAtual == null ? <Alert severity="warning">Fora da jornada</Alert> : ""}
							{!this.props.me ? <FormGroup>
									<FormControlLabel sx={{justifyContent: "center"}} control={<Switch checked={this.state.registroJornada.horaExtraPermitida} disabled={this.state.togglingHoraExtraPermitida} onClick={this.toggleHoraExtraPermitida} color="warning"/>} label="Hora Extra Permitida" />
								</FormGroup> : ""}
							{this.state.registroJornada.statusAtual !== null && !this.state.registroJornada.emHoraExtra && this.state.registroJornada.horaExtraPermitida ? <FormGroup>
									<FormControlLabel sx={{justifyContent: "center"}} control={<Switch checked={this.state.registroJornada.horaExtraAuto} disabled={this.state.togglingHoraExtraAuto} onClick={this.toggleHoraExtraAuto} color="warning"/>} label="Hora Extra Auto" />
								</FormGroup> : ""}
							<Divider/>
							{(this.state.registroJornada.statusGroupedList !== null) ? this.state.registroJornada.statusGroupedList.map(status =>
								<Typography key={status.jornadaStatusId}>
									{status.nome}: {dayjs.duration(status.duracao, 'seconds').format('HH[h]mm[m]')} {status.maxDuracao !== null && status.maxUso !== null && status.duracao > status.maxDuracao * status.maxUso ? ` (-${dayjs.duration(status.duracao - status.maxDuracao * status.maxUso, 'seconds').minutes()}m)` : ""}
								</Typography>) : ""}
						</React.Fragment> : ""}
						{this.props.usuario !== null && this.props.usuario.permissaoList.includes("AUTORIZAR_DISPOSITIVO") ?
						<LoadingButton
						 	variant="contained"
						 	loading={this.state.authenticating}
						 	startIcon={this.state.isAuth ? <LockIcon /> : <LockOpenIcon/>}
						 	loadingPosition="start"
						 	color={this.state.isAuth ? "error" : "success"}
						 	disabled={this.state.authenticating}
						 	onClick={this.handleAuthenticate}
						 	sx={{marginTop: 3}}
						>
							{this.state.isAuth ? "Desautorizar Dispositivo" : "Autorizar Dispositivo"}
						 </LoadingButton> : ""}
						<Collapse in={this.state.alertOpen}>
							{this.state.alert}
						</Collapse>
				</Stack>
				</Popover>
				{this.state.registroJornada !== null ?
				<Modal
					open={this.state.alertAusente && this.state.isAuth}
				>
					<Box sx={{display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}} onClick={this.imHere}>
						<Paper sx={{display: "flex", flexDirection: "column", gap: 2, padding: 5, justifyContent: "center", alignItems: "center", color: "white"}}>
							<WarningIcon sx={{fontSize: 120}} color="warning"/>
							<Typography variant="h3">Você está aí?</Typography>
							<LoadingButton
								loading={this.state.tellingImHere}
								variant="contained" 
								color="success" 
								fullWidth 
								size="large"
								onClick={this.imHere}
							>
								Sim, estou!
							</LoadingButton>
							<Typography variant="h5">{this.state.registroJornada.secondsToAusente > 0 ? "Você ficará ausente em breve..." : "Você está ausente!"}</Typography>
						</Paper>
					</Box>
				</Modal>
				: ""}
		    </React.Fragment>
		  );
	}

}