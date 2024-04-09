import React from "react";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import dayjs from 'dayjs';

import api from "../services/api";

export default class AlterarJornadaBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			jornada: null,

			calling: false,
			saving: false,

			jornadaEntrada: null,
			jornadaIntervaloInicio: null,
			jornadaIntervaloFim: null,
			jornadaSaida: null,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getJornadaFromApi = this.getJornadaFromApi.bind(this);
		this.saveJornada = this.saveJornada.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getJornadaFromApi();
	}

	getJornadaFromApi() {
		this.setState({calling: true});
		api.get(`/usuario/${this.props.usuarioId}/jornada`, {redirect403: false})
			.then((response) => {
				let jornada = response.data;
				this.setState({
					jornada: jornada,
					jornadaEntrada: jornada !== null ? dayjs(jornada.entrada, "HH:mm:ss") : null,
					jornadaIntervaloInicio: jornada !== null ? dayjs(jornada.intervaloInicio, "HH:mm:ss") : null,
					jornadaIntervaloFim: jornada !== null ? dayjs(jornada.intervaloFim, "HH:mm:ss") : null,
					jornadaSaida: jornada !== null ? dayjs(jornada.saida, "HH:mm:ss") : null,
					errors: {},
					calling: false,
					});
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({jornada: null, calling: false});
					return;
				}
				this.openAlert("error", "Falha ao obter jornada!");
				this.setState({calling: false});
			});
	}

	saveJornada() {
		let data = {
			jornada: (this.state.jornadaEntrada == null && this.state.jornadaIntervaloInicio == null && this.state.jornadaIntervaloFim == null && this.state.jornadaSaida == null) ? null : {
				entrada: this.state.jornadaEntrada !== null ? dayjs(this.state.jornadaEntrada).format("HH:mm:ss") : null,
				intervaloInicio: this.state.jornadaIntervaloInicio !== null ? dayjs(this.state.jornadaIntervaloInicio).format("HH:mm:ss") : null,
				intervaloFim: this.state.jornadaIntervaloFim !== null ? dayjs(this.state.jornadaIntervaloFim).format("HH:mm:ss") : null,
				saida: this.state.jornadaSaida !== null ? dayjs(this.state.jornadaSaida).format("HH:mm:ss") : null
			},
		};

		this.setState({calling: true, saving: true});
		api.patch(`/usuario/${this.props.usuarioId}/jornada`, data)
			.then((response) => {
				this.openAlert("success", `Jornada salva com sucesso!`);
				this.getJornadaFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar jornada!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
	
		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", alignItems: "center"}}>
				<Grid container spacing={3}>
					<Grid container item xs={12} md={3}>
						<TimePicker
							id="jornada-entrada"
							value={this.state.jornadaEntrada}
							onChange={(newValue) => this.setState({jornadaEntrada: newValue})}
							label="Entrada"
							slotProps={{
								field: { clearable: true },
								textField: {
									fullWidth: true,
									error: "jornada.entrada" in this.state.errors || "jornada.jornadaOrderValid" in this.state.errors,
									helperText: "jornada.entrada" in this.state.errors ? this.state.errors["jornada.entrada"] : "jornada.jornadaOrderValid" in this.state.errors ? this.state.errors["jornada.jornadaOrderValid"] : ""
								},
							}}
							variant="outlined"
							disabled={this.state.calling}
						/>
					</Grid>
					<Grid container item xs={12} md={3}>
						<TimePicker
							id="jornada-intervalo-inicio"
							value={this.state.jornadaIntervaloInicio}
							onChange={(newValue) => this.setState({jornadaIntervaloInicio: newValue})}
							label="Início do Intervalo"
							slotProps={{
								field: { clearable: true },
								textField: {
									fullWidth: true,
									error: "jornada.intervaloInicio" in this.state.errors,
									helperText: "jornada.intervaloInicio" in this.state.errors ? this.state.errors["jornada.intervaloInicio"] : ""
								},
							}}
							variant="outlined"
							disabled={this.state.calling}
						/>
					</Grid>
					<Grid container item xs={12} md={3}>
						<TimePicker
							id="jornada-intervalo-fim"
							value={this.state.jornadaIntervaloFim}
							onChange={(newValue) => this.setState({jornadaIntervaloFim: newValue})}
							label="Fim do Intervalo"
							slotProps={{
								field: { clearable: true },
								textField: {
									fullWidth: true,
									error: "jornada.intervaloFim" in this.state.errors,
									helperText: "jornada.intervaloFim" in this.state.errors ? this.state.errors["jornada.intervaloFim"] : ""
								},
							}}
							variant="outlined"
							disabled={this.state.calling}
						/>
					</Grid>
					<Grid container item xs={12} md={3}>
						<TimePicker
							id="jornada-saida"
							value={this.state.jornadaSaida}
							onChange={(newValue) => this.setState({jornadaSaida: newValue})}
							label="Saída"
							slotProps={{
								field: { clearable: true },
								textField: {
									fullWidth: true,
									error: "jornada.saida" in this.state.errors,
									helperText: "jornada.saida" in this.state.errors ? this.state.errors["jornada.saida"] : ""
								},
							}}
							variant="outlined"
							disabled={this.state.calling}
						/>
					</Grid>
				</Grid>
				<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveJornada}>Salvar</LoadingButton>
				<Collapse in={this.state.alertOpen}>
					{this.state.alert}
				</Collapse>
			</Box>
		  );
	}

}