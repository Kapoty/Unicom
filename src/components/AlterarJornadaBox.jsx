import React from "react";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingButton from '@mui/lab/LoadingButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';

import api from "../services/api";

export default class AlterarJornadaBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			jornadaList: null,

			jornadaRows: [],

			jornadaSelected: null,

			nome: null,
			entrada: null,
			intervaloInicio: null,
			intervaloFim: null,
			saida: null,
			segunda: null,
			terca: null,
			quarta: null,
			quinta: null,
			sexta: null,
			sabado: null,
			domingo: null,
			dataInicio: null,
			dataFim: null,
			prioridade: null,

			calling: false,
			adicionando: false,
			deleting: false,
			saving: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.columns = [
			{ field: 'tipo', headerName: 'Tipo', minWidth: 100, flex: 1, renderCell: (params) =>
				params.value ? <Chip label="GERAL" color="warning" /> : <Chip label="PRÓPRIA" color="info" />
			},
			{ field: 'nome', headerName: 'Nome', minWidth: 200, flex: 1 },
			{ field: 'registra', headerName: 'Jornada', minWidth: 200, flex: 1, renderCell: (params) =>
				params.value ? <Stack gap={1} direction="row" justifyContent="start" alignItems="center">
					<Typography variant="caption" color={green[400]} align="center">
						{params.row.entrada}
					</Typography>
					<Typography variant="caption" color={yellow[400]} align="center">
						{params.row.intervaloInicio}
					</Typography>
					<Typography variant="caption" color={blue[400]} align="center">
						{params.row.intervaloFim}
					</Typography>
					<Typography variant="caption" color={red[400]} align="center">
						{params.row.saida}
					</Typography>
				</Stack> : <Chip label="NÃO REGISTRA" color="error" size="small" />
			},
			{ field: 'diasDaSemana', headerName: 'Dias da Semana', minWidth: 400, flex: 1, renderCell: (params) =>
				<Stack gap={1} direction="row" justifyContent="start" alignItems="center">
					<Chip label="SEG" color={params.row.segunda ? "success" : "grey"} size="small" />
					<Chip label="TER" color={params.row.terca ? "success" : "grey"} size="small" />
					<Chip label="QUA" color={params.row.quarta ? "success" : "grey"} size="small" />
					<Chip label="QUI" color={params.row.quinta ? "success" : "grey"} size="small" />
					<Chip label="SEX" color={params.row.sexta ? "success" : "grey"} size="small" />
					<Chip label="SAB" color={params.row.sabado ? "success" : "grey"} size="small" />
					<Chip label="DOM" color={params.row.domingo ? "success" : "grey"} size="small" />
				</Stack>
			},
			{ field: 'dataInicio', headerName: 'De', minWidth: 100, flex: 1 },
			{ field: 'dataFim', headerName: 'Até', minWidth: 100, flex: 1 },
			{ field: 'prioridade', headerName: 'Prioridade', minWidth: 100, flex: 1 },
		];

		this.getJornadaListFromApi = this.getJornadaListFromApi.bind(this);
		this.getJornadaFromApi = this.getJornadaFromApi.bind(this);

		this.calculateRows = this.calculateRows.bind(this);

		this.handleRowSelected = this.handleRowSelected.bind(this);

		this.setJornadaFieldsFromJornadaSelected = this.setJornadaFieldsFromJornadaSelected.bind(this);

		this.addJornada = this.addJornada.bind(this);
		this.saveJornada = this.saveJornada.bind(this);
		this.deleteJornada = this.deleteJornada.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getJornadaListFromApi();
	}

	getJornadaListFromApi() {
		this.setState({calling: true, jornadaSelected: null});
		api.post(`/jornada/find-all-by-usuario-id`, {
			usuarioId: this.props.usuarioId
		}, {redirect403: false})
			.then((response) => {
				let jornadaList = response.data;
				this.setState({
					jornadaList: jornadaList,
					errors: {},
					calling: false,
				}, () => this.calculateRows());
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({jornadaList: null, calling: false});
					return;
				}
				this.openAlert("error", "Falha ao obter jornadas!");
				this.setState({calling: false});
			});
	}

	calculateRows() {
		let jornadaRows = this.state.jornadaList.map((jornada) => { return {
				id: jornada.jornadaId,
				tipo: jornada.usuarioId == null,
				nome: jornada.nome,
				registra: jornada.entrada !== null,
				entrada: jornada.entrada !== null ? dayjs(jornada.entrada, "HH:mm:ss").format('HH:mm') : "",
				intervaloInicio: jornada.entrada !== null ? dayjs(jornada.intervaloInicio, "HH:mm:ss").format('HH:mm') : "",
				intervaloFim: jornada.entrada !== null ? dayjs(jornada.intervaloFim, "HH:mm:ss").format('HH:mm') : "",
				saida: jornada.entrada !== null ? dayjs(jornada.saida, "HH:mm:ss").format('HH:mm') : "",
				diasDaSemana: jornada.segunda + jornada.terca * 10 + jornada.quarta * 100 + jornada.quinta * 1000 + jornada.sexta *10000 + jornada.sabado * 100000 + jornada.domingo * 1000000,
				segunda: jornada.segunda,
				terca: jornada.terca,
				quarta: jornada.quarta,
				quinta: jornada.quinta,
				sexta: jornada.sexta,
				sabado: jornada.sabado,
				domingo: jornada.domingo,
				dataInicio: jornada.dataInicio !== null ? dayjs(jornada.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
				dataFim: jornada.dataFim !== null ? dayjs(jornada.dataFim, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
				prioridade: jornada.prioridade,
			}
		});
		this.setState({jornadaRows: jornadaRows});
	}

	handleRowSelected(row) {
		let jornadaSelected = null;
		if (row.length > 0) 
			jornadaSelected = this.state.jornadaList.filter((jornada) => jornada.jornadaId == row[0])[0];
		this.setState({
			jornadaSelected: jornadaSelected,
		}, () => {
			this.setJornadaFieldsFromJornadaSelected();
		})
	}

	setJornadaFieldsFromJornadaSelected() {
		if (this.state.jornadaSelected == null)
			return;
		let jornadaSelected = this.state.jornadaSelected;
		this.setState({
			nome: jornadaSelected.nome,
			entrada: jornadaSelected.entrada !== null ? dayjs(jornadaSelected.entrada, "HH:mm:ss") : null,
			intervaloInicio: jornadaSelected.intervaloInicio !== null ? dayjs(jornadaSelected.intervaloInicio, "HH:mm:ss") : null,
			intervaloFim: jornadaSelected.intervaloFim !== null ? dayjs(jornadaSelected.intervaloFim, "HH:mm:ss") : null,
			saida: jornadaSelected.saida !== null ? dayjs(jornadaSelected.saida, "HH:mm:ss") : null,
			segunda: jornadaSelected.segunda,
			terca: jornadaSelected.terca,
			quarta: jornadaSelected.quarta,
			quinta: jornadaSelected.quinta,
			sexta: jornadaSelected.sexta,
			sabado: jornadaSelected.sabado,
			domingo: jornadaSelected.domingo,
			dataInicio: jornadaSelected.dataInicio !== null ? dayjs(jornadaSelected.dataInicio, "YYYY-MM-DD") : null,
			dataFim: jornadaSelected.dataFim !== null ? dayjs(jornadaSelected.dataFim, "YYYY-MM-DD") : null,
			prioridade: jornadaSelected.prioridade,
		})
	}

	saveJornada() {
		let data = {
			nome: this.state.nome,
			entrada: this.state.entrada !== null ? dayjs(this.state.entrada).format("HH:mm:ss") : null,
			intervaloInicio: this.state.intervaloInicio !== null ? dayjs(this.state.intervaloInicio).format("HH:mm:ss") : null,
			intervaloFim: this.state.intervaloFim !== null ? dayjs(this.state.intervaloFim).format("HH:mm:ss") : null,
			saida: this.state.saida !== null ? dayjs(this.state.saida).format("HH:mm:ss") : null,
			segunda: this.state.segunda,
			terca: this.state.terca,
			quarta: this.state.quarta,
			quinta: this.state.quinta,
			sexta: this.state.sexta,
			sabado: this.state.sabado,
			domingo: this.state.domingo,
			dataInicio: this.state.dataInicio !== null ? this.state.dataInicio.format("YYYY-MM-DD") : null,
			dataFim: this.state.dataFim !==null ? this.state.dataFim.format("YYYY-MM-DD") : null,
			prioridade: this.state.prioridade,
		};

		this.setState({calling: true, saving: true});
		api.patch(`/jornada/${this.state.jornadaSelected.jornadaId}`, data, {redirect403: false})
			.then((response) => {
				this.openAlert("success", `Jornada salva com sucesso!`);
				this.getJornadaFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				if (err?.response?.status == 403)
					this.openAlert("error", "Não permitido!");
				else
					this.openAlert("error", "Falha ao salvar jornada!");
				this.setState({calling: false, saving: false, errors: err?.response?.data?.errors ?? {}});
			})
	}

	addJornada(usuarioId) {
		let data = {
			usuarioId: usuarioId,
		};

		this.setState({calling: true, adicionando: true});
		api.post(`/jornada/`, data)
			.then((response) => {
				this.openAlert("success", `Jornada adicionada com sucesso!`);
				this.getJornadaListFromApi();
				this.setState({calling: false, adicionando: false, errors: {}});
			})
			.catch((err) => {
				if (err?.response?.status == 403)
					this.openAlert("error", "Não permitido!");
				else
					this.openAlert("error", "Falha ao adicionar jornada!");
				this.setState({calling: false, adicionando: false, errors: err?.response?.data?.errors ?? {}});
			})
	}

	deleteJornada() {
		this.setState({calling: true, deleting: true});
		api.delete(`/jornada/${this.state.jornadaSelected.jornadaId}`, {redirect403: false})
			.then((response) => {
				this.openAlert("success", `Jornada deletada com sucesso!`);
				this.getJornadaListFromApi();
				this.setState({calling: false, deleting: false, errors: {}});
			})
			.catch((err) => {
				if (err?.response?.status == 403)
					this.openAlert("error", "Não permitido!");
				else
					this.openAlert("error", "Falha ao deletar jornada!");
				this.setState({calling: false, deleting: false, errors: err?.response?.data?.errors ?? {}});
			})
	}

	getJornadaFromApi() {
		if (this.state.jornadaSelected == null)
			return;
		this.setState({calling: true});
		api.get(`/jornada/${this.state.jornadaSelected.jornadaId}`, {redirect403: false})
			.then((response) => {
				this.setState({
					jornadaSelected: Object.assign(this.state.jornadaSelected, response.data),
					errors: {},
					calling: false,
				}, () => {
					this.calculateRows();
					this.setJornadaFieldsFromJornadaSelected();
				});
			})
			.catch((err) => {
				if (err?.response?.status == 403)
					this.openAlert("error", "Não permitido!");
				else
					this.openAlert("error", "Falha ao obter jornada!");
				this.setState({calling: false, errors: err?.response?.data?.errors ?? {}});
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
			<Box sx={{display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", minWidth: "800px"}}>
				<ButtonGroup>
						<LoadingButton component="label" variant="outlined" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.calling} disabled={this.state.calling} onClick={this.getJornadaListFromApi}>Atualizar</LoadingButton>
						<LoadingButton variant="contained" color="info" size="large" startIcon={<AddIcon />} loadingPosition="start" loading={this.state.adicionando} disabled={this.state.calling} onClick={() => this.addJornada(this.props.usuarioId)}>Nova Jornada</LoadingButton>
						{this.props.usuario.permissaoList.includes("VER_TODAS_EQUIPES") ? <LoadingButton variant="contained" color="warning" size="large" startIcon={<AddIcon />} loadingPosition="start" loading={this.state.adicionando} disabled={this.state.calling} onClick={() => this.addJornada(null)}>Nova Jornada Geral</LoadingButton> : ""}
				</ButtonGroup>
				<Box>
					<DataGrid
						rows={this.state.jornadaRows}
						columns={this.columns}
						disableColumnFilter
						disableColumnMenu
						disableColumnSelector
						autoHeight
						initialState={{
						    pagination: { paginationModel: { pageSize: 5 } },
						  }}
						pageSizeOptions={[5, 10, 15, 20]}
						onRowSelectionModelChange={this.handleRowSelected}
						loading={this.state.jornadaList == null || this.state.calling}
					/>
				</Box>
				{this.state.jornadaSelected == null ? <Alert severity="warning">Selecione uma jornada</Alert> :
					<Accordion defaultExpanded>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} >
							Jornada
						</AccordionSummary>
						<AccordionDetails>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<ButtonGroup sx={{marginBottom: 3}}>
										<LoadingButton variant="contained" color="error" size="large" startIcon={<DeleteIcon />} loadingPosition="start" loading={this.state.deleting} disabled={this.state.calling} onClick={this.deleteJornada}>Deletar</LoadingButton>
										<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveJornada}>Salvar</LoadingButton>
									</ButtonGroup>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="nome"
										value={this.state.nome}
										onChange={(e) => this.setState({nome: e.target.value})}
										fullWidth
										label="Nome"
										required
										variant="outlined"
										disabled={this.state.calling}
										error={"nome" in this.state.errors}
										helperText={this.state.errors?.nome ?? ""}
									/>
								</Grid>
								<Grid item xs={3}>
									<TimePicker
										id="entrada"
										value={this.state.entrada}
										onChange={(newValue) => this.setState({entrada: newValue})}
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
								<Grid item xs={3}>
									<TimePicker
										id="intervalo-inicio"
										value={this.state.intervaloInicio}
										onChange={(newValue) => this.setState({intervaloInicio: newValue})}
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
								<Grid item xs={3}>
									<TimePicker
										id="intervalo-fim"
										value={this.state.intervaloFim}
										onChange={(newValue) => this.setState({intervaloFim: newValue})}
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
								<Grid item xs={3}>
									<TimePicker
										id="saida"
										value={this.state.saida}
										onChange={(newValue) => this.setState({saida: newValue})}
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
								<Grid item xs={12}>
									<FormControl component="fieldset">
										<FormLabel component="legend">Dias da Semana</FormLabel>
										<FormGroup aria-label="position" row>
											<FormControlLabel
												control={<Checkbox checked={this.state.segunda} onChange={(e) => this.setState({segunda: e.target.checked})}/>}
												label="SEG"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												control={<Checkbox checked={this.state.terca} onChange={(e) => this.setState({terca: e.target.checked})}/>}
												label="TER"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												control={<Checkbox checked={this.state.quarta} onChange={(e) => this.setState({quarta: e.target.checked})}/>}
												label="QUA"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												control={<Checkbox checked={this.state.quinta} onChange={(e) => this.setState({quinta: e.target.checked})}/>}
												label="QUI"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												control={<Checkbox checked={this.state.sexta} onChange={(e) => this.setState({sexta: e.target.checked})}/>}
												label="SEX"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												control={<Checkbox checked={this.state.sabado} onChange={(e) => this.setState({sabado: e.target.checked})}/>}
												label="SAB"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												control={<Checkbox checked={this.state.domingo} onChange={(e) => this.setState({domingo: e.target.checked})}/>}
												label="DOM"
												labelPlacement="bottom"
											/>

										</FormGroup>
									</FormControl>
								</Grid>
								<Grid item xs={6}>
									<DatePicker
										label="De"
										value={this.state.dataInicio}
										onChange={(newValue) => this.setState({dataInicio: newValue})}
										slotProps={{
											field: { clearable: true },
											textField: {
												fullWidth: true,
												error: "dataInicio" in this.state.errors,
												helperText: this.state.errors?.dataInicio ?? "",
											},
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<DatePicker
										label="Até"
										value={this.state.dataFim}
										onChange={(newValue) => this.setState({dataFim: newValue})}
										slotProps={{
											field: { clearable: true },
											textField: {
												fullWidth: true,
												error: "dataFim" in this.state.errors,
												helperText: this.state.errors?.dataFim ?? "",
											},
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="prioridade"
										value={this.state.prioridade}
										onChange={(e) => this.setState({prioridade: e.target.value})}
										fullWidth
										label="Prioridade"
										required
										variant="outlined"
										disabled={this.state.calling}
										error={"prioridade" in this.state.errors}
										helperText={this.state.errors?.prioridade ?? ""}
									/>
								</Grid>
							</Grid>
						</AccordionDetails>
					</Accordion>
				}
				<Collapse in={this.state.alertOpen}>
					{this.state.alert}
				</Collapse>
			</Box>
		  );
	}

}