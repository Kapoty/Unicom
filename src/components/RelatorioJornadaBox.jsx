import React from "react";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { TimePicker } from '@mui/x-date-pickers-pro';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers-pro';
import Stack from '@mui/material/Stack';
import DescriptionIcon from '@mui/icons-material/Description';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';
import InfoIcon from '@mui/icons-material/Info';

import CPFInput from "./CPFInput";
import CustomDataGridPremium from "./CustomDataGridPremium";

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import api from "../services/api";

import {DurationInput, durationToSeconds, secondsToDuration} from "./DurationInput";

export default class RelatorioJornadaBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

			report: null,

			calling: false,
			generating: false,

			data: dayjs(),

			dayRows: [],

			totalHoraExtra: 0,
			totalDiasTrabalhados: 0,
			totalFaltas: 0,
			totalFolgas: 0,
			totalAtestados: 0,
			totalAtestadosNaoTrabalhados: 0,

			rowSelected: null,

			contratoList: null,
			contratoByContratoId: null,

			calling: false,
			saving: false,
			adicionando: false,
			deletando: false,

			contratoId: null,
			jornadaEntrada: null,
			jornadaIntervaloInicio: null,
			jornadaIntervaloFim: null,
			jornadaSaida: null,
			justificativa: null,
			horasTrabalhadas: null,
			entrada: null,
			saida: null,
			horaExtraPermitida: null,
			observacao: null,
			ajusteHoraExtra: null,
			aprovada: null,

			horasNaoTrabalhadas: "",
			horaExtra: "",
			horasATrabalhar: "",

			correcaoAlertOpen: false,
			correcaoAlert: false,
			errors: {},

			alertOpen: false,
			alert: null,

			correcaoDialogOpen: false,
			informacoesDialogOpen: false,

			
		}

		this.columns = [
			{ field: 'data', headerName: "DATA", renderCell: (params) => {
				return <Box sx={{fontWeight: (params.row.data.day() == 0 || params.row.data.day() == 6) ? "bold" : "regular", color: (params.row.data.day() == 0 || params.row.data.day() == 6) ? (theme) => theme.palette.info.light : "white"}}>{params.row.data.format("DD/MM/YYYY")}</Box>
			}, minWidth: 50 },
			{ field: 'entrada', headerName: 'ENTRADA', minWidth: 100, flex: 1 },
			{ field: 'horasTrabalhadas', headerName: 'HORAS TRABALHADAS', minWidth: 200, flex: 1 },
			{ field: 'horasNaoTrabalhadas', headerName: 'INTERVALOS', minWidth: 200, flex: 1 },
			{ field: 'saida', headerName: 'SAIDA', minWidth: 100, flex: 1, renderCell: (params) =>
				<Badge color="warning" variant="dot" invisible={params.value != "23:55" || params.row.correcao == "Aprovada"}>
					<Box sx={{alignItems: "center", display: "flex", height: "30px"}}>
						{params.value}
					</Box>
				</Badge> },
			{ field: 'horaExtra', headerName: 'HORA EXTRA', minWidth: 100, flex: 1, renderCell: (params) =>
				<Badge color="warning" variant="dot" invisible={params.value >= 0 || params.row.correcao == "Aprovada"}>
					<Box sx={{alignItems: "center", display: "flex", height: "30px"}}>
						{params.value !=0 && dayjs.duration(params.value, 'seconds').format('HH[h]mm[m]')}
					</Box>
				</Badge> },
			{ field: 'observacao', headerName: 'OBSERVAÇÃO', minWidth: 300, flex: 1 },
			{ field: 'correcao', headerName: 'CORREÇÃO', minWidth: 120, renderCell: (params) =>
				params.value == "Não" ? <IconButton disabled={this.state.calling} onClick={() => {this.setState({rowSelected: params.row.day}, () => this.addCorrecao())}}><AddIcon /></IconButton> :
				<Chip onClick={() => this.setState({rowSelected: params.row.day, correcaoDialogOpen: true}, () => this.setCorrecaoFieldsFromRowSelected())} label={params.value} color={params.value == "Aprovada" ? "success" : params.value == "Em análise" ? "warning" : "info"} />,
			},
			{ field: 'info', headerName: 'INFO', renderCell: (params) => <IconButton disabled={params.row.day.registroJornada == null} onClick={() => this.setState({rowSelected: params.row.day, informacoesDialogOpen: true})}><InfoIcon/></IconButton>},
		];

		this.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

		this.observacaoList = [
			{
				value: "HORAS_DEVIDAS_PAGAS",
				nome: "Horas Devidas Pagas",
				ajusteHoraExtra: true,
			},
			{
				value: "ATESTADO_MEDICO",
				nome: "Atestado Médico",
				ajusteHoraExtra: true,
			},
			{
				value: "FALTA_NAO_JUSTIFICADA",
				nome: "Falta Não Justificada",
				ajusteHoraExtra: false,
			},
			{
				value: "FOLGA_CONCEDIDA",
				nome: "Folga Concedida",
				ajusteHoraExtra: true,
			},
			{
				value: "HOME_OFFICE",
				nome: "Home Office",
				ajusteHoraExtra: false,
			},
			{
				value: "SUSPENSO",
				nome: "Suspenso",
				ajusteHoraExtra: false,
			},
			{
				value: "DESLIGAMENTO",
				nome: "Desligamento",
				ajusteHoraExtra: false,
			},
			{
				value: "PRESENTE",
				nome: "Presente",
				ajusteHoraExtra: false,
			},
		]
		this.observacaoByValue = {};
		this.observacaoList.forEach((observacao) => this.observacaoByValue[observacao.value] = observacao);

		this.usuarioId = this.props.usuarioId;

		this.getReportFromApi = this.getReportFromApi.bind(this);
		this.saveCorrecao = this.saveCorrecao.bind(this);
		this.addCorrecao = this.addCorrecao.bind(this);
		this.deleteCorrecao = this.deleteCorrecao.bind(this);
		this.getCorrecaoFromApi = this.getCorrecaoFromApi.bind(this);

		this.handleRowSelected = this.handleRowSelected.bind(this);
		this.calculateRows = this.calculateRows.bind(this);
		this.setCorrecaoFieldsFromRowSelected = this.setCorrecaoFieldsFromRowSelected.bind(this);
		this.calculateCorrecaoDerivedFields = this.calculateCorrecaoDerivedFields.bind(this);

		this.folhaPontoRef = React.createRef();

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);

		this.openCorrecaoAlert = this.openCorrecaoAlert.bind(this);
		this.closeCorrecaoAlert = this.closeCorrecaoAlert.bind(this);
	}

	componentDidMount() {
		this.getContratoListFromApi();
	}

	getContratoListFromApi() {
		api.get("/empresa/me/contrato")
			.then((response) => {
				let contratoList = response.data;
				let contratoByContratoId = {};
				contratoList.forEach((contrato) => contratoByContratoId[contrato.contratoId] = contrato);
				this.setState({contratoList: contratoList, contratoByContratoId: contratoByContratoId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getContratoListFromApi, 3000);
			});
	}


	getReportFromApi() {
		this.setState({calling: true, generating: true, report: null, rowSelected: null});
		api.post(`/registro-jornada/${this.usuarioId}/report`, {
			ano: this.state.data.year(),
			mes: this.state.data.month() + 1,
		}, {redirect403: false})
			.then((response) => {
				let report = response.data;
				this.setState({
					report: report,
					errors: {},
					calling: false,
					generating: false,
					}, () => {
						this.calculateRows();
					});
			})
			.catch((err) => {
				console.log(err);
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({report: null, calling: false, generating: false});
					return;
				}
				this.openAlert("error", "Falha ao gerar relatório!");
				this.setState({calling: false, generating: false});
			});
	}

	calculateRows() {
		if (this.state.report == null)
			return;

		let dayRows = [];

		let totalHoraExtra = 0;
		let totalDiasTrabalhados = 0;
		let totalFaltas = 0;
		let totalFolgas = 0;
		let totalAtestados = 0;
		let totalAtestadosNaoTrabalhados = 0;

		this.state.report.dayList.forEach((day) => {
			let dayRow = {
				id: day.data,
				day: day,
				data: dayjs(day.data),
				entrada: "",
				horasTrabalhadas: "",
				horasNaoTrabalhadas: "",
				saida: "",
				horaExtra: 0,
				observacao: "",
				correcao: "Não"
			};

			let horaExtra = 0;
			let intervaloEntradaSaida = 0;
			let horasATrabalhar = 0;
			let horasIntervalo = 0;
			let horasJornada = 0;
			let horasNaoTrabalhadas = 0;
			let horasTrabalhadas = 0;
			let horaExtraFinal = 0;
			let diaTrabalhado = false;

			if (day.registroJornadaCorrecao == null || !day.registroJornadaCorrecao.aprovada) {

				if (day.registroJornadaCorrecao !== null)
					dayRow.correcao = "Em análise";

				if (day.registroJornada !== null && day.entrada !== null) {

					dayRow.entrada = dayjs(day.entrada, "HH:mm:ss").format('HH:mm');
					if (day.saida !== null) {
						diaTrabalhado = true;
						dayRow.saida = dayjs(day.saida, "HH:mm:ss").format('HH:mm');
					}

					if (day.horasTrabalhadas !== null) {

						dayRow.horasTrabalhadas = dayjs.duration(day.horasTrabalhadas, 'seconds').format('HH[h]mm[m]');

						if (day.saida !== null) {

							horaExtra = this.calculateHoraExtra(day.horasTrabalhadas, day.horasATrabalhar);

							if (day.registroJornada.horaExtraPermitida)
								horaExtraFinal = horaExtra;
							else
								horaExtraFinal = Math.min(0, horaExtra);

								dayRow.horaExtra = horaExtraFinal;

						}

					}

					if (day.horasNaoTrabalhadas !== null)
						dayRow.horasNaoTrabalhadas = dayjs.duration(day.horasNaoTrabalhadas, 'seconds').format('HH[h]mm[m]')

				}
			} else if (day.registroJornadaCorrecao.jornadaEntrada == null) {
				diaTrabalhado = false;
				dayRow.correcao = "Aprovada";
			} else {
				dayRow.observacao = day.registroJornadaCorrecao.observacao !== null ? this.observacaoByValue[day.registroJornadaCorrecao.observacao].nome : "";
				dayRow.correcao = "Aprovada";

				if (day.registroJornadaCorrecao.entrada !== null && day.registroJornadaCorrecao.saida !== null) {
					dayRow.entrada = dayjs(day.registroJornadaCorrecao.entrada, "HH:mm:ss").format('HH:mm');
					dayRow.saida = dayjs(day.registroJornadaCorrecao.saida, "HH:mm:ss").format('HH:mm');
					dayRow.horasTrabalhadas =  dayjs.duration(day.registroJornadaCorrecao.horasTrabalhadas, 'seconds').format('HH[h]mm[m]');
					intervaloEntradaSaida = this.calculateIntervaloEntradaSaida(dayjs(day.registroJornadaCorrecao.saida, "HH:mm:ss"), dayjs(day.registroJornadaCorrecao.entrada, "HH:mm:ss"));//dayjs(day.registroJornadaCorrecao.saida, "HH:mm:ss").diff(dayjs(day.registroJornadaCorrecao.entrada, "HH:mm:ss"), 'second');
					horasNaoTrabalhadas = this.calculateHorasNaoTrabalhadas(intervaloEntradaSaida, day.registroJornadaCorrecao.horasTrabalhadas);
					dayRow.horasNaoTrabalhadas = dayjs.duration(horasNaoTrabalhadas, 'seconds').format('HH[h]mm[m]');

					diaTrabalhado = true;
				}

				horasJornada = this.calculateHorasJornada(dayjs(day.registroJornadaCorrecao.jornadaSaida, "HH:mm:ss"), dayjs(day.registroJornadaCorrecao.jornadaEntrada, "HH:mm:ss"));
				horasIntervalo = this.calculateHorasIntervalo(dayjs(day.registroJornadaCorrecao.jornadaIntervaloFim, "HH:mm:ss"), dayjs(day.registroJornadaCorrecao.jornadaIntervaloInicio, "HH:mm:ss"));
				horasATrabalhar = this.calculateHorasATrabalhar(horasJornada, horasIntervalo);
				horaExtra = this.calculateHoraExtra(day.registroJornadaCorrecao.horasTrabalhadas, horasATrabalhar);

				switch(day.registroJornadaCorrecao.observacao) {
					case "HORAS_DEVIDAS_PAGAS":
						horaExtra += day.registroJornadaCorrecao.ajusteHoraExtra;
					break;
					case "ATESTADO_MEDICO":
						horaExtra += day.registroJornadaCorrecao.ajusteHoraExtra;
					break;
					case "FALTA_NAO_JUSTIFICADA":
						totalFaltas += 1;
					break;
					case "FOLGA_CONCEDIDA":
						horaExtra += day.registroJornadaCorrecao.ajusteHoraExtra;
						totalFolgas += 1;
					break;
					case "HOME_OFFICE":
						horaExtra = 0;
						diaTrabalhado = true;
					break;
					case "SUSPENSO":
						//pass
					break;
					case "DESLIGAMENTO":
						horaExtra = 0;
					break;
					case "PRESENTE":
						horaExtra = 0;
						diaTrabalhado = true;
					break;
				}

				if (day.registroJornadaCorrecao.observacao == "ATESTADO_MEDICO") {
					totalAtestados += 1;
					if (!diaTrabalhado)
						totalAtestadosNaoTrabalhados += 1;
				}

				if (day.registroJornadaCorrecao.horaExtraPermitida)
					horaExtraFinal = horaExtra;
				else
					horaExtraFinal = Math.min(0, horaExtra);

					dayRow.horaExtra = horaExtraFinal;
			}

			totalHoraExtra += horaExtraFinal;

			if (diaTrabalhado)
				totalDiasTrabalhados += 1;

			dayRows.push(dayRow);
		});

		this.setState({
			dayRows: dayRows,
			totalHoraExtra: totalHoraExtra,
			totalDiasTrabalhados: totalDiasTrabalhados,
			totalFaltas: totalFaltas,
			totalFolgas: totalFolgas,
			totalAtestados: totalAtestados,
			totalAtestadosNaoTrabalhados: totalAtestadosNaoTrabalhados,
		});
	}

	handleRowSelected(row) {
		let rowSelected = null;
		if (row.length > 0) 
			rowSelected = this.state.report.dayList.filter((day) => day.data == row[0])[0];
		this.setState({
			rowSelected: rowSelected,
		}, () => {
			this.setCorrecaoFieldsFromRowSelected();
		})
	}

	setCorrecaoFieldsFromRowSelected() {
		if (this.state.rowSelected == null || this.state.rowSelected.registroJornadaCorrecao == null)
			return
		let registroJornadaCorrecao = this.state.rowSelected.registroJornadaCorrecao;
		this.setState({
			jornadaEntrada: registroJornadaCorrecao.jornadaEntrada !== null ? dayjs(registroJornadaCorrecao.jornadaEntrada, "HH:mm:ss") : null,
			jornadaIntervaloInicio: registroJornadaCorrecao.jornadaIntervaloInicio !== null ? dayjs(registroJornadaCorrecao.jornadaIntervaloInicio, "HH:mm:ss") : null,
			jornadaIntervaloFim: registroJornadaCorrecao.jornadaIntervaloFim !== null ? dayjs(registroJornadaCorrecao.jornadaIntervaloFim, "HH:mm:ss") : null,
			jornadaSaida: registroJornadaCorrecao.jornadaSaida !== null ? dayjs(registroJornadaCorrecao.jornadaSaida, "HH:mm:ss") : null,
			contratoId: registroJornadaCorrecao.contratoId !== null ? registroJornadaCorrecao.contratoId : "",
			justificativa: registroJornadaCorrecao.justificativa,
			horasTrabalhadas: secondsToDuration(registroJornadaCorrecao.horasTrabalhadas),
			entrada: registroJornadaCorrecao.entrada !== null ? dayjs(registroJornadaCorrecao.entrada, "HH:mm:ss") : null,
			saida: registroJornadaCorrecao.saida !== null ? dayjs(registroJornadaCorrecao.saida, "HH:mm:ss") : null,
			horaExtraPermitida: registroJornadaCorrecao.horaExtraPermitida,
			observacao: registroJornadaCorrecao.observacao !== null ? registroJornadaCorrecao.observacao : "",
			ajusteHoraExtra: secondsToDuration(registroJornadaCorrecao.ajusteHoraExtra),
			aprovada: registroJornadaCorrecao.aprovada,
		}, () => {
			this.calculateCorrecaoDerivedFields();
		})
	}

	calculateHorasIntervalo(jornadaIntervaloFim, jornadaIntervaloInicio) {
		if (!jornadaIntervaloFim || !jornadaIntervaloInicio)
			return 0;
		return jornadaIntervaloFim.diff(jornadaIntervaloInicio, 'second');
	}

	calculateHorasJornada(jornadaSaida, jornadaEntrada) {
		if (!jornadaSaida || !jornadaEntrada)
			return 0;
		return jornadaSaida.diff(jornadaEntrada, 'second');
	}

	calculateHorasATrabalhar(horasJornada, horasIntervalo) {
		return horasJornada - horasIntervalo;
	}

	calculateHorasNaoTrabalhadas(intervaloEntradaSaida, horasTrabalhadas) {
		return intervaloEntradaSaida - horasTrabalhadas;
	}

	calculateHoraExtra(horasTrabalhadas, horasATrabalhar) {
		let horaExtra =  horasTrabalhadas - horasATrabalhar;
		if (Math.abs(horaExtra) <= 600)
			horaExtra = 0;
		return horaExtra;
	}

	calculateIntervaloEntradaSaida(saida, entrada) {
		if (!saida || !entrada)
			return 0;
		return saida.diff(entrada, 'second');
	}

	calculateCorrecaoDerivedFields() {
		let horasATrabalhar = 0;
		let horaExtra = 0;
		let horasNaoTrabalhadas = 0;
		let horasIntervalo = 0;
		let horasJornada = 0;
		let intervaloEntradaSaida = 0;

		try {
			horasIntervalo = this.calculateHorasIntervalo(this.state.jornadaIntervaloFim, this.state.jornadaIntervaloInicio);
			horasJornada = this.calculateHorasJornada(this.state.jornadaSaida, this.state.jornadaEntrada);
			horasATrabalhar = this.calculateHorasATrabalhar(horasJornada, horasIntervalo);
		} catch (e) {
		}

		try {
			horaExtra = this.calculateHoraExtra(durationToSeconds(this.state.horasTrabalhadas), horasATrabalhar);
		} catch (e) {
		}

		try {
			intervaloEntradaSaida = this.calculateIntervaloEntradaSaida(this.state.saida, this.state.entrada);
			horasNaoTrabalhadas = this.calculateHorasNaoTrabalhadas(intervaloEntradaSaida, durationToSeconds(this.state.horasTrabalhadas));
		} catch (e) {
		}

		this.setState({
			horasATrabalhar: dayjs.duration(horasATrabalhar, 'seconds').format("HH[h]mm[m]"),
			horaExtra: dayjs.duration(horaExtra, 'seconds').format("HH[h]mm[m]"),
			horasNaoTrabalhadas: dayjs.duration(horasNaoTrabalhadas, 'seconds').format("HH[h]mm[m]"),
		})
		
	}

	saveCorrecao() {
		let data = {
			usuarioId: this.usuarioId,
			data: this.state.rowSelected.data,
			jornadaEntrada: this.state.jornadaEntrada !== null ? dayjs(this.state.jornadaEntrada).format("HH:mm:ss") : null,
			jornadaIntervaloInicio: this.state.jornadaIntervaloInicio !== null ? dayjs(this.state.jornadaIntervaloInicio).format("HH:mm:ss") : null,
			jornadaIntervaloFim: this.state.jornadaIntervaloFim !== null ? dayjs(this.state.jornadaIntervaloFim).format("HH:mm:ss") : null,
			jornadaSaida: this.state.jornadaSaida !== null ? dayjs(this.state.jornadaSaida).format("HH:mm:ss") : null,
			contratoId: this.state.contratoId != "" ? this.state.contratoId : null,
			justificativa: this.state.justificativa,
			horasTrabalhadas:  durationToSeconds(this.state.horasTrabalhadas),
			entrada: this.state.entrada !== null ? dayjs(this.state.entrada).format("HH:mm:ss") : null,
			saida: this.state.saida !== null ? dayjs(this.state.saida).format("HH:mm:ss") : null,
			horaExtraPermitida: this.state.horaExtraPermitida,
			observacao: this.state.observacao != "" ? this.state.observacao : null,
			ajusteHoraExtra: durationToSeconds(this.state.ajusteHoraExtra),
			aprovada: this.state.aprovada,
		};

		this.setState({calling: true, saving: true});
		api.patch(`/registro-jornada-correcao/patch-by-usuario-id-and-data`, data, {redirect403: false})
			.then((response) => {
				this.openCorrecaoAlert("success", `Correção salva com sucesso!`);
				this.getCorrecaoFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors;
				if (errors) {
					errors = err.response.data.errors;
					this.openCorrecaoAlert("error", "Falha ao salvar correção!");
				}
				else
					this.openCorrecaoAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors ?? {}});
			})
	}

	addCorrecao() {
		let data = {
			usuarioId: this.usuarioId,
			data: this.state.rowSelected.data,
		};

		this.setState({calling: true, adicionando: true});
		api.post(`/registro-jornada-correcao/create-by-usuario-id-and-data`, data, {redirect403: false})
			.then((response) => {
				this.openCorrecaoAlert("success", `Correção adicionada com sucesso!`);
				this.getCorrecaoFromApi();
				this.setState({calling: false, adicionando: false, errors: {}, correcaoDialogOpen: true});
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors;
				if (errors) {
					errors = err.response.data.errors;
					this.openCorrecaoAlert("error", "Falha ao adicionar correção!");
				}
				else
					this.openCorrecaoAlert("error", "Erro inesperado");
				this.setState({calling: false, adicionando: false, errors: errors ?? {}});
			})
	}

	deleteCorrecao() {
		let data = {
			usuarioId: this.usuarioId,
			data: this.state.rowSelected.data,
		};

		this.setState({calling: true, deletando: true});
		api.post(`/registro-jornada-correcao/delete-by-usuario-id-and-data`, data, {redirect403: false})
			.then((response) => {
				this.openCorrecaoAlert("success", `Correção deletada com sucesso!`);
				this.getCorrecaoFromApi();
				this.setState({calling: false, deletando: false, errors: {}});
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors;
				if (errors) {
					errors = err.response.data.errors;
					this.openCorrecaoAlert("error", "Falha ao deletar correção!");
				}
				else
					this.openCorrecaoAlert("error", "Erro inesperado");
				this.setState({calling: false, deletando: false, errors: errors ?? {}});
			})
	}

	getCorrecaoFromApi() {
		if (this.state.rowSelected == null)
			return;
		this.setState({calling: true});
		api.post(`/registro-jornada-correcao/find-by-usuario-id-and-data`, {
			usuarioId: this.usuarioId,
			data: this.state.rowSelected.data
		}, {redirect403: false})
			.then((response) => {
				let registroJornadaCorrecao = response.data;
				let rowSelected = this.state.rowSelected;
				rowSelected.registroJornadaCorrecao = registroJornadaCorrecao;
				this.setState({
					rowSelected: rowSelected,
					errors: {},
					calling: false,
				}, () => {
					this.calculateRows();
					this.setCorrecaoFieldsFromRowSelected();
				});
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.openCorrecaoAlert("error", "Não permitido!");
					this.setState({calling: false});
					return;
				}
				if ("response" in err && err.response.status == 404) {
					let rowSelected = this.state.rowSelected;
					rowSelected.registroJornadaCorrecao = null;
					this.setState({rowSelected: rowSelected, calling: false}, () => {
						this.calculateRows();
					});
					return;
				}
				this.openCorrecaoAlert("error", "Falha ao obter correção!");
				this.setState({calling: false});
			});
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	openCorrecaoAlert(severity, message) {
		this.setState({correcaoAlert: <Alert severity={severity} onClose={this.closeCorrecaoAlert}>{message}</Alert>, correcaoAlertOpen: true});
	}

	closeCorrecaoAlert() {
		this.setState({correcaoAlertOpen: false});
	}

	render() {
	
		return (
			<Box sx={{display: "flex", flexDirection: "column", justifyContent: "start", gap: 3, height: "100%"}}>
				<Stack direction="row" gap={3} justifyContent="center" alignItems="center">
					<DatePicker
						label="Período"
						value={this.state.data}
						views={['month', 'year']}
						onChange={(newValue) => this.setState({data: newValue})}
					/>
					<LoadingButton variant="contained" size="large" startIcon={<DescriptionIcon />} loadingPosition="start" loading={this.state.generating} disabled={this.state.calling} onClick={this.getReportFromApi}>Gerar Folha</LoadingButton>
					<ReactToPrint content={() => this.folhaPontoRef.current}>
						<PrintContextConsumer>
							{({ handlePrint }) => (
								<Tooltip title="Imprimir">
									<span>
										<IconButton sx={{color: "#FFFFFF"}} onClick={handlePrint} disabled={this.state.report == null}>
											<Icon>printer</Icon>
										</IconButton>
									</span>
								</Tooltip>
							)}
						</PrintContextConsumer>
					</ReactToPrint>
				</Stack>
				<Divider/>
				{this.state.report == null ? <Alert severity="warning">Nenhum dado para mostrar</Alert> :
					<React.Fragment>
						<Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, gap: 3}}>
							{/*<Typography variant="h4" align="center">
								FOLHA DE PONTO - PERÍODO: {this.meses[this.state.report.mes - 1].toUpperCase()}/{this.state.report.ano}
							</Typography>*/}
							<Typography variant="h5" align="left">
								Empregado(a)
							</Typography>
							<form onSubmit={(e) => e.preventDefault()} disabled={true}>
								<Grid container spacing={3}>
									<Grid item xs={6}>
										<TextField
											id="nome"
											value={this.state.report.usuario.nomeCompleto}
											fullWidth
											label="Nome"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={6}>
										<CPFInput
											id="cpf"
											value={this.state.report.usuario.cpf !== null ? this.state.report.usuario.cpf : ""}
											fullWidth
											label="CPF"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											id="cargo"
											value={this.state.report.usuario.cargo !== null ? this.state.report.usuario.cargo.nome : ""}
											fullWidth
											label="Cargo"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											id="ctps"
											value={""}
											fullWidth
											label="CTPS"
											variant="outlined"
										/>
									</Grid>
								</Grid>
							</form>
							<Box sx={{ flexGrow: 1, height: "1px", minHeight: "400px" }}>
								<CustomDataGridPremium
									rows={this.state.dayRows}
									columns={this.columns}
									disableColumnFilter
									disableColumnMenu
									disableColumnSelector
									disableColumnSorting
									initialState={{
									    pagination: { paginationModel: { pageSize: 31 } },
									  }}
									pagination
									pageSizeOptions={[5, 10, 15, 20, 25, 30, 31]}
									/*onRowSelectionModelChange={this.handleRowSelected}
									rowSelectionModel={[this.state.rowSelected?.data ?? -1]}*/
									disableRowSelectionOnClick
								/>
							</Box>
							<Typography variant="h5" align="left">
								Totais
							</Typography>
							<form onSubmit={(e) => e.preventDefault()} disabled={true}>
								<Grid container spacing={3}>
									<Grid item xs={2}>
										<TextField
											id="total-hora-extra"
											value={dayjs.duration(this.state.totalHoraExtra, 'seconds').format("HH[h]mm[m]")}
											fullWidth
											label="Hora Extra"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={2}>
										<TextField
											id="total-dias-trabalhados"
											value={this.state.totalDiasTrabalhados}
											fullWidth
											label="Dias Trabalhados"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={2}>
										<TextField
											id="faltas"
											value={this.state.totalFaltas}
											fullWidth
											label="Faltas"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={2}>
										<TextField
											id="total-folgas"
											value={this.state.totalFolgas}
											fullWidth
											label="Folgas"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={2}>
										<TextField
											id="total-atestados"
											value={this.state.totalAtestados}
											fullWidth
											label="Atestados"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={2}>
										<TextField
											id="total-atestados-nao-trabalhados"
											value={this.state.totalAtestadosNaoTrabalhados}
											fullWidth
											label="Atestados (em dias não trabalhados)"
											variant="outlined"
										/>
									</Grid>
								</Grid>
							</form>
							{this.state.informacoesDialogOpen && 
								<Dialog
									fullWidth={true}
				        			maxWidth={"lg"}
									onClose={() => this.setState({informacoesDialogOpen: false})}
									open={this.state.informacoesDialogOpen}
								>
				      				<DialogTitle>Informações - {dayjs(this.state.rowSelected.data, "YYYY-MM-DD").format("DD/MM/YYYY")}</DialogTitle>
				      				<IconButton
										onClick={() => this.setState({informacoesDialogOpen: false})}
										sx={{
											position: 'absolute',
												right: 8,
											top: 8,
											color: (theme) => theme.palette.grey[500],
										}}
									>
									<CloseIcon />
									</IconButton>
				      				<DialogContent dividers>
				      					
				      					<Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
											{this.state.rowSelected.registroJornada == null ? <Alert severity="warning">Sem Registro</Alert> :
												<Paper elevation={2} sx={{padding: 3, gap: 3, display: "flex", flexDirection: "column"}}>
													<Stack gap={3} direction="row" justifyContent="center">
														<Typography color={green[400]} gutterBottom align="center">
															{dayjs(this.state.rowSelected.registroJornada.jornadaEntrada, "HH:mm:ss").format("HH:mm")}
														</Typography>
														<Typography color={yellow[400]} gutterBottom align="center">
															{dayjs(this.state.rowSelected.registroJornada.jornadaIntervaloInicio, "HH:mm:ss").format("HH:mm")}
														</Typography>
														<Typography color={blue[400]} gutterBottom align="center">
															{dayjs(this.state.rowSelected.registroJornada.jornadaIntervaloFim, "HH:mm:ss").format("HH:mm")}
														</Typography>
														<Typography color={red[400]} gutterBottom align="center">
															{dayjs(this.state.rowSelected.registroJornada.jornadaSaida, "HH:mm:ss").format("HH:mm")}
														</Typography>
													</Stack>
													<Divider/>
													{(this.state.rowSelected.statusGroupedList !== null) ? this.state.rowSelected.statusGroupedList.map(status =>
														<Typography key={status.jornadaStatusId}>
															{status.nome}: {dayjs.duration(status.duracao, 'seconds').format('HH[h]mm[m]')} {status.maxDuracao !== null && status.maxUso !== null && status.duracao > status.maxDuracao * status.maxUso ? ` (-${dayjs.duration(status.duracao - status.maxDuracao * status.maxUso, 'seconds').minutes()}m)` : ""}
														</Typography>) : ""}
													<Divider/>
													<Grid container spacing={3}>
														<Grid item xs={6}>
															<TextField
																value={this.state.rowSelected.entrada !== null ? dayjs(this.state.rowSelected.entrada, "HH:mm:ss").format("HH:mm") : ""}
																fullWidth
																label="Entrada"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={this.state.rowSelected.saida !== null ? dayjs(this.state.rowSelected.saida, "HH:mm:ss").format("HH:mm") : ""}
																fullWidth
																label="Saída"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={dayjs.duration(this.state.rowSelected.horasATrabalhar, 'seconds').format("HH[h]mm[m]")}
																fullWidth
																label="Horas a Trabalhar"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={dayjs.duration(this.state.rowSelected.horasTrabalhadas, 'seconds').format("HH[h]mm[m]")}
																fullWidth
																label="Horas Trabalhadas"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={dayjs.duration(this.state.rowSelected.horasNaoTrabalhadas, 'seconds').format("HH[h]mm[m]")}
																fullWidth
																label="Intervalos"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={dayjs.duration(this.calculateHoraExtra(this.state.rowSelected.horasTrabalhadas,this.state.rowSelected.horasATrabalhar), 'seconds').format("HH[h]mm[m]")}
																fullWidth
																label="Hora Extra"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={this.state.rowSelected.registroJornada.contrato !== null ? this.state.rowSelected.registroJornada.contrato.nome : ""}
																fullWidth
																label="Contrato"
																variant="outlined"
																disabled
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																value={this.state.rowSelected.registroJornada.horaExtraPermitida ? "Sim" : "Não"}
																fullWidth
																label="Hora Extra Permitida"
																variant="outlined"
																disabled
															/>
														</Grid>
													</Grid>
												</Paper>
											}
										</Box>

									</DialogContent>
								</Dialog>}
								{this.state.correcaoDialogOpen && 
									<Dialog
										fullWidth={true}
					        			maxWidth={"lg"}
										onClose={() => this.setState({correcaoDialogOpen: false})}
										open={this.state.correcaoDialogOpen}
									>
					      				<DialogTitle>Correção - {dayjs(this.state.rowSelected.data, "YYYY-MM-DD").format("DD/MM/YYYY")}</DialogTitle>
					      				<IconButton
											onClick={() => this.setState({correcaoDialogOpen: false})}
											sx={{
												position: 'absolute',
													right: 8,
												top: 8,
												color: (theme) => theme.palette.grey[500],
											}}
										>
											<CloseIcon />
										</IconButton>
					      				<DialogContent dividers>
					      					<Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
												<Grid container spacing={3}>
													{this.state.rowSelected.registroJornadaCorrecao == null ? 
														<Grid item xs={12}>
															<LoadingButton variant="contained" size="large" startIcon={<AddIcon />} loadingPosition="start" loading={this.state.adicionando} disabled={this.state.calling} onClick={this.addCorrecao}>Adicionar Correção</LoadingButton>
														</Grid> : <React.Fragment>
														<Grid item xs={12}>
															<ButtonGroup sx={{marginBottom: 3}}>
																<LoadingButton variant="contained" color="error" size="large" startIcon={<DeleteIcon />} loadingPosition="start" loading={this.state.deletando} disabled={(this.state.aprovada && this.props.me) || this.state.calling} onClick={this.deleteCorrecao}>Deletar</LoadingButton>
																<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={(this.state.aprovada && this.props.me) || this.state.calling} onClick={this.saveCorrecao}>Salvar</LoadingButton>
															</ButtonGroup>
														</Grid>
														<Grid item xs={3}>
															<TimePicker
																id="jornada-entrada"
																value={this.state.jornadaEntrada}
																onChange={(newValue) => {this.setState({jornadaEntrada: newValue}, () => this.calculateCorrecaoDerivedFields())}}
																label="Jornada - Entrada"
																slotProps={{
																	field: { clearable: true },
																	textField: {
																		fullWidth: true,
																		error: "jornadaEntrada" in this.state.errors || "jornadaOrder" in this.state.errors,
																		helperText: "jornadaEntrada" in this.state.errors ? this.state.errors["jornadaEntrada"] : "jornadaOrder" in this.state.errors ? this.state.errors["jornadaOrder"] : ""
																	},
																}}
																variant="outlined"
																disabled={(this.state.aprovada && this.props.me) || this.state.calling}
															/>
														</Grid>
														<Grid item xs={3}>
															<TimePicker
																id="jornada-intervalo-inicio"
																value={this.state.jornadaIntervaloInicio}
																onChange={(newValue) => {this.setState({jornadaIntervaloInicio: newValue}, () => this.calculateCorrecaoDerivedFields())}}
																label="Jornada - Início do Intervalo"
																slotProps={{
																	field: { clearable: true },
																	textField: {
																		fullWidth: true,
																		error: "jornadaIntervaloInicio" in this.state.errors,
																		helperText: "jornadaIntervaloInicio" in this.state.errors ? this.state.errors["jornadaIntervaloInicio"] : ""
																	},
																}}
																variant="outlined"
																disabled={(this.state.aprovada && this.props.me) || this.state.calling}
															/>
														</Grid>
														<Grid item xs={3}>
															<TimePicker
																id="jornada-intervalo-fim"
																value={this.state.jornadaIntervaloFim}
																onChange={(newValue) => {this.setState({jornadaIntervaloFim: newValue}, () => this.calculateCorrecaoDerivedFields())}}
																label="Jornada - Fim do Intervalo"
																slotProps={{
																	field: { clearable: true },
																	textField: {
																		fullWidth: true,
																		error: "jornadaIntervaloFim" in this.state.errors,
																		helperText: "jornadaIntervaloFim" in this.state.errors ? this.state.errors["jornadaIntervaloFim"] : ""
																	},
																}}
																variant="outlined"
																disabled={(this.state.aprovada && this.props.me) || this.state.calling}
															/>
														</Grid>
														<Grid item xs={3}>
															<TimePicker
																id="jornada-saida"
																value={this.state.jornadaSaida}
																onChange={(newValue) => {this.setState({jornadaSaida: newValue}, () => this.calculateCorrecaoDerivedFields())}}
																label="Jornada - Saída"
																slotProps={{
																	field: { clearable: true },
																	textField: {
																		fullWidth: true,
																		error: "jornadaSaida" in this.state.errors,
																		helperText: "jornadaSaida" in this.state.errors ? this.state.errors["jornadaSaida"] : ""
																	},
																}}
																variant="outlined"
																disabled={(this.state.aprovada && this.props.me) || this.state.calling}
															/>
														</Grid>
														{this.state.jornadaEntrada && this.state.jornadaIntervaloInicio && this.state.jornadaIntervaloFim && this.state.jornadaSaida ? <React.Fragment>
															<Grid item xs={6}>
																<TimePicker
																	id="entrada"
																	value={this.state.entrada}
																	onChange={(newValue) => {this.setState({entrada: newValue}, () => this.calculateCorrecaoDerivedFields())}}
																	label="Entrada"
																	slotProps={{
																		field: { clearable: true },
																		textField: {
																			fullWidth: true,
																			error: "entrada" in this.state.errors || "entradaSaidaOrderValid" in this.state.errors,
																			helperText: "entrada" in this.state.errors ? this.state.errors["entrada"] : "entradaSaidaOrderValid" in this.state.errors ? this.state.errors["entradaSaidaOrderValid"] : ""
																		},
																	}}
																	variant="outlined"
																	disabled={(this.state.aprovada && this.props.me) || this.state.calling}
																/>
															</Grid>
															<Grid item xs={6}>
																<TimePicker
																	id="saida"
																	value={this.state.saida}
																	onChange={(newValue) => {this.setState({saida: newValue}, () => this.calculateCorrecaoDerivedFields())}}
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
																	disabled={(this.state.aprovada && this.props.me) || this.state.calling}
																/>
															</Grid>
															<Grid item xs={6}>
																<TextField
																	id="horas-a-trabalhar"
																	value={this.state.horasATrabalhar}
																	fullWidth
																	label="Horas a Trabalhar"
																	variant="outlined"
																	disabled
																/>
															</Grid>
															<Grid item xs={6}>
																<DurationInput
																	id="horas-trabalhadas"
																	value={this.state.horasTrabalhadas}
																	onChange={(e) => {this.setState({horasTrabalhadas: e.target.value}, () => this.calculateCorrecaoDerivedFields())}}
																	label="Horas Trabalhadas"
																	fullWidth
																	error={"horasTrabalhadas" in this.state.errors}
																	helperText={"horasTrabalhadas" in this.state.errors ? this.state.errors["horasTrabalhadas"] : ""}
																	variant="outlined"
																	disabled={(this.state.aprovada && this.props.me) || this.state.calling}
																/>
															</Grid>
															<Grid item xs={6}>
																<TextField
																	id="horas-nao-trabalhadas"
																	value={this.state.horasNaoTrabalhadas}
																	fullWidth
																	label="Intervalos"
																	variant="outlined"
																	disabled
																/>
															</Grid>
															<Grid item xs={6}>
																<TextField
																	id="hora-extra"
																	value={this.state.horaExtra}
																	fullWidth
																	label="Hora Extra"
																	variant="outlined"
																	disabled
																/>
															</Grid>
															<Grid item xs={6}>
																{this.state.contratoList !== null ?
																	<FormControl fullWidth>
																		<InputLabel>Contrato</InputLabel>
																		<Select
																			id="contrato"
																			value={this.state.contratoId != null ? this.state.contratoId : ""}
																			label="Contrato"
																			onChange={(e) => this.setState({contratoId: e.target.value})}
																			disabled={(this.state.aprovada && this.props.me) || this.state.calling}
																			>
																			<MenuItem value="">Nenhum</MenuItem>
																			{this.state.contratoList.map((contrato) => <MenuItem key={contrato.contratoId} value={contrato.contratoId}>{contrato.nome}</MenuItem>)}
																		</Select>
																	</FormControl>
																	: <CircularProgress size={20} color="inherit"/>}
															</Grid>
															<Grid item xs={6}>
																<FormGroup>
																	<FormControlLabel sx={{justifyContent: "center"}} control={<Switch checked={this.state.horaExtraPermitida} disabled={(this.state.aprovada && this.props.me) || this.state.calling} onClick={(e) => this.setState({horaExtraPermitida: e.target.checked})} color="success"/>} label="Hora Extra Permitida" />
																</FormGroup>
															</Grid>
															<Grid item xs={6}>
																<FormControl fullWidth>
																	<InputLabel>Observação</InputLabel>
																	<Select
																		id="observacao"
																		value={this.state.observacao != null ? this.state.observacao : ""}
																		label="Observação"
																		onChange={(e) => this.setState({observacao: e.target.value})}
																		disabled={(this.state.aprovada && this.props.me) || this.state.calling}
																		>
																		<MenuItem value="">Nenhuma</MenuItem>
																		{this.observacaoList.map((observacao) => <MenuItem key={observacao.value} value={observacao.value}>{observacao.nome}</MenuItem>)}
																	</Select>
																</FormControl>
															</Grid>
															<Grid item xs={6}>
																<DurationInput
																	id="ajuste-hora-extra"
																	value={this.state.ajusteHoraExtra}
																	onChange={(e) => this.setState({ajusteHoraExtra: e.target.value})}
																	fullWidth
																	label="Ajuste Hora Extra"
																	variant="outlined"
																	sx={{visibility: !(this.state.calling || this.state.observacao == "" || (this.state.observacao !== null && !this.observacaoByValue[this.state.observacao].ajusteHoraExtra)) ? "visible" : "hidden"}}
																	error={"ajusteHoraExtra" in this.state.errors}
																	helperText={"ajusteHoraExtra" in this.state.errors ? this.state.errors["ajusteHoraExtra"] : ""}
																	disabled={(this.state.aprovada && this.props.me) || this.state.calling}
																/>
															</Grid>
														</React.Fragment> : <Grid item container xs={12} justifyContent="center"><Chip label="NÃO REGISTRA" color="error" size="small" /></Grid>
														}
														<Grid item xs={12}>
															<TextField
																id="justificativa"
																value={this.state.justificativa != null ? this.state.justificativa : ""}
																onChange={(e) => this.setState({justificativa: e.target.value})}
																fullWidth
																multiline
																label="Justificativa"
																variant="outlined"
																error={"justificativa" in this.state.errors}
																helperText={"justificativa" in this.state.errors ? this.state.errors["justificativa"] : ""}
																disabled={(this.state.aprovada && this.props.me) || this.state.calling}
															/>
														</Grid>
														<Grid item xs={12}>
															<FormGroup>
																<FormControlLabel sx={{justifyContent: "center"}} control={<Switch checked={this.state.aprovada} disabled={this.props.me || this.state.calling} onClick={(e) => this.setState({aprovada: e.target.checked})} color="success"/>} label="Aprovada" />
															</FormGroup>
														</Grid>
													</React.Fragment>}
												</Grid>
												<Collapse in={this.state.correcaoAlertOpen}>
													{this.state.correcaoAlert}
												</Collapse>
											</Box>
										</DialogContent>
									</Dialog>}
						</Box>
						{this.state.report !== null ?
						<Box ref={this.folhaPontoRef} className="folhaPonto">
							<img src="/assets/image/folha_ponto_logo.png" style={{width: "6cm"}}/>
							<h3 style={{fontWeight: "bold", margin: "3mm 0 3mm 0", textAlign: "center"}}>
								FOLHA DE PONTO - PERÍODO: {this.meses[this.state.report.mes - 1].toUpperCase()}/{this.state.report.ano}
							</h3>
							<table className="colaboradorInfo">
								<thead>
									<tr>
										<th colSpan={2}>Empregado(a)</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<span className="name">Nome</span>
											<span className="value">{this.state.report.usuario.nomeCompleto}</span>
										</td>
										<td>
											<span className="name">CPF</span>
											<span className="value">{this.state.report.usuario?.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") ?? ""}</span>
										</td>
									</tr>
									<tr>
										<td>
											<span className="name">Cargo</span>
											<span className="value">{this.state.report.usuario.cargo?.nome ?? ""}</span>
										</td>
										<td>
											<span className="name">CTPS</span>
											<span className="value"></span>
										</td>
									</tr>
								</tbody>
							</table>
							<table className="dias">
								<thead>
									<tr>
										<th>DATA</th>
										<th>ENTRADA</th>
										<th>HORAS TRABALHADAS</th>
										<th>INTERVALOS</th>
										<th>SAÍDA</th>
										<th>HORA EXTRA</th>
										<th style={{width: "30%"}}>OBSERVAÇÃO</th>
									</tr>
								</thead>
								<tbody>
									{this.state.dayRows.map((day) => 
										<tr key={day.id}>
											<td style={{backgroundColor: (day.data.day() == 0 || day.data.day() == 6) ? "grey" : "white", color: (day.data.day() == 0 || day.data.day() == 6) ? "white" : "black"}}>{day.data.format("DD/MM/YYYY")}</td>
											<td>{day.entrada}</td>
											<td>{day.horasTrabalhadas}</td>
											<td>{day.horasNaoTrabalhadas}</td>
											<td>{day.saida}</td>
											<td>{day.horaExtra !=0 && dayjs.duration(day.horaExtra, 'seconds').format('HH[h]mm[m]')}</td>
											<td>{day.observacao}</td>
										</tr>
									)}
								</tbody>
							</table>
							<table className="colaboradorInfo">
								<thead>
									<tr>
										<th colSpan={5}>Totais</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<span className="name">Hora Extra</span>
											<span className="value">{dayjs.duration(this.state.totalHoraExtra, 'seconds').format("HH[h]mm[m]")}</span>
										</td>
										<td>
											<span className="name">Dias Trabalhados</span>
											<span className="value">{this.state.totalDiasTrabalhados}</span>
										</td>
										<td>
											<span className="name">Faltas</span>
											<span className="value">{this.state.totalFaltas}</span>
										</td>
										<td>
											<span className="name">Folgas</span>
											<span className="value">{this.state.totalFolgas}</span>
										</td>
										<td>
											<span className="name">Atestados</span>
											<span className="value">{this.state.totalAtestados}</span>
										</td>
										{/*<td>
											<span className="name">Atestados (em dias não trabalhados)</span>
											<span className="value">{this.state.totalAtestadosNaoTrabalhados}</span>
										</td>*/}
									</tr>
								</tbody>
							</table>
							<div className="assinatura">
								Assinatura do(a) empregado(a)
							</div>
						</Box> : ""}
					</React.Fragment>
				}
				<Collapse in={this.state.alertOpen}>
					{this.state.alert}
				</Collapse>
			</Box>
		  );
	}

}