import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium, GridToolbar, useGridApiRef } from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import DownloadIcon from '@mui/icons-material/Download';

import UsuarioDisplayChip from "../components/UsuarioDisplayChip";
import CustomDataGridPremium from "../components/CustomDataGridPremium";

import VendaFaturaStatusEnum from "../model/VendaFaturaStatusEnum";

import Papa from 'papaparse';

import api from "../services/api";

import dayjs from 'dayjs';

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class AutomacoesFaturasModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			vendaQueue: [],
			vendaList: [],
			vendaRows: [],

			vendaListDataGridApiRef: this.props.vendaListDataGridApiRef,

			vendaAtual: -1,

			planilha: null,
			relato: "",

			activeStep: 0,

			calling: false,
			carregandoPlanilha: false,
			carregandoVendas: false,
			salvandoVendas: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.columns = [
			{ field: 'id', headerName: 'ID', minWidth: 100 },
			{ field: 'os', headerName: 'OS', width: 100 },
			{ field: 'custcode', headerName: 'Cust-Code', width: 100 },
			{ field: 'ordem', headerName: 'Ordem', width: 100 },
			{ field: 'status', headerName: 'Status', width: 200, renderCell: (params) => <Chip label={this.statusEnum[params.value].label} color={this.statusEnum[params.value].color} /> },
		];

		this.numeroFaturas = 14;

		for (let i=1; i<=this.numeroFaturas; i++) {
			this.columns.push({ field: `m${i}Mes`, headerName: `M${i} Mês`, width: 150, valueGetter: (value, row) => value ? dayjs(value).format('MMMM YYYY') : "" });
			this.columns.push({ field: `m${i}Status`, headerName: `M${i} Status`, width: 100});
			this.columns.push({ field: `m${i}Valor`, headerName: `M${i} Valor`, width: 100});
		}

		this.statusEnum = {
			"IMPORTADA": {
				color: "default",
				label: "IMPORTADA"
			},
			"CARREGANDO": {
				color: "default",
				label: "CARREGANDO"
			},
			"FALHA_AO_CARREGAR": {
				color: "error",
				label: "FALHA AO CARREGAR"
			},
			"SEM_MODIFICACOES": {
				color: "default",
				label: "SEM MODIFICAÇÕES"
			},
			"A_SALVAR": {
				color: "primary",
				label: "A SALVAR"
			},
			"SALVANDO": {
				color: "primary",
				label: "SALVANDO"
			},
			"FALHA_AO_SALVAR": {
				color: "error",
				label: "FALHA AO SALVAR"
			},
			"SALVO": {
				color: "success",
				label: "SALVO"
			},
		}

		this.restart = this.restart.bind(this);
		this.updateVendaRow = this.updateVendaRow.bind(this);
		this.handleCarregarVendas = this.handleCarregarVendas.bind(this);
		this.carregarVendaFromApi = this.carregarVendaFromApi.bind(this);
		this.handlePlanilhaChange = this.handlePlanilhaChange.bind(this);
		this.handleSalvarVendas = this.handleSalvarVendas.bind(this);
		this.salvarVenda = this.salvarVenda.bind(this);
		this.calculateRows = this.calculateRows.bind(this);
		this.calculateRow = this.calculateRow.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		
	}

	restart() {
		this.setState({
			vendaQueue: [],
			vendaList: [],
			vendaRows: [],

			planilha: null,
			relato: "",

			activeStep: 0,

			calling: false,
			carregandoPlanilha: false,

			alertOpen: false,
			alert: null,

			errors: {},
		})
	}

	handlePlanilhaChange(event) {

		if (event.target.files.length < 1)
			return;

		let planilha = event.target.files[0];

		Papa.parse(planilha, {
			header: true,
			error: (err) => {
				this.openAlert("error", "Falha ao importar planilha!");
				this.setState({carregandoPlanilha: false});
			},
			complete: (results) => {

				let planilhaRows = results.data;
				let vendaList = [];

				planilhaRows.forEach((planilhaRow, i) => {
					let venda = {
						id: i + 1,
						vendaId: null,
						os: planilhaRow?.['OS'] ?? "",
						custcode: planilhaRow?.['Cust-Code'] ?? "",
						ordem: planilhaRow?.['Ordem'] ?? "",
						status: "IMPORTADA",
						faturaList: [],
					};

					for (let i=1; i<=this.numeroFaturas; i++) {
						let fatura = {};

						try {
							fatura.mes = dayjs(planilhaRow?.[`M${i} Mês`], "MMMM YYYY");
							if (!fatura.mes.isValid())
								throw new Error("Mês inválido");
							fatura.mes = fatura.mes.format("YYYY-MM-DD");

							let planilhaStatus = planilhaRow?.[`M${i} Status`];

							fatura.status = null;

							Object.keys(VendaFaturaStatusEnum).forEach((key) => {
								if (VendaFaturaStatusEnum[key] == planilhaStatus)
									fatura.status = key;
							});

							if (!fatura.status)
								throw new Error("Status inválido");
							fatura.valor = parseFloat(planilhaRow?.[`M${i} Valor`].replaceAll(/[^0-9\,\.]/g, "").replaceAll(",", "."));
							if (isNaN(fatura.valor))
								throw new Error("Valor inválido");

						} catch (error) {
							fatura = null;
						}

						venda.faturaList.push(fatura);
					}

					for (let i=this.numeroFaturas - 1; i>=0; i--) {
						if (venda.faturaList[i])
							break;
						venda.faturaList.pop();
					}

					console.log(venda.faturaList);

					vendaList.push(venda);
				});

				this.openAlert("success", `Planilha importada com sucesso!`);
				this.setState({carregandoPlanilha: false, activeStep: 1, vendaList: vendaList}, this.calculateRows);
			}
		});

		this.setState({
			planilha: planilha,
			carregandoPlanilha: true,
			vendaRows: [],
		});
	}

	calculateRows() {
		let vendaRows = this.state.vendaList.map((venda) => this.calculateRow(venda));
		this.setState({vendaRows: vendaRows});
	}

	calculateRow(venda) {

		let row = {
			id: venda.id,
			os: venda.os,
			custcode: venda.custcode,
			ordem: venda.ordem,
			status: venda.status,
		};

		for (let i=1; i<=this.numeroFaturas; i++) {
			row[`m${i}Mes`] = venda.faturaList?.[i - 1] ? new Date(venda.faturaList?.[i - 1].mes + "T00:00:00") : null;
			row[`m${i}Status`] = venda.faturaList?.[i - 1] ? VendaFaturaStatusEnum[venda.faturaList?.[i - 1].status] : "";
			row[`m${i}Valor`] = venda.faturaList?.[i - 1] ? ("R$ " + (venda.faturaList?.[i - 1].valor).toFixed(2).replace('.', ',')) : "";
		}

		return row;

	}

	updateVendaRow(venda) {
		this.state.vendaListDataGridApiRef.current.updateRows([this.calculateRow(venda)]);
	}

	handleCarregarVendas() {
		this.setState({
			calling: true,
			carregandoVendas: true,
			vendaAtual: 0,
			vendaQueue: this.state.vendaList.filter((venda) => venda.status == "IMPORTADA" || venda.status == "FALHA_AO_CARREGAR"),
		}, this.carregarVendaFromApi);
	}

	carregarVendaFromApi() {
		let venda = this.state.vendaQueue?.[this.state.vendaAtual];

		if (!venda) {
			this.setState({
				calling: false,
				carregandoVendas: false,
				vendaAtual: -1,
				activeStep: 2,
			});
			this.openAlert("success", "Vendas carregadas com sucesso!");
			return;
		}

		venda.status = "CARREGANDO";
		this.updateVendaRow(venda);

		api.post(`/venda/find-by-os-or-custcode-or-ordem`, {
			os: venda.os,
			custcode: venda.custcode,
			ordem: venda.ordem
		}, {
			redirect403: false,
		})
			.then((response) => {

				let rVenda = response.data;

				venda.vendaId = rVenda.vendaId;

				let modificado = false;

				let faturaList = [];

				for (let i=0; i<this.numeroFaturas; i++) {
					if (venda.faturaList[i]) {
						faturaList.push(venda.faturaList[i]);

						if (venda.faturaList[i].mes !== rVenda.faturaList[i]?.mes ||
							venda.faturaList[i].status !== rVenda.faturaList[i]?.status ||
							venda.faturaList[i].valor !== rVenda.faturaList[i]?.valor)
							modificado = true;

						continue;
					}
					if (rVenda.faturaList[i]) {
						faturaList.push(rVenda.faturaList[i]);
						continue;
					}
					if (venda.faturaList[i] === null) {
						faturaList.push({
							mes: "1990-01-01",
							status: "NA",
							valor: 0
						});
						modificado = true;
						continue;
					}
					break;
				}

				venda.faturaList = faturaList;

				venda.status = modificado ? "A_SALVAR" : "SEM_MODIFICACOES";
				this.updateVendaRow(venda);
			})
			.catch((err) => {
				venda.status = "FALHA_AO_CARREGAR";
				this.updateVendaRow(venda);
			})
			.finally(() => {
				this.setState({vendaAtual: this.state.vendaAtual + 1}, this.carregarVendaFromApi);
			});
	}

	handleSalvarVendas() {
		this.setState({
			calling: true,
			salvandoVendas: true,
			vendaAtual: 0,
			vendaQueue: this.state.vendaList.filter((venda) => venda.status == "A_SALVAR" || venda.status == "FALHA_AO_SALVAR"),
		}, this.salvarVenda);
	}

	salvarVenda() {
		let venda = this.state.vendaQueue?.[this.state.vendaAtual];

		if (!venda) {
			this.setState({
				calling: false,
				salvandoVendas: false,
				vendaAtual: -1,
			});
			this.openAlert("success", "Vendas salvas com sucesso!");
			return;
		}

		venda.status = "SALVANDO";
		this.updateVendaRow(venda);

		api.patch(`/venda/${venda.vendaId}/faturaList`, {
			relato: this.state.relato,
			faturaList: venda.faturaList,
		}, {
			redirect403: false,
		})
			.then((response) => {
				venda.status = "SALVO";
				this.updateVendaRow(venda);
			})
			.catch((err) => {
				venda.status = "FALHA_AO_SALVAR";
				this.updateVendaRow(venda);
			})
			.finally(() => {
				this.setState({vendaAtual: this.state.vendaAtual + 1}, this.salvarVenda);
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
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start", gap: 1}} className="modulePaper">
					<Stack direction="row" gap={3} alignItems="center">
						<Typography variant="h3" gutterBottom>
						Automações - Faturas
						</Typography>
					</Stack>
					<Divider/>
					<Grid container spacing={1} sx={{maxWidth: 1500}}>
						<Grid item xs={12}>
							<Alert severity="info">
								<Stack>
									Planilha Importada: {this.state?.planilha?.name ?? "nenhuma"} <br/>
									{this.state.vendaAtual !== -1 && `Progresso: ${this.state.vendaAtual + 1}/${this.state.vendaQueue.length}`}
									{/*<Stack direction="horizontal">
										{Object.keys(this.statusEnum).map((status, i) => <Chip key={i} label={this.statusEnum[status].label + ": " + this.state.vendaList.filter((venda) => venda.status == status).length} color={this.statusEnum[status].color} />)}
									</Stack>*/}
									
								</Stack>
							</Alert>
						</Grid>
						<Grid item xs={12}>
							<Stepper nonLinear activeStep={this.state.activeStep}>
								<Step>
									<StepButton onClick={() => this.setState({activeStep: 0})}>Importar Planilha</StepButton>
								</Step>
								<Step>
									<StepButton onClick={() => this.setState({activeStep: 1})}>Carregar Vendas</StepButton>
								</Step>
								<Step>
									<StepButton onClick={() => this.setState({activeStep: 2})}>Salvar Vendas</StepButton>
								</Step>
							</Stepper>
						</Grid>
						<Grid item xs={12}>
							<Stack gap={1} alignItems="center">
								{this.state.activeStep == 0 && <React.Fragment>
										<LoadingButton component="label" variant="contained" startIcon={<CloudUploadIcon />} loadingPosition="start" disabled={this.state.calling} loading={this.state.carregandoPlanilha}>
											Selecionar Planilha
											<input type="file" accept=".csv" id="foto-perfil" hidden onChange={this.handlePlanilhaChange}/>
										</LoadingButton>
									</React.Fragment> }

								{this.state.activeStep == 1 && <React.Fragment>
										<LoadingButton component="label" variant="contained" startIcon={<DownloadIcon />} loadingPosition="start" disabled={this.state.calling} loading={this.state.carregandoVendas} onClick={this.handleCarregarVendas}>
											Carregar Vendas
										</LoadingButton>
									</React.Fragment> }

								{this.state.activeStep == 2 && <React.Fragment>
										<TextField
											required
											id="relato"
											value={this.state.relato}
											onChange={(e) => this.setState({relato: e.target.value})}
											fullWidth
											label="Relato"
											variant="outlined"
											disabled={this.state.calling}
											error={"relato" in this.state.errors}
											helperText={this.state.errors?.relato ?? ""}
											inputProps={{
												maxLength: 500,
											}}
											multiline
											rows={4}
										/>
										<LoadingButton fullWidth variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.salvandoVendas} disabled={this.state.calling || this.state.relato == ""} onClick={this.handleSalvarVendas}>Salvar</LoadingButton>
									</React.Fragment> }
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Button variant="contained" size="large" startIcon={<RefreshIcon />} disabled={this.state.calling || this.state.activeStep == 0} onClick={this.restart}>Reiniciar</Button>
						</Grid>
						<Grid item xs={12}>
							<Collapse in={this.state.alertOpen}>
								{this.state.alert}
							</Collapse>
						</Grid>
					</Grid>
					<Divider/>
					<Box sx={{ flexGrow: 1, height: "1px", minHeight: "400px" }}>
						<CustomDataGridPremium
							rows={this.state.vendaRows}
							columns={this.columns}
							initialState={{
							    pagination: { paginationModel: { pageSize: 50 } },
							    pinnedColumns: { left: ['id'], right: ['status'] }
							  }}
							pageSizeOptions={[10, 30, 50, 100, 1000]}
							loading={this.state.calling}
							sx={{marginBottom: 3}}
							pagination
							headerFilters
							disableAggregation
							slots={{
								toolbar: GridToolbar,
								headerFilterMenu: null,
							}}
							disableColumnFilter
							apiRef={this.state.vendaListDataGridApiRef}
						/>
					</Box>
				</Paper>
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const vendaListDataGridApiRef = useGridApiRef();
	return <AutomacoesFaturasModule params={params} location={location} navigate={navigate} vendaListDataGridApiRef={vendaListDataGridApiRef} {...props}/>
}