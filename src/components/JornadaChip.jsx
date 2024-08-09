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
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Tooltip from "@mui/material/Tooltip";
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PushPinIcon from '@mui/icons-material/PushPin';
import IconButton from '@mui/material/IconButton';

import {getToken} from "../utils/auth";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import api from "../services/api";

import {isPontoAuth, getPontoToken, setPontoToken, removePontoToken} from "../utils/pontoAuth"

export default class JornadaChip extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isPontoAuth: isPontoAuth(),

			registroJornada: null,
			error: null,
			lastSuccessRefreshTime: null,

			chipColor: "auto",
			chipLabelText: "",
			chipLabelIcon: null,

			popoverOpen: false,

			alertAusente: false,

			calling: false,
			authenticating: false,
			refreshing: false,
			logando: false,
			deslogando: false,
			togglingHoraExtraPermitida: false,
			tellingImHere: false,
			alterandoStatus: false,
		}

		this.usuarioId = "me";
		if (!props.me)
			this.usuarioId = this.props.usuarioId;

		this.notifyAlertAusente = true;
		this.notifyAusente = true;
		this.notifyDuracaoAcabou = true;

		this.alertAusenteSeconds = 300;

		this.refreshTimeoutTimeMe = 60000;
		this.refreshTimeoutTimeNotMe = 60000;
		this.refreshTimeout = null;

		this.chipRef = React.createRef();

		this.getUsuarioRegistroJornadaFromApi = this.getUsuarioRegistroJornadaFromApi.bind(this);

		this.handleAuthenticate = this.handleAuthenticate.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.validateToken = this.validateToken.bind(this);
		this.logar = this.logar.bind(this);
		this.deslogar = this.deslogar.bind(this);
		this.toggleHoraExtraPermitida = this.toggleHoraExtraPermitida.bind(this);
		this.imHere = this.imHere.bind(this);
		this.handleAlterarStatus = this.handleAlterarStatus.bind(this);
		this.openPopover = this.openPopover.bind(this);

		this.calculateChip = this.calculateChip.bind(this);

		this.handleNotifyAlertAusente = this.handleNotifyAlertAusente.bind(this);
		this.handleNotifyAusente = this.handleNotifyAusente.bind(this);
		this.handleNotifyDuracaoAcabou = this.handleNotifyDuracaoAcabou.bind(this);

		this.startRefreshTimeout = this.startRefreshTimeout.bind(this);
		this.stopRefreshTimeout = this.stopRefreshTimeout.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getUsuarioRegistroJornadaFromApi();
		if (this.state.isPontoAuth)
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
						if (status.jornadaStatusId == registroJornada.statusRegularId)
							return 1;
						if (status.jornadaStatusId == registroJornada.statusAtual.jornadaStatusId)
							return 1;
						if (this.props.me)
							return status.usuarioPodeAtivar;
						else
							return status.supervisorPodeAtivar;
					});
					registroJornada.statusOptionList.sort((a, b) => {
						return (b.jornadaStatusId == registroJornada.statusRegularId) - (a.jornadaStatusId == registroJornada.statusRegularId) ||
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
					this.calculateChip();
					if (this.state.isPontoAuth && this.props.me) {
						this.handleNotifyAlertAusente();
						this.handleNotifyAusente();
						this.handleNotifyDuracaoAcabou();
					}
				});
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.setState({registroJornada: null, calling: false, error: "Não permitido!", refreshing: false}, () => this.calculateChip());
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
				this.setState({registroJornada: null, calling: false, error: error, refreshing: false}, () => this.calculateChip());
			})
			.finally(() => {
				this.startRefreshTimeout()
			});
	}

	startRefreshTimeout() {
		if (this.refreshTimeout !== null)
			this.stopRefreshTimeout();
		this.refreshTimeout = setTimeout(this.getUsuarioRegistroJornadaFromApi, this.props.me ? this.refreshTimeoutTimeMe : this.refreshTimeoutTimeNotMe);
	}

	stopRefreshTimeout() {
		clearTimeout(this.refreshTimeout);
	}

	handleAuthenticate() {
		if (this.state.isPontoAuth) {
			this.openAlert("success", "Dispositivo desautorizado com sucesso!");
			removePontoToken();
			this.setState({isPontoAuth: false});
		} else
			this.authenticate();
	}

	authenticate() {
		this.setState({authenticating: true});
		api.get("/registro-jornada/generate-token")
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
		api.post("/registro-jornada/validate-token", {
			token: getPontoToken()
			})
			.then((response) => {
				this.setState({isPontoAuth: true});
			})
			.catch((err) => {
				this.openAlert("error", "Autorização do dispositivo expirou!");
				removePontoToken();
				this.setState({isPontoAuth: false});
			});
	}

	logar() {
		this.setState({logando: true})
		api.post(`/registro-jornada/${this.usuarioId}/logar`, {
				token: getPontoToken(),
			}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Logado com sucesso!");
				this.getUsuarioRegistroJornadaFromApi();

				if (this.props.me)
					this.fixar();
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
		if (!window.confirm("Você deseja realmente sair?"))
			return;

		this.setState({deslogando: true})
		api.post(`/registro-jornada/${this.usuarioId}/deslogar`, {
				token: getPontoToken(),
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

	toggleHoraExtraPermitida() {
		this.setState({togglingHoraExtraPermitida: true})
		api.post(`/registro-jornada/${this.usuarioId}/toggle-hora-extra-permitida`, {
				token: getPontoToken(),
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

	imHere() {
		this.setState({tellingImHere: true})
		api.post("/registro-jornada/me/im-here", {
				token: getPontoToken(),
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
		if (!window.confirm("Você deseja realmente alterar seu status?"))
			return;
		
		this.setState({alterandoStatus: true})
		api.post(`/registro-jornada/${this.usuarioId}/alterar-status`, {
				token: getPontoToken(),
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

	handleNotifyDuracaoAcabou() {
		if (this.state.registroJornada.statusAtual !== null && this.state.registroJornada.statusAtual.maxDuracao !== null && this.state.registroJornada.statusAtual.duracao <= this.state.registroJornada.statusAtual.maxDuracao) {
				this.notifyDuracaoAcabou = true;
			}
		if (this.notifyDuracaoAcabou && this.state.registroJornada.statusAtual !== null && this.state.registroJornada.statusAtual.maxDuracao !== null && this.state.registroJornada.statusAtual.duracao > this.state.registroJornada.statusAtual.maxDuracao) {
			this.notifyDuracaoAcabou = false;
			let title = 'O tempo do status esgotou!';
			let options = {
				body: "Verifique seu status!",
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

	fixar() {
		window.location = "jornada-unisystem://?token=" + getToken() + "&ponto-token=" + getPontoToken();
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	calculateChip() {
		let chipColor = "auto";
		let chipLabelText = "";
		let chipLabelIcon = null;

		if (this.state.error !== null) {
			chipColor = "error.main"
			chipLabelText = "--:--"
			chipLabelIcon = <ErrorIcon color="inherit"/>
		} else if (this.state.registroJornada == null) {
			chipColor = "auto"
			chipLabelText = "--:--"
			chipLabelIcon = <CircularProgress size={20} color="inherit"/>
		} else if (this.state.registroJornada.statusAtual == null) {
			chipColor = "auto"
			chipLabelText = "Deslogado";
			chipLabelIcon = <CircleOutlinedIcon size={20} color="inherit"/>
		} else {
			chipColor = "#" + this.state.registroJornada.statusAtual.cor;

			if (this.state.registroJornada.statusAtual.maxDuracao == null) {
				chipLabelText = dayjs.duration(this.state.registroJornada.statusAtual.duracao, 'seconds').format('HH[h]mm[m]');
				chipLabelIcon = <CircleIcon size={20} color="inherit"/>
			} else {
				chipLabelText = dayjs.duration(this.state.registroJornada.statusAtual.maxDuracao - this.state.registroJornada.statusAtual.duracao, 'seconds').format('HH[h]mm[m]');

				let timeLeftRatio =  1 - this.state.registroJornada.statusAtual.duracao / this.state.registroJornada.statusAtual.maxDuracao;

				if (timeLeftRatio > 0.5)
					chipLabelIcon = <HourglassFullIcon color="inherit"/>
				else if (timeLeftRatio > 0)
					chipLabelIcon = <HourglassBottomIcon color="inherit"/>
				else {
					chipColor = "error.main"
					chipLabelIcon = <HourglassEmptyIcon color="inherit"/>
				}
					
			}
		
		}

		this.setState({
			chipColor: chipColor,
			chipLabelText: chipLabelText,
			chipLabelIcon: chipLabelIcon,
		});
	}

	render() {
	
		return (
			<React.Fragment>
				<Chip
		      		clickable
		      		variant="outlined"
		      		sx={{
		      			borderColor: this.state.chipColor,
		      			color: this.state.chipColor
		      		}}
		      		label={
		      			<Stack gap={1} direction="row" justifyContent="center" alignItems="center">
		      				<React.Fragment>
		      					{this.state.chipLabelText}
		      					{this.state.chipLabelIcon}
		      				</React.Fragment>
		      			</Stack>
		      		}
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
						<Stack gap={1} direction="row">
							<LoadingButton
								sx={{flexGrow: 1}}
								loading={this.state.refreshing}
								variant="contained"
								onClick={this.getUsuarioRegistroJornadaFromApi}
								startIcon={<RefreshIcon />}
								loadingPosition="start"
							>
								Atualizar
							</LoadingButton>
							{this.props.showFixButton && <Tooltip title="Fixar">
								<IconButton onClick={this.fixar}><PushPinIcon/></IconButton>
							</Tooltip>}
						</Stack>
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
							{this.state.registroJornada.statusAtual !== null ? <Stack gap={1}>
								<LinearProgress variant={!this.state.registroJornada.emHoraExtra ? "determinate" : "indeterminate"} color={!this.state.registroJornada.emHoraExtra ? "success" : "warning"} value={this.state.registroJornada.horasTrabalhadas / this.state.registroJornada.horasATrabalhar * 100}/>
								<Typography variant="caption" gutterBottom align="center">
									{dayjs.duration(this.state.registroJornada.horasTrabalhadas, 'seconds').format('HH[h]mm[m]') + " / " + dayjs.duration(this.state.registroJornada.horasATrabalhar, 'seconds').format('HH[h]mm[m]')}
								</Typography>
							</Stack> : "" }
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
												(status.maxUso !==null && status.usos >= status.maxUso && this.props.me)
											}
										>
											{status.nome + ( (status.maxUso != null) ? ` (${status.usos}/${status.maxUso})`: "")}
										</MenuItem>)}
								</Select>
							</FormControl> : ""}
							{((this.state.registroJornada.canUsuarioLogar && this.props.me) || (this.state.registroJornada.canSupervisorLogar && !this.props.me)) ? 
								<LoadingButton loading={this.state.logando} variant="contained" color="success" loadingPosition="start" startIcon={<LoginIcon />} onClick={this.logar}>Entrada</LoadingButton> : ""}
							{this.state.registroJornada.canUsuarioDeslogar ? <LoadingButton loading={this.state.deslogando} variant="contained" color="error" startIcon={<LogoutIcon />} onClick={this.deslogar}>Saída</LoadingButton> : ""}
							{((!this.state.registroJornada.canUsuarioLogar && this.props.me) || (!this.state.registroJornada.canSupervisorLogar && !this.props.me)) && this.state.registroJornada.statusAtual == null ? <Alert severity="success">Jornada Concluída</Alert> : ""}
							{!this.props.me ? <FormGroup>
									<FormControlLabel sx={{justifyContent: "center"}} control={<Switch checked={this.state.registroJornada.horaExtraPermitida} disabled={this.state.togglingHoraExtraPermitida} onClick={this.toggleHoraExtraPermitida} color="success"/>} label="Hora Extra Permitida" />
								</FormGroup> : ""}
							<Divider/>
							{(this.state.registroJornada.statusGroupedList !== null) ? this.state.registroJornada.statusGroupedList.map(status =>
								<Typography key={status.jornadaStatusId}>
									{status.nome}: {dayjs.duration(status.duracao, 'seconds').format('HH[h]mm[m]')} {status.maxDuracao !== null && status.maxUso !== null && status.duracao > status.maxDuracao * status.maxUso ? ` (-${dayjs.duration(status.duracao - status.maxDuracao * status.maxUso, 'seconds').minutes()}m)` : ""}
								</Typography>) : ""}
						</React.Fragment> : ""}
						<Divider>
							{this.state.isPontoAuth ? 
								<Chip icon={<VerifiedUserIcon/>} label="Dispositivo Autorizado" size="small" color="success" disabled={this.state.authenticating} onClick={this.props.usuario?.permissaoList?.includes("AUTORIZAR_DISPOSITIVO") ? this.handleAuthenticate : null} />
								:
								<Chip icon={<SecurityIcon/>} label="Dispositivo Não Autorizado" size="small" color="error" disabled={this.state.authenticating} onClick={this.props.usuario?.permissaoList?.includes("AUTORIZAR_DISPOSITIVO") ? this.handleAuthenticate : null} />
							}
						</Divider>
						<Collapse in={this.state.alertOpen}>
							{this.state.alert}
						</Collapse>
				</Stack>
				</Popover>
				{this.state.registroJornada !== null ?
				<Modal
					open={this.state.alertAusente && this.state.isPontoAuth}
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