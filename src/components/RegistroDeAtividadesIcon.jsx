import React from "react";

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Snackbar from '@mui/material/Snackbar';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ButtonGroup from '@mui/material/ButtonGroup';
import Pagination from '@mui/material/Pagination';

import VendaStatusChip from './VendaStatusChip';
import UsuarioDisplayChip from "./UsuarioDisplayChip";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import dayjs from 'dayjs';

import api from "../services/api";

import {isAudioEnabled, enableAudio, disableAudio} from "../utils/audio";

class RegistroDeAtividadesIcon extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuarioList: null,
			usuarioByUsuarioId: {},
			vendaStatusList: null,
			vendaStatusByVendaStatusId: {},

			dataInicio: null,
			lastSuccessRefreshTime: null,

			vendaAtualizacaoList: [],
			numeroAtualizacoesNovas: 0,
			firstRefresh: true,

			popoverOpen: false,

			refreshing: false,

			alertOpen: false,
			alert: null,

			snackbarOpen: false,
			Snackbar: null,

			isAudioEnabled: isAudioEnabled(),

			page: 1,
			rowsPerPage: 10,
		}

		this.refreshTimeoutTime = 60000;
		this.refreshTimeout = null;

		this.iconRef = React.createRef();

		this.openPopover = this.openPopover.bind(this);
		this.closePopover = this.closePopover.bind(this);
		this.refresh = this.refresh.bind(this);

		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getVendaAtualizacaoList = this.getVendaAtualizacaoList.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);

		this.renderVendaAtualizacao = this.renderVendaAtualizacao.bind(this);

		this.startRefreshTimeout = this.startRefreshTimeout.bind(this);
		this.stopRefreshTimeout = this.stopRefreshTimeout.bind(this);

		this.disableAudio = this.disableAudio.bind(this);
		this.enableAudio = this.enableAudio.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);

		this.openSnackbar = this.openSnackbar.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
	}

	componentDidMount() {
		this.getUsuarioListFromApi();
		this.getVendaStatusListFromApi();
		this.refresh();
	}

	componentWillUnmount() {
		this.stopRefreshTimeout();
	}

	getUsuarioListFromApi() {
		api.get("/empresa/me/usuario")
			.then((response) => {
				let usuarioList = response.data;
				let usuarioByUsuarioId = {};
				usuarioList.forEach((usuario) => usuarioByUsuarioId[usuario.usuarioId] = usuario);
				this.setState({usuarioList: usuarioList, usuarioByUsuarioId: usuarioByUsuarioId});
			})
			.catch((err) => {
				setTimeout(this.getUsuarioListFromApi, 3000);
			});
	}

	getVendaStatusListFromApi() {
		api.get("/empresa/me/venda-status")
			.then((response) => {
				let vendaStatusList = response.data;
				let vendaStatusByVendaStatusId = {};
				vendaStatusList.forEach((vendaStatus) => vendaStatusByVendaStatusId[vendaStatus.vendaStatusId] = vendaStatus);
				this.setState({vendaStatusList: vendaStatusList, vendaStatusByVendaStatusId: vendaStatusByVendaStatusId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendaStatusListFromApi, 3000);
			});
	}

	getVendaAtualizacaoList() {
		api.post("/venda/venda-atualizacao-list",
			{
				dataInicio: this.state?.dataInicio?.format("YYYY-MM-DDTHH:mm:ss") ?? null,
			})
			.then((response) => {
				let novaVendaAtualizacaoList = response.data;
				let vendaAtualizacaoList = this.state.vendaAtualizacaoList.concat(novaVendaAtualizacaoList);

				let dataInicio = this.state.dataInicio;
				if (novaVendaAtualizacaoList.length > 0)
					dataInicio = dayjs(novaVendaAtualizacaoList[novaVendaAtualizacaoList.length - 1].data);

				let numeroAtualizacoesNovas = !this.state.firstRefresh ? novaVendaAtualizacaoList.filter((vendaAtualizacao) => vendaAtualizacao.usuarioId != this.props.usuario.usuarioId).length : 0;

				if (numeroAtualizacoesNovas > 0) {
					if (this.state.isAudioEnabled)
						new Audio("/assets/sound/notification.wav").play();
					this.openSnackbar("success", `${numeroAtualizacoesNovas} atualizações novas`);
				}

				this.setState({
					vendaAtualizacaoList: vendaAtualizacaoList,
					numeroAtualizacoesNovas: this.state.numeroAtualizacoesNovas + numeroAtualizacoesNovas,
					refreshing: false,
					lastSuccessRefreshTime: dayjs().format("HH:mm:ss"),
					dataInicio: dataInicio,
					firstRefresh: false,
				});
			})
			.catch((err) => {
				console.log(err);
				this.openAlert("error", "Falha ao atualizar");
				this.setState({refreshing: false});
			})
			.finally(() => {
				this.startRefreshTimeout()
			});
	}

	refresh() {
		this.stopRefreshTimeout();
		this.setState({refreshing: true});
		this.getVendaAtualizacaoList();
	}

	openPopover() {
		this.setState({popoverOpen: true}, this.refresh);
	}

	closePopover() {
		this.setState({popoverOpen: false, numeroAtualizacoesNovas: 0});
	}

	startRefreshTimeout() {
		if (this.refreshTimeout !== null)
			this.stopRefreshTimeout();
		this.refreshTimeout = setTimeout(this.refresh, this.refreshTimeoutTime);
	}

	stopRefreshTimeout() {
		clearTimeout(this.refreshTimeout);
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	openSnackbar(severity, message) {
		this.setState({snackbar: <Alert severity={severity} onClose={this.closeSnackbar}>{message}</Alert>, snackbarOpen: true});
	}

	closeSnackbar() {
		this.setState({snackbarOpen: false});
	}

	enableAudio() {
		enableAudio();
		this.setState({isAudioEnabled: true});
	}

	disableAudio() {
		disableAudio();
		this.setState({isAudioEnabled: false});
	}

	renderVendaAtualizacao(vendaAtualizacao) {
		return  <Paper>
					<Box>
						<Stack gap={1} sx={{padding: 1}}>
							<Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
								<VendaStatusChip vendaStatus={this.state.vendaStatusByVendaStatusId?.[vendaAtualizacao.statusId]} onClick={() => this.props.navigate("/vendas/" + vendaAtualizacao.vendaId)}/>
								<Chip color="default" variant="outlined" size="small" label={`#${vendaAtualizacao.vendaId}`} />
							</Stack>
							<Paper variant="outlined" sx={{overflow: "auto", minHeight: 15, maxHeight: 50, padding: 1}}>
								<pre style={{margin: 0}}>{vendaAtualizacao.relato.replace(/(\\n)/g, "\n")}</pre>
							</Paper>
							<Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
								<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[vendaAtualizacao.usuarioId]}/>
								<Typography variant="caption" color={grey[600]} align="center">
									{dayjs(vendaAtualizacao.data).fromNow()}
								</Typography>
							</Stack>
						</Stack>
					</Box>
				</Paper>
	}

	render() {
	
		return (
			<React.Fragment>
				<Tooltip title="Notificações">
					<Box>
						<IconButton
				      		ref={this.iconRef}
				      		onClick={this.openPopover}
				      	>
				      		<Badge color="success" badgeContent={this.state.numeroAtualizacoesNovas ?? 0}>
				      			<NotificationsIcon/>
				      		</Badge>
				      	</IconButton>
		      		</Box>
		      </Tooltip>
		      	<Popover
					id="popover"
					open={this.state.popoverOpen}
					anchorEl={this.iconRef.current}
					onClose={this.closePopover}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					PaperProps={{
			         	sx: {width: 400}
			         }}
				>
					<Stack gap={1} sx={{padding: 1}}>
						<Stack gap={1} direction="row">
							<LoadingButton
								sx={{flexGrow: 1}}
								loading={this.state.refreshing}
								variant="contained"
								onClick={this.refresh}
								startIcon={<RefreshIcon />}
								loadingPosition="start"
								size="small"
							>
								Atualizar
							</LoadingButton>
							{this.state.isAudioEnabled ?
								<Tooltip title="Silenciar"><IconButton onClick={this.disableAudio} size="small"><VolumeUpIcon/></IconButton></Tooltip> :
								<Tooltip title="Desilenciar"><IconButton onClick={this.enableAudio} size="small"><VolumeOffIcon/></IconButton></Tooltip>}
						</Stack>
						{this.state.lastSuccessRefreshTime && <Typography variant="caption" color={grey[600]} align="center">
								última atualização às {this.state.lastSuccessRefreshTime}
							</Typography>}
						<Stack gap={1} sx={{maxHeight: 450, overflow: "auto"}} divider={<Divider variant="middle"/>}>
							{[...this.state.vendaAtualizacaoList].reverse().slice((this.state.page - 1) * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage).map((vendaAtualizacao, i) => <React.Fragment key={vendaAtualizacao.vendaAtualizacaoId}>
									{this.renderVendaAtualizacao(vendaAtualizacao)}
								</React.Fragment>)}
							{this.state.vendaAtualizacaoList.length == 0 && <Alert severity="info">Nenhuma atualização nas últimas 24 horas</Alert>}
						</Stack>
						<Stack alignItems="center">
							<Pagination
								count={Math.ceil(this.state.vendaAtualizacaoList.length / this.state.rowsPerPage)}
								page={this.state.page}
								onChange={(event, value) => this.setState({page: value})}
								color="primary"
								size="small"
								showFirstButton
								showLastButton
							/>
						</Stack>
						<Collapse in={this.state.alertOpen}>
							{this.state.alert}
						</Collapse>
				</Stack>
				</Popover>
			<Snackbar open={this.state.snackbarOpen} onClose={(e, reason) => (reason !== "clickaway") ? this.closeSnackbar() : ""} anchorOrigin={{vertical: "top", horizontal: "right"}} autoHideDuration={2000}>
				<div>{this.state.snackbar}</div>
			</Snackbar>
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const navigate = useNavigate();
	return <RegistroDeAtividadesIcon navigate={navigate} {...props}/>
}