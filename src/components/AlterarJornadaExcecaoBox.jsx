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
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs from 'dayjs';

import api from "../services/api";

function ServerDay(props) {

	const { dataList, ...rest } = props;

	let highlight = dataList.indexOf(props.day.format("YYYY-MM-DD")) >= 0;

  return (
    <Badge
      color="secondary"
      variant="dot"
      invisible={!highlight}
      key={props.day.toString()}
      overlap="circular"
    >
      <PickersDay {...rest} />
    </Badge>
  );
}

export default class AlterarJornadaBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataList: [],

			data: null,

			jornadaExcecao: undefined,


			calling: false,
			saving: false,
			adicionando: false,
			deletando: false,
			refreshingDataList: false,
			refreshingJornadaExcecao: false,

			jornadaEntrada: null,
			jornadaIntervaloInicio: null,
			jornadaIntervaloFim: null,
			jornadaSaida: null,
			registraPonto: null,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getDataListFromApi = this.getDataListFromApi.bind(this);
		this.saveJornada = this.saveJornada.bind(this);
		this.addJornada = this.addJornada.bind(this);
		this.getJornadaExcecaoFromApi = this.getJornadaExcecaoFromApi.bind(this);
		this.deleteJornada = this.deleteJornada.bind(this);

		this.handleDayChange = this.handleDayChange.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getDataListFromApi();
	}

	getDataListFromApi() {
		this.setState({calling: true, refreshingDataList: true});
		api.get(`/usuario/${this.props.usuarioId}/jornada-excecao-data-list`, {redirect403: false})
			.then((response) => {
				this.setState({
					dataList: response.data,
					errors: {},
					calling: false,
					refreshingDataList: false,
					});
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({dataList: [], calling: false, refreshingDataList: false});
					return;
				}
				this.openAlert("error", "Falha ao obter jornadas de exceção!");
				this.setState({calling: false, refreshingDataList: false});
			});
	}

	saveJornada() {
		let data = {
			usuarioId: this.props.usuarioId,
			data: this.state.data.format("YYYY-MM-DD"),
			registraPonto: this.state.registraPonto,
			entrada: this.state.jornadaEntrada !== null ? dayjs(this.state.jornadaEntrada).format("HH:mm:ss") : null,
			intervaloInicio: this.state.jornadaIntervaloInicio !== null ? dayjs(this.state.jornadaIntervaloInicio).format("HH:mm:ss") : null,
			intervaloFim: this.state.jornadaIntervaloFim !== null ? dayjs(this.state.jornadaIntervaloFim).format("HH:mm:ss") : null,
			saida: this.state.jornadaSaida !== null ? dayjs(this.state.jornadaSaida).format("HH:mm:ss") : null
		};

		this.setState({calling: true, saving: true});
		api.patch(`/jornada-excecao/patch-by-usuario-id-and-data`, data)
			.then((response) => {
				this.openAlert("success", `Exceção salva com sucesso!`);
				this.getJornadaExcecaoFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar exceção!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	addJornada() {
		let data = {
			usuarioId: this.props.usuarioId,
			data: this.state.data.format("YYYY-MM-DD"),
		};

		this.setState({calling: true, adicionando: true});
		api.post(`/jornada-excecao/create-by-usuario-id-and-data`, data)
			.then((response) => {
				this.openAlert("success", `Exceção adicionada com sucesso!`);
				this.getJornadaExcecaoFromApi();
				this.getDataListFromApi();
				this.setState({calling: false, adicionando: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao adicionar exceção!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, adicionando: false, errors: errors});
			})
	}

	deleteJornada() {
		let data = {
			usuarioId: this.props.usuarioId,
			data: this.state.data.format("YYYY-MM-DD"),
		};

		this.setState({calling: true, deletando: true});
		api.post(`/jornada-excecao/delete-by-usuario-id-and-data`, data)
			.then((response) => {
				this.openAlert("success", `Exceção deletada com sucesso!`);
				this.getJornadaExcecaoFromApi();
				this.getDataListFromApi();
				this.setState({calling: false, deletando: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao deletar exceção!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, deletando: false, errors: errors});
			})
	}

	getJornadaExcecaoFromApi() {
		if (this.state.data == null)
			return;
		this.setState({calling: true, refreshingJornadaExcecao: true});
		api.post(`/jornada-excecao/find-by-usuario-id-and-data`, {
			usuarioId: this.props.usuarioId,
			data: this.state.data.format("YYYY-MM-DD")
		}, {redirect403: false})
			.then((response) => {
				let jornadaExcecao = response.data;
				this.setState({
					jornadaExcecao: jornadaExcecao,
					jornadaEntrada: dayjs(jornadaExcecao.entrada, "HH:mm:ss"),
					jornadaIntervaloInicio: dayjs(jornadaExcecao.intervaloInicio, "HH:mm:ss"),
					jornadaIntervaloFim: dayjs(jornadaExcecao.intervaloFim, "HH:mm:ss"),
					jornadaSaida: dayjs(jornadaExcecao.saida, "HH:mm:ss"),
					registraPonto: jornadaExcecao.registraPonto,
					errors: {},
					calling: false,
					refreshingJornadaExcecao: false,
					});
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({jornadaExcecao: undefined, calling: false, refreshingJornadaExcecao: false});
					return;
				}
				if ("response" in err && err.response.status == 404) {
					console.log(1);
					this.setState({jornadaExcecao: null, calling: false, refreshingJornadaExcecao: false});
					return;
				}
				this.openAlert("error", "Falha ao obter jornada de exceção!");
				this.setState({calling: false, refreshingJornadaExcecao: false, jornadaExcecao: undefined});
			});
	}

	handleDayChange(newValue) {
		this.setState({data: dayjs(newValue), jornadaExcecao: undefined}, () => {
			this.getJornadaExcecaoFromApi();
		});
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
		this.getJornadaExcecaoFromApi();
	}

	render() {
	
		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", alignItems: "center"}}>
				<Grid container spacing={3}>
					<Grid item md={6} xs={12}>
						<DateCalendar
							loading={this.state.refreshingDataList}
							renderLoading={() => <DayCalendarSkeleton />}
							slots={{
								day: ServerDay,
							}}
							slotProps={{
								day: {
									dataList: this.state.dataList
								} 
							}}
							value={this.state.data}
							onChange={this.handleDayChange}
						/>
					</Grid>
					<Grid item xs>
						{this.state.data == null ? <Alert severity="warning">Selecione um dia</Alert>
						: (this.state.jornadaExcecao === undefined) ? <Box width="100%" display="flex" justifyContent="center"><CircularProgress/></Box>
						: (this.state.jornadaExcecao == null) ? <LoadingButton variant="contained" size="large" startIcon={<AddIcon />} loadingPosition="start" loading={this.state.adicionando} disabled={this.state.calling} onClick={this.addJornada}>Adicionar</LoadingButton>
						: 	<React.Fragment>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<ButtonGroup sx={{marginBottom: 3}}>
											<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveJornada}>Salvar</LoadingButton>
											<LoadingButton variant="contained" color="error" size="large" startIcon={<DeleteIcon />} loadingPosition="start" loading={this.state.deletando} disabled={this.state.calling} onClick={this.deleteJornada}>Deletar</LoadingButton>
										</ButtonGroup>
									</Grid>
									<Grid item xs={12}>
										<FormControl component="fieldset" variant="standard">
											<FormLabel component="legend">Registra Ponto</FormLabel>
											<FormGroup>
		      									<FormControlLabel control={<Switch checked={this.state.registraPonto} onChange={(e) => this.setState({registraPonto: e.target.checked})}/>} />
		      								</FormGroup>
		      							</FormControl>
									</Grid>
									<Grid item xs={6}>
										<TimePicker
											id="jornada-entrada"
											value={this.state.jornadaEntrada}
											onChange={(newValue) => this.setState({jornadaEntrada: newValue})}
											label="Entrada"
											slotProps={{
												field: { clearable: true },
												textField: {
													fullWidth: true,
													error: "entrada" in this.state.errors || "jornadaOrderValid" in this.state.errors,
													helperText: "entrada" in this.state.errors ? this.state.errors["entrada"] : "jornadaOrderValid" in this.state.errors ? this.state.errors["jornadaOrderValid"] : ""
												},
											}}
											variant="outlined"
											disabled={this.state.calling}
										/>
									</Grid>
									<Grid item xs={6}>
										<TimePicker
											id="jornada-intervalo-inicio"
											value={this.state.jornadaIntervaloInicio}
											onChange={(newValue) => this.setState({jornadaIntervaloInicio: newValue})}
											label="Início do Intervalo"
											slotProps={{
												field: { clearable: true },
												textField: {
													fullWidth: true,
													error: "intervaloInicio" in this.state.errors,
													helperText: "intervaloInicio" in this.state.errors ? this.state.errors["intervaloInicio"] : ""
												},
											}}
											variant="outlined"
											disabled={this.state.calling}
										/>
									</Grid>
									<Grid item xs={6}>
										<TimePicker
											id="jornada-intervalo-fim"
											value={this.state.jornadaIntervaloFim}
											onChange={(newValue) => this.setState({jornadaIntervaloFim: newValue})}
											label="Fim do Intervalo"
											slotProps={{
												field: { clearable: true },
												textField: {
													fullWidth: true,
													error: "intervaloFim" in this.state.errors,
													helperText: "intervaloFim" in this.state.errors ? this.state.errors["intervaloFim"] : ""
												},
											}}
											variant="outlined"
											disabled={this.state.calling}
										/>
									</Grid>
									<Grid item xs={6}>
										<TimePicker
											id="jornada-saida"
											value={this.state.jornadaSaida}
											onChange={(newValue) => this.setState({jornadaSaida: newValue})}
											label="Saída"
											slotProps={{
												field: { clearable: true },
												textField: {
													fullWidth: true,
													error: "saida" in this.state.errors,
													helperText: "saida" in this.state.errors ? this.state.errors["saida"] : ""
												},
											}}
											variant="outlined"
											disabled={this.state.calling}
										/>
									</Grid>
								</Grid>
							</React.Fragment>
						}
					</Grid>
				</Grid>
				<Collapse in={this.state.alertOpen}>
					{this.state.alert}
				</Collapse>
			</Box>
		  );
	}

}