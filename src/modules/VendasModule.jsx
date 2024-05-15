import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
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
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class VendasModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			vendaList: null,

			vendaStatusList: null,
			vendaStatusByVendaStatusId: null,

			vendaRows: [],

			tipoData: 'DATA_VENDA',
			dataInicio: dayjs().date(1),
			dataFim: dayjs(),
			statusIdList: [],

			calling: false,

			errors: {},

			alertOpen: false,
			alert: null
		}

		this.columns = [
			{ field: 'statusNome', headerName: 'Status', minWidth: 100, flex: 1, renderCell: (params) => <Chip
				color="primary"
				variant="contained"
				label={params.row.status.nome}
				icon={<Icon>{params.row.status.icon}</Icon>}
				onClick={() => this.props.navigate("/vendas/" + params.row.vendaId)}
			/>},
			{ field: 'cpf', headerName: 'CPF/CNPJ', minWidth: 200, flex: 1 },
			{ field: 'nome', headerName: 'Nome', minWidth: 200, flex: 1 },
			{ field: 'tipoProduto', headerName: 'Tipo', minWidth: 100, flex: 1 },
			{ field: 'dataVenda', headerName: 'Data da Venda', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataStatus', headerName: 'Data do Status', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataAtivacao', headerName: 'Data da Ativação', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataAgendamento', headerName: 'Data de Agendamento', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataInstalacao', headerName: 'Data de Instalação', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataCadastro', headerName: 'Data do Cadastro', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
		];

		this.tipoDataList = [
			{nome: "Data da Venda", value: "DATA_VENDA"},
			{nome: "Data do Status", value: "DATA_STATUS"},
			{nome: "Data da Ativação", value: "DATA_ATIVACAO"},
			{nome: "Data de Agendamento", value: "DATA_AGENDAMENTO"},
			{nome: "Data da Instalação", value: "DATA_INSTALACAO"},
			{nome: "Data do Cadastro", value: "DATA_CADASTRO"},
		];

		this.getVendaListFromApi = this.getVendaListFromApi.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);

		this.calculateRows = this.calculateRows.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getVendaStatusListFromApi();
	}

	getVendaListFromApi() {
		this.setState({calling: true})
		api.post("/venda/venda-list", {
				tipoData: this.state.tipoData,
				dataInicio: this.state.dataInicio.format("YYYY-MM-DD"),
				dataFim: this.state.dataFim.format("YYYY-MM-DD"),
				statusIdList: this.state.statusIdList,
			})
			.then((response) => {
				this.setState({vendaList: response.data, errors: {}, calling: false}, () => this.calculateRows());
			})
			.catch((err) => {
				this.setState({calling: false, errors: err?.response?.data?.errors ?? {}});
				this.openAlert("error", "Falha ao atualizar vendas!");
			});
	}

	getVendaStatusListFromApi() {
		api.get("/empresa/me/venda-status")
			.then((response) => {
				let vendaStatusList = response.data;
				let vendaStatusByVendaStatusId = {};
				vendaStatusList.forEach((vendaStatus) => vendaStatusByVendaStatusId[vendaStatus.vendaStatusId] = vendaStatus);
				let statusIdList = vendaStatusList.map((vendaStatus) => vendaStatus.vendaStatusId);
				this.setState({vendaStatusList: vendaStatusList, vendaStatusByVendaStatusId: vendaStatusByVendaStatusId, statusIdList: statusIdList}, () => this.getVendaListFromApi());
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendaStatusListFromApi, 3000);
			});
	}

	calculateRows() {
		let vendaRows = this.state.vendaList.map((venda) => {
			return {
				id: venda.vendaId,
				vendaId: venda.vendaId,
				status: venda.status,
				statusNome: venda.status.nome,
				cpf: venda.tipoPessoa == "CPF" ? venda.cpf : venda.cnpj,
				nome: venda.nome,
				tipoProduto: venda.tipoProduto,
				dataVenda: venda.dataVenda !== null ? new Date(venda.dataVenda) : null,
				dataStatus: venda.dataStatus !== null ? new Date(venda.dataStatus) : null,
				dataAtivacao: venda.dataAtivacao !== null ? new Date(venda.dataAtivacao) : null,
				dataAgendamento: venda.dataAgendamento !== null ? new Date(venda.dataAgendamento) : null,
				dataInstalacao: venda.dataInstalacao !== null ? new Date(venda.dataInstalacao) : null,
				dataCadastro: venda.dataCadastro !== null ? new Date(venda.dataCadastro) : null,
			}
		});
		this.setState({vendaRows: vendaRows});
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
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start", gap: 3}} className="modulePaper">
					<Typography variant="h3">
						Vendas
					</Typography>
					<ButtonGroup>
							<Button variant="contained" size="large" startIcon={<PersonAddIcon />} onClick={() => this.props.navigate("/vendas/novo")}>Nova Venda</Button>
					</ButtonGroup>
					<Divider/>
					<Grid container spacing={3}>
						<Grid item xs={2}>
							<FormControl fullWidth>
								<InputLabel>Tipo de Data</InputLabel>
								<Select
									id="tipo-de-data"
									value={this.state.tipoData}
									label="Grupo de Status"
									onChange={(e) => this.setState({tipoData: e.target.value})}
									>
									{this.tipoDataList.map((tipoData) => <MenuItem key={tipoData.value} value={tipoData.value}>{tipoData.nome}</MenuItem>)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={2}>
							<DatePicker
								label="Data Início"
								value={this.state.dataInicio}
								onChange={(newValue) => this.setState({dataInicio: newValue})}
								slotProps={{
									textField: {
										fullWidth: true,
										error: "dataInicio" in this.state.errors || "dataValid" in this.state.errors || "dataRangeValid" in this.state.errors,
										helperText: this.state.errors?.dataInicio ?? this.state.errors?.dataValid ?? this.state.errors?.dataRangeValid ?? "",
									},
								}}
							/>
						</Grid>
						<Grid item xs={2}>
							<DatePicker
								label="Data Fim"
								value={this.state.dataFim}
								onChange={(newValue) => this.setState({dataFim: newValue})}
								slotProps={{
									textField: {
										fullWidth: true,
										error: "dataFim" in this.state.errors,
										helperText: this.state.errors?.dataFim ?? "",
									},
								}}
							/>
						</Grid>
						<Grid item xs={4}>
							<Autocomplete
								multiple
								limitTags={3}
								disableListWrap
								id="venda-status"
								loading={this.state.vendaStatusList == null}
								options={Object.keys(this.state.vendaStatusByVendaStatusId ?? {}).map(key => parseInt(key))}
								getOptionLabel={(option) => this.state.vendaStatusByVendaStatusId[option].nome}
								value={this.state.statusIdList}
								onChange={(event, value) => this.setState({statusIdList: value})}
								renderInput={(params) => (
									<TextField
										error={"papelId" in this.state.errors}
										helperText={this.state.errors?.papelId}
											{...params}
										variant="outlined"
										label="Status"
									/>
								)}
								renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									<Stack direction="row" spacing={1} alignItems="center">
										<Icon>{this.state.vendaStatusByVendaStatusId[option].icon}</Icon>
										<div>{this.state.vendaStatusByVendaStatusId[option].nome}</div>
									</Stack>
								</Box>}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
									<Chip
										variant="contained"
										label={this.state.vendaStatusByVendaStatusId[option].nome}
										icon={<Icon>{this.state.vendaStatusByVendaStatusId[option].icon}</Icon>}
										{...getTagProps({ index })}
									/>
									))
								}
							/>
						</Grid>
						<Grid item xs={2} sx={{display: "flex", alignItems: "center"}}>
							<LoadingButton fullWidth component="label" variant="contained" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.calling} disabled={this.state.calling || this.state.vendaStatusList == null} onClick={this.getVendaListFromApi}>
								Atualizar
							</LoadingButton>
						</Grid>
					</Grid>
					<Divider/>
					<Box sx={{ flexGrow: 1 }}>
						<DataGrid
							rows={this.state.vendaRows}
							columns={this.columns}
							disableRowSelectionOnClick
							autoHeight
							initialState={{
							    pagination: { paginationModel: { pageSize: 10 } },
							    sorting: {
							    	sortModel: [{ field: 'dataVenda', sort: 'desc' }],
							    }
							  }}
							pageSizeOptions={[10, 30, 50, 100]}
							loading={this.state.vendaList == null || this.state.calling}
							sx={{marginBottom: 3}}
						/>
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
	const location = useLocation();
	const navigate = useNavigate();
	return <VendasModule params={params} location={location} navigate={navigate} {...props}/>
}