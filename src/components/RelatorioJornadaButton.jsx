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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import DescriptionIcon from '@mui/icons-material/Description';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';

import dayjs from 'dayjs';

import api from "../services/api";

export default class RelatorioJornadaButton extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,

			report: null,

			calling: false,
			generating: false,

			data: dayjs(),

			dayRows: [],
		}

		this.columns = [
			{ field: 'dia', headerName: "DIA", renderCell: (params) => {
				return <Box sx={{fontWeight: (params.row.data.day() == 0 || params.row.data.day() == 6) ? "bold" : "regular", color: (params.row.data.day() == 0 || params.row.data.day() == 6) ? "red" : "white"}}>{params.row.data.date()}</Box>
			}, minWidth: 50 },
			{ field: 'entrada', headerName: 'ENTRADA', minWidth: 100, flex: 1 },
			{ field: 'horasTrabalhadas', headerName: 'HORAS TRABALHADAS', minWidth: 200, flex: 1 },
			{ field: 'horasNaoTrabalhadas', headerName: 'HORAS NÃO TRABALHADAS', minWidth: 200, flex: 1 },
			{ field: 'saida', headerName: 'SAIDA', minWidth: 100, flex: 1 },
			{ field: 'horaExtra', headerName: 'HORA EXTRA', minWidth: 100, flex: 1 },
			{ field: 'observacao', headerName: 'OBSERVAÇÃO', minWidth: 300, flex: 1 }
		];

		this.meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

		this.getReportFromApi = this.getReportFromApi.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
	}


	getReportFromApi() {
		this.setState({calling: true, generating: true, report: null});
		api.post(`/registro-jornada/${this.props.usuarioId}/report`, {
			ano: this.state.data.year(),
			mes: this.state.data.month() + 1,
		}, {redirect403: false})
			.then((response) => {
				let report = response.data;
				let dayRows = report.dayList.map((day, i) => {
					return {
						id: dayjs(day.data).date(),
						data: dayjs(day.data),
						entrada: day.entrada !== null ? dayjs(day.entrada, "HH:mm:ss").format('HH:mm') : "",
						horasTrabalhadas: day.entrada !== null && day.horasTrabalhadas !== null ? dayjs.duration(day.horasTrabalhadas, 'seconds').format('HH:mm') : "",
						horasNaoTrabalhadas: day.entrada !== null && day.horasNaoTrabalhadas !== null ? dayjs.duration(day.horasNaoTrabalhadas, 'seconds').format('HH:mm') : "",
						saida: day.entrada !== null && day.saida !== null ? dayjs(day.saida, "HH:mm:ss").format('HH:mm') : "",
						horaExtra: day.entrada !== null && day.horasTrabalhadas !== null && day.horasATrabalhar !== null ? dayjs.duration(day.registroJornada.horaExtraPermitida ? day.horasTrabalhadas - day.horasATrabalhar : Math.min(0, day.horasTrabalhadas - day.horasATrabalhar), 'seconds').format('HH:mm') : "",
						observacao: day.entrada !== null ? "" : "Sem Registro"
					}
				})
				this.setState({
					report: report,
					dayRows: dayRows,
					errors: {},
					calling: false,
					generating: false,
					});
			})
			.catch((err) => {
				console.log(err);
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({report: [], calling: false, generating: false});
					return;
				}
				this.openAlert("error", "Falha ao gerar relatório!");
				this.setState({calling: false, generating: false});
			});
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
	
		return (
			<React.Fragment>
				<Button variant="contained" startIcon={<EventNoteIcon />} onClick={() => this.setState({dialogOpen: true})} fullWidth>
					Relatório de Ponto
				</Button>
				<Dialog
					fullWidth={true}
        			maxWidth={"xl"}
					onClose={() => this.setState({dialogOpen: false})}
					open={this.state.dialogOpen}
				>
      				<DialogTitle>Relatório de Ponto</DialogTitle>
      				<IconButton
						onClick={() => this.setState({dialogOpen: false})}
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
      					<Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", gap: 3}}>
							{this.state.dialogOpen ? <React.Fragment>
								<Stack direction="row" gap={3} justifyContent="center">
									<DatePicker
										label="Período"
										value={this.state.data}
										views={['month', 'year']}
										onChange={(newValue) => this.setState({data: newValue})}
									/>
									<LoadingButton variant="contained" size="large" startIcon={<DescriptionIcon />} loadingPosition="start" loading={this.state.generating} disabled={this.state.calling} onClick={this.getReportFromApi}>Gerar Relatório</LoadingButton>
								</Stack>
								<Divider/>
								{this.state.report == null ? <Alert severity="warning">Nenhum dado para mostrar</Alert> :
									<Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1}}>
										<Typography variant="h4" align="center">
											FOLHA DE PONTO - PERÍODO: {this.meses[this.state.report.mes - 1].toUpperCase()}/{this.state.report.ano}
										</Typography>
										<Typography variant="h5" align="left" gutterBottom>
											Colaborador
										</Typography>
										<form onSubmit={(e) => e.preventDefault()} disabled={true}>
											<Grid container spacing={3}>
												<Grid item xs={6}>
													<TextField
														id="nome"
														value={this.state.report.usuario.nome}
														fullWidth
														label="Nome"
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
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
										<DataGrid
											rows={this.state.dayRows}
											columns={this.columns}
											disableColumnFilter
											disableColumnMenu
											disableColumnSelector
											disableColumnSorting
											disableRowSelectionOnClick
											autoHeight
											initialState={{
											    pagination: { paginationModel: { pageSize: 31 } },
											  }}
											pageSizeOptions={[31]}
											sx={{marginBottom: 3, marginTop: 3}}
										/>
									</Box>
								}
								<Collapse in={this.state.alertOpen}>
									{this.state.alert}
								</Collapse>
							</React.Fragment> : ""}
						</Box>
					</DialogContent>
				</Dialog>
		    </React.Fragment>
		  );
	}

}