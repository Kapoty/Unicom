import React, {memo} from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarDensitySelector, gridClasses, useGridApiRef, GridToolbarFilterButton } from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddCardIcon from '@mui/icons-material/AddCard';
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
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers-pro';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import PreviewIcon from '@mui/icons-material/Preview';
import { useTheme } from "@mui/material/styles";
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon from '@mui/material/SvgIcon'

import TableCellSelectionIcon from '../assets/svg/table-cell-selection.svg';
import TableRowSelectionIcon from '../assets/svg/table-row-selection.svg';

import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import VendaStatusChip from '../components/VendaStatusChip';
import UsuarioDisplayChip from "../components/UsuarioDisplayChip";
import CustomDataGridPremium from "../components/CustomDataGridPremium";
import CreateEditVendaModule from "./CreateEditVendaModule";

import VendaStatusCategoriaEnum from "../model/VendaStatusCategoriaEnum";
import VendaTipoProdutoEnum from "../model/VendaTipoProdutoEnum";
import VendaTipoDataEnum from "../model/VendaTipoDataEnum";
import VendaProdutoTipoDeLinhaEnum from "../model/VendaProdutoTipoDeLinhaEnum";
import VendaPorteEnum from "../model/VendaPorteEnum";
import VendaFaturaStatusEnum from "../model/VendaFaturaStatusEnum";
import VendaFormaDePagamentoEnum from "../model/VendaFormaDePagamentoEnum";
import VendaBrscanEnum from "../model/VendaBrscanEnum";
import VendaSuporteEnum from "../model/VendaSuporteEnum";
import VendaReimputadoEnum from "../model/VendaReimputadoEnum";
import VendaTipoDeContaEnum from "../model/VendaTipoDeContaEnum";
import VendaInfraEnum from "../model/VendaInfraEnum";


import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

const VendaListDataGrid = memo(function VendaListDataGrid({ vendaRows, columns, vendaList, calling, vendaVisaoList, columnGroupingModel, apiRef, dataGridMaximized, maximizeDataGrid, dataGridRowSelection, toggleDataGridRowSelection, getVendaVisaoListFromApi, applyVendaVisao }) {
  console.log("VendaListDataGrid was rendered at", new Date().toLocaleTimeString());

  const theme = useTheme();

  const getRowHeight = React.useCallback(({id, densityFactor}) => 150 * densityFactor, []);

  return (
    <CustomDataGridPremium
		rows={vendaRows}
		columns={columns}
		initialState={vendaVisaoList[0].state}
		pageSizeOptions={[10, 30, 50, 100, 1000]}
		loading={calling}
		sx={{
			marginBottom: 1
		}}
		pagination
		headerFilters
		disableAggregation
		slots={{
			toolbar: CustomToolbar,
			headerFilterMenu: null,
		}}
		slotProps={{
			toolbar: {
				vendaVisaoList: vendaVisaoList,
				apiRef: apiRef,
				dataGridMaximized: dataGridMaximized,
				maximizeDataGrid: maximizeDataGrid,
				dataGridRowSelection: dataGridRowSelection,
				toggleDataGridRowSelection: toggleDataGridRowSelection,
				getVendaVisaoListFromApi: getVendaVisaoListFromApi,
				applyVendaVisao: applyVendaVisao,
			}
		}}
		//disableColumnFilter
		columnGroupingModel={columnGroupingModel}
		apiRef={apiRef}
		headerFilterHeight={70}
		cellSelection={!dataGridRowSelection}
		rowSelection={dataGridRowSelection}
	/>
  );
});

const GridToolbarVisao = memo(function GridToolbarVisao({vendaVisaoList, apiRef, getVendaVisaoListFromApi, applyVendaVisao}) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [nome, setNome] = React.useState("");
	const [addingVisao, setAddingVisao] = React.useState(false);
	const open = Boolean(anchorEl);
	const [calling, setCalling] = React.useState(false);
	const [errors, setErrors] = React.useState({});
	const [alertOpen, setAlertOpen] = React.useState(false);
	const [alert, setAlert] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteVendaVisao = (vendaVisaoId) => {
		api.delete(`/venda-visao/${vendaVisaoId}`)
			.then((response) => {
				getVendaVisaoListFromApi();
			})
			.catch((err) => {
				console.error(err);
			})
	}

	const patchVendaVisao = (vendaVisaoId) => {
		let data = {
			state: JSON.stringify(apiRef.current.exportState())
		}

		api.patch(`/venda-visao/${vendaVisaoId}`, data)
			.then((response) => {
				getVendaVisaoListFromApi();
			})
			.catch((err) => {
				console.error(err);
			})
	}

	const postVendaVisao = () => {
		setCalling(true);

		let data = {
			nome: nome,
			state: JSON.stringify(apiRef.current.exportState())
		}

		api.post(`/venda-visao/`, data)
			.then((response) => {
				getVendaVisaoListFromApi();
				setAddingVisao(false);
				setCalling(false);
				setErrors({});
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors ?? {};
				openAlert("error", "Falha ao salvar visão!");
				setCalling(false);
				setErrors(errors);
			})
	}

	const openAlert = (severity, message) => {
		setAlert(<Alert severity={severity} onClose={closeAlert}>{message}</Alert>);
		setAlertOpen(true);
	}

	const closeAlert = () => {
		setAlertOpen(false);
	}

	return (
		<Stack direction="row" spacing={1}>
			<Button
				startIcon={<PreviewIcon/>}
				onClick={handleClick}
				size="small"
			>
				Visão
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				>
				{vendaVisaoList.map(vendaVisao =>
					<MenuItem
						key={vendaVisao.vendaVisaoId}
						onClick={() => {applyVendaVisao(vendaVisao); handleClose()}}
						sx={{gap: 1}}
						selected={Boolean(vendaVisao.atual)}
					>
						{vendaVisao.nome}
						{vendaVisao.vendaVisaoId >= 0 && <React.Fragment>
							<IconButton size="small" edge="end" onClick={(e) => {e.stopPropagation(); patchVendaVisao(vendaVisao.vendaVisaoId)}}>
					        	<SaveIcon/>
				      		</IconButton>
				      		<IconButton size="small" edge="end" onClick={(e) => {e.stopPropagation(); deleteVendaVisao(vendaVisao.vendaVisaoId)}}>
					        	<DeleteIcon/>
				      		</IconButton>
				      	</React.Fragment>}
					</MenuItem>
				)}
			</Menu>
			<Button
				startIcon={<AddIcon/>}
				onClick={() => {setAddingVisao(true); setNome(""); setErrors({});}}
				size="small"
			>
				Salvar Visão
			</Button>
			<Dialog onClose={() => setAddingVisao(false)} open={addingVisao}>
				<DialogTitle>Salvar Visão</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						size="small"
						label="Nome"
						variant="standard"
						fullWidth
						error={"nome" in errors}
						helperText={errors?.nome ?? ""}
					/>
					<Collapse in={alertOpen} sx={{marginTop: 3}}>
						{alert}
					</Collapse>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={() => setAddingVisao(false)}>
						Cancelar
					</Button>
					<Button onClick={postVendaVisao}>
						Salvar
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
	}
)

const CustomToolbar = memo(function CustomToolbar({vendaVisaoList, apiRef, dataGridMaximized, maximizeDataGrid, dataGridRowSelection, toggleDataGridRowSelection, getVendaVisaoListFromApi, applyVendaVisao}) {
	return (
		<GridToolbarContainer>
			<Tooltip title={dataGridMaximized ? "Reduzir" : "Maximizar"}>
				<IconButton color="primary" onClick={maximizeDataGrid}>
					<Icon>{dataGridMaximized ? "fullscreen_exit" : "fullscreen"}</Icon>
				</IconButton>
			</Tooltip>
			<Tooltip title={dataGridRowSelection ? "Modo de Seleção de Linhas" : "Modo de Seleção de Células"}>
	  		<IconButton color="primary" onClick={toggleDataGridRowSelection}>
	  			<SvgIcon component={dataGridRowSelection ? TableRowSelectionIcon : TableCellSelectionIcon} inheritViewBox />
	  		</IconButton>
	  	</Tooltip>
			<GridToolbarVisao vendaVisaoList={vendaVisaoList} apiRef={apiRef} getVendaVisaoListFromApi={getVendaVisaoListFromApi} applyVendaVisao={applyVendaVisao}/>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector/>
			<GridToolbarExport />
		</GridToolbarContainer>
	);
});

class VendasModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			vendaList: null,

			vendaStatusList: null,
			vendaStatusByVendaStatusId: null,
			usuarioList: null,
			usuarioByUsuarioId: null,
			filtroVenda: null,
			sistemaList: null,
			sistemaBySistemaId: null,
			pontoDeVendaList: null,
			pontoDeVendaById: {},
			viabilidadeList: null,
			viabilidadeByViabilidadeId: {},

			vendaRows: [],
			vendaListDataGridApiRef: this.props.vendaListDataGridApiRef,

			dataGridMaximized: false,
			dataGridRowSelection: false,

			// visao

			vendaVisaoList: [],

			// filtros

			tipoProduto: null,
			pdv: "",
			safra: null,
			tipoData: null,
			dataInicio: null,
			dataFim: null,
			statusIdList: [],
			os: "",
			cpf: "",
			nome: "",

			calling: false,

			errors: {},

			alertOpen: false,
			alert: null,

			// editar venda inline
			editingVendaId: -1,
		}

		this.state = {...this.state, ...this.getCleanFilters()};

		this.columnGroupingModel = [
			/*{
				groupId: 'Dados do Cliente',
				freeReordering: true,
				children: [{ field: 'cpf' }, {field: 'nome'}],
			},*/
		];

		this.numeroFaturas = 14;

		this.columns = [
			{ field: 'statusId', headerName: 'Status', valueGetter: (value, row) => this.state.vendaStatusByVendaStatusId?.[value]?.nome, width: 275, renderCell: (params) =>
				<Stack direction="row" justifyContent="space-around" alignItems="center" spacing={1} height="100%">
					<VendaStatusChip
						sx={{flexGrow: 1, overflow: "hidden"}}
						vendaStatus={this.state.vendaStatusByVendaStatusId?.[params.row.statusId]}
						onClick={() => this.setState({editingVendaId: params.row.vendaId})}
					/>
				 	<IconButton onClick={() => this.props.navigate("/vendas/" + params.row.vendaId)} /*sx={{position: "absolute", right: 3, top: "50%", transform: "translate(0, -50%)"}}*/>
						<KeyboardArrowRightIcon />
					</IconButton>
				</Stack>
			},
			{ field: 'dataStatus', headerName: 'Data do Status', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'cpf', headerName: 'CPF/CNPJ', width: 200 },
			{ field: 'nome', headerName: 'Nome/Razão Social', width: 200 },
			{ field: 'dataCadastro', headerName: 'Data do Cadastro', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'tipoPessoa', headerName: 'Tipo Pessoa', width: 100 },
			{ field: 'tipoProduto', headerName: 'Tipo Produto', width: 100 },
			{ field: 'pdv', headerName: 'PDV', width: 100 },
			{ field: 'safra', headerName: 'Safra', width: 100, valueGetter: (value, row) => value !== null ? dayjs(value).format('MMMM YYYY') : "" },
			{ field: 'dataVenda', headerName: 'Data da Venda', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'loginVendedor', headerName: 'Login Vendedor', width: 200 },
			{ field: 'cadastradorId', headerName: 'Cadastrador', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.cadastradorId]}/>},
			{ field: 'agenteBiometriaId', headerName: 'Agente Biometria', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.agenteBiometriaId]}/>},
			{ field: 'agenteSuporteId', headerName: 'Agente Suporte', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.agenteSuporteId]}/>},
			{ field: 'sistemaId', headerName: 'Sistema', valueGetter: (value, row) => this.state.sistemaBySistemaId?.[value]?.nome, width: 150 },
			{ field: 'auditorId', headerName: 'Auditor', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.auditorId]}/>},
			{ field: 'os', headerName: 'OS', width: 100 },
			{ field: 'custcode', headerName: 'Cust-Code', width: 100 },
			{ field: 'ordem', headerName: 'Ordem', width: 100 },
			{ field: 'origem', headerName: 'Mailing/Origem', width: 200 },
			{ field: 'infra', headerName: 'Infra', width: 200 },
			{ field: 'vendedorId', headerName: 'Vendedor', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.vendedorId]}/>},
			{ field: 'supervisorId', headerName: 'Supervisor', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.supervisorId]}/>},
			{ field: 'vendedorExterno', headerName: 'Vendedor Externo', width: 200 },
			{ field: 'supervisorExterno', headerName: 'Supervisor Externo', width: 200 },
			{ field: 'auditorExterno', headerName: 'Auditor Externo', width: 200 },
			{ field: 'cadastradorExterno', headerName: 'Cadastrador Externo', width: 200 },
			{ field: 'agenteBiometriaExterno', headerName: 'Agente Biometria Externo', width: 200 },
			{ field: 'agenteSuporteExterno', headerName: 'Agente Suporte Externo', width: 200 },
			{ field: 'vendedorReal', headerName: 'Vendedor Real', width: 200 , valueGetter: (value, row) => typeof value == "string" ? value : this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => typeof params.row.vendedorReal == "string" ? params.row.vendedorReal : <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.vendedorReal]}/>},
			{ field: 'supervisorReal', headerName: 'Supervisor Real', width: 200 , valueGetter: (value, row) => typeof value == "string" ? value : this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => typeof params.row.supervisorReal == "string" ? params.row.supervisorReal : <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.supervisorReal]}/>},
			{ field: 'auditorReal', headerName: 'Auditor Real', width: 200 , valueGetter: (value, row) => typeof value == "string" ? value : this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => typeof params.row.auditorReal == "string" ? params.row.auditorReal : <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.auditorReal]}/>},
			{ field: 'cadastradorReal', headerName: 'Cadastrador Real', width: 200 , valueGetter: (value, row) => typeof value == "string" ? value : this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => typeof params.row.cadastradorReal == "string" ? params.row.cadastradorReal : <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.cadastradorReal]}/>},
			{ field: 'agenteBiometriaReal', headerName: 'Agente Biometria Real', width: 200 , valueGetter: (value, row) => typeof value == "string" ? value : this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => typeof params.row.agenteBiometriaReal == "string" ? params.row.agenteBiometriaReal : <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.agenteBiometriaReal]}/>},
			{ field: 'agenteSuporteReal', headerName: 'Agente Suporte Real', width: 200 , valueGetter: (value, row) => typeof value == "string" ? value : this.state.usuarioByUsuarioId?.[value]?.nome, width: 200, renderCell: (params) => typeof params.row.agenteSuporteReal == "string" ? params.row.agenteSuporteReal : <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.agenteSuporteReal]}/>},
			{ field: 'totalDeProdutos', headerName: 'N° de Produtos', width: 100 },
			{ field: 'produto', headerName: 'Produto', width: 200 },
			{ field: 'valor', headerName: 'Valor', width: 100 },
			{ field: 'quantidade', headerName: 'Quantidade', width: 100 },
			{ field: 'telefoneFixo', headerName: 'Telefone Fixo', width: 200 },
			{ field: 'valorTelefoneFixo', headerName: 'Valor Telefone Fixo', width: 200 },
			{ field: 'numeroTelefoneFixo', headerName: 'Número Telefone Fixo', width: 200 },
			{ field: 'tipoDeLinha', headerName: 'Tipo de Linha', width: 200 },
			{ field: 'ddd', headerName: 'DDD', width: 100 },
			//{ field: 'operadora', headerName: 'Operadora', width: 150 },

			{ field: 'uf', headerName: 'UF', width: 100 },
			{ field: 'cidade', headerName: 'Cidade', width: 200 },
			{ field: 'bairro', headerName: 'Bairro', width: 200 },

			{ field: 'porte', headerName: 'Porte', width: 200 },
			{ field: 'nomeContato', headerName: 'Nome Contato', width: 200 },

			{ field: 'contato1', headerName: 'Contato 1', width: 200 },
			{ field: 'contato2', headerName: 'Contato 2', width: 200 },
			{ field: 'contato3', headerName: 'Contato 3', width: 200 },
			{ field: 'dataPreferenciaInstalacao1', headerName: 'Data Preferência Instação 1', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataPreferenciaInstalacao2', headerName: 'Data Preferência Instação 2', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'email', headerName: 'Email', width: 200 },
			{ field: 'observacao', headerName: 'Observação', width: 200 },

			{ field: 'formaDePagamento', headerName: 'Forma de Pagamento', width: 200 },
			{ field: 'vencimento', headerName: 'Vencimento', width: 100 },
			{ field: 'agencia', headerName: 'Agencia', width: 100 },
			{ field: 'conta', headerName: 'Conta', width: 100 },
			{ field: 'tipoDeConta', headerName: 'Tipo de Conta', width: 100 },
			{ field: 'banco', headerName: 'Banco', width: 100 },

			{ field: 'dataAgendamento', headerName: 'Data de Agendamento', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataInstalacao', headerName: 'Data de Instalação', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataAtivacao', headerName: 'Data da Ativação', width: 200, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },

			{ field: 'vendaOriginal', headerName: 'Venda Original', width: 200 },
			{ field: 'brscan', headerName: 'Biometria', width: 200 },
			{ field: 'suporte', headerName: 'Suporte', width: 200 },
			{ field: 'prints', headerName: 'Prints', width: 100 },
			{ field: 'reimputado', headerName: 'Reimputado', width: 100 },
			{ field: 'operadora', headerName: 'Operadora', width: 200 },
			{ field: 'viabilidadeId', headerName: 'Viabilidade', valueGetter: (value, row) => this.state.viabilidadeByViabilidadeId?.[value]?.nome, width: 150 },

			{ field: 'situacao', headerName: 'Situação', width: 200 },
		];

		for (let i=1; i<=this.numeroFaturas; i++) {
			this.columns.push({ field: `m${i}Mes`, headerName: `M${i} Mês`, width: 150, valueGetter: (value, row) => value !== null ? dayjs(value).format('MMMM YYYY') : "" });
			this.columns.push({ field: `m${i}Status`, headerName: `M${i} Status`, width: 100});
			this.columns.push({ field: `m${i}Valor`, headerName: `M${i} Valor`, width: 100});
		}

		this.allHiddenColumnVisibilityModel = {};
		Object.keys(this.columns).forEach((column) => this.allHiddenColumnVisibilityModel[this.columns[column].field] = false);

		this.defaultColumnDimensions = {};
		this.columns.forEach((column) => this.defaultColumnDimensions[column.field] = {width: column.width});

		this.fixedVendaVisaoList = [
			{
				vendaVisaoId: -1,
				nome: "Padrão",
				state: {
					columns: {
						columnVisibilityModel: {
							...this.allHiddenColumnVisibilityModel,
							statusId: true,
							dataStatus: true,
							tipoPessoa: true,
							tipoProduto: true,
							pdv: true,
							safra: true,
							dataVenda: true,
							dataAgendamento: true,
							os: true,
							ordem: true,
							loginVendedor: true,
							dataInstalacao: true,
							vendedorId: true,
							supervisorId: true,
							produto: true,
							valor: true,
							quantidade: true,
							uf: true,
							cpf: true,
							nome: true,
							contato1: true,
							observacao: true,
						},
						orderedFields: [
								"statusId",
								"dataStatus",
								"tipoPessoa",
								"tipoProduto",
								"pdv",
								"safra",
								"os",
								"ordem",
								"dataVenda",
								"dataAgendamento",
								"dataInstalacao",
								"loginVendedor",
								"vendedorId",
								"supervisorId",
								"produto",
								"valor",
								"quantidade",
								"cpf",
								"nome",
								"contato1",
								"uf",
								"observacao"
							],
						dimensions: {
							...this.defaultColumnDimensions
						}
					},
					pagination: { paginationModel: { pageSize: 100 } },
					sorting: {
						sortModel: [{ field: 'dataStatus', sort: 'desc' }],
					},
					pinnedColumns: { left: ['statusId'] },
					density: "compact",
					filter: {
						filterModel: {
							items: [],
							logicOperator: "and",
							quickFilterValues: [],
							quickFilterLogicOperator: "and"
						}
					},
				},
				atual: true,
			}
		];

		this.state.vendaVisaoList = [...this.fixedVendaVisaoList];

		/*for (let j=3; j<=4; j++) {
			for (let i=1; i<=this.numeroFaturas; i++) {
				this.fixedVendaVisaoList[j].state.columns.columnVisibilityModel[`m${i}Mes`] = true;
				this.fixedVendaVisaoList[j].state.columns.columnVisibilityModel[`m${i}Status`] = true;
				this.fixedVendaVisaoList[j].state.columns.columnVisibilityModel[`m${i}Valor`] = true;
			}
		}*/

		this.getVendaListFromApi = this.getVendaListFromApi.bind(this);
		this.getVendaFromApi = this.getVendaFromApi.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getFiltroVendaFromApi = this.getFiltroVendaFromApi.bind(this);
		this.getSistemaListFromApi = this.getSistemaListFromApi.bind(this);
		this.getPontoDeVendaListFromApi = this.getPontoDeVendaListFromApi.bind(this);
		this.getViabilidadeListFromApi = this.getViabilidadeListFromApi.bind(this);
		this.getVendaVisaoListFromApi =  this.getVendaVisaoListFromApi.bind(this);
		this.updateVendaVisaoAtual = this.updateVendaVisaoAtual.bind(this);

		this.applyVendaVisao = this.applyVendaVisao.bind(this);

		this.calculateRows = this.calculateRows.bind(this);
		this.calculateRow = this.calculateRow.bind(this);
		this.updateVendaRow = this.updateVendaRow.bind(this);
		this.closeEditingVenda = this.closeEditingVenda.bind(this);

		this.resetFilters = this.resetFilters.bind(this);

		this.maximizeDataGrid = this.maximizeDataGrid.bind(this);
		this.toggleDataGridRowSelection = this.toggleDataGridRowSelection.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		console.log("VendasModule was mounted at", new Date().toLocaleTimeString());
		this.getVendaStatusListFromApi();
		this.getUsuarioListFromApi();
		this.getSistemaListFromApi();
		this.getPontoDeVendaListFromApi();
		this.getViabilidadeListFromApi();
		this.getVendaVisaoListFromApi();
	}

	/*shouldComponentUpdate(newProps, newState) {
		if (this.props.location.pathname == `/vendas` || newProps.location.pathname == `/vendas`)
			return true;
		return false;
	}*/

	getCleanFilters() {
		return {
			tipoProduto: null,
			pdv: "",
			safra: dayjs().date(1),
			tipoData: null,
			dataInicio: null,//dayjs().date(1),
			dataFim: null,//dayjs(),
			statusIdList: (this.state.vendaStatusList ?? []).map((vendaStatus) => vendaStatus.vendaStatusId),
			os: "",
			cpf: "",
			nome: "",
		}
	}

	resetFilters(callback) {
		this.setState({...this.getCleanFilters()}, callback);
	}

	getVendaListFromApi() {
		this.setState({calling: true})
		api.post("/venda/venda-list", {
				tipoProduto: this.state.tipoProduto,
				pdv: this.state.pdv,
				safra: this.state.safra !== null ? this.state.safra.format("YYYY-MM-DD") : null,
				tipoData: this.state.tipoData,
				dataInicio: this.state.dataInicio !== null ? this.state.dataInicio.format("YYYY-MM-DD") : null,
				dataFim: this.state.dataFim !== null ? this.state.dataFim.format("YYYY-MM-DD") : null,
				statusIdList: this.state.statusIdList,
				os: this.state.os,
				cpf: this.state.cpf.replace(/\D/g, ""),
				nome: this.state.nome,
			})
			.then((response) => {
				this.setState({vendaList: response.data, errors: {}, calling: false}, () => this.calculateRows());
				this.openAlert("success", "Vendas atualizadas!");
			})
			.catch((err) => {
				this.setState({calling: false, errors: err?.response?.data?.errors ?? {}});
				this.openAlert("error", "Falha ao atualizar vendas!");
			});
	}

	getVendaFromApi(vendaId) {
		this.setState({calling: true})
		api.get(`/venda/${vendaId}`)
			.then((response) => {
				this.setState({calling: false}, () => this.updateVendaRow(response.data));
				this.openAlert("success", "Venda atualizada!");
			})
			.catch((err) => {
				this.setState({calling: false, errors: err?.response?.data?.errors ?? {}});
				this.openAlert("error", "Falha ao atualizar venda!");
			});
	}

	getVendaStatusListFromApi() {
		api.get("/empresa/me/venda-status")
			.then((response) => {
				let vendaStatusList = response.data;
				let vendaStatusByVendaStatusId = {};
				vendaStatusList.forEach((vendaStatus) => vendaStatusByVendaStatusId[vendaStatus.vendaStatusId] = vendaStatus);
				this.setState({vendaStatusList: vendaStatusList, vendaStatusByVendaStatusId: vendaStatusByVendaStatusId}, () => this.getFiltroVendaFromApi());
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendaStatusListFromApi, 3000);
			});
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
				console.log(err);
				setTimeout(this.getUsuarioListFromApi, 3000);
			});
	}

	getSistemaListFromApi() {
		api.get("/empresa/me/sistema")
			.then((response) => {
				let sistemaList = response.data;
				let sistemaBySistemaId = {};
				sistemaList.forEach((sistema) => sistemaBySistemaId[sistema.sistemaId] = sistema);
				this.setState({sistemaList: sistemaList, sistemaBySistemaId: sistemaBySistemaId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getSistemaListFromApi, 3000);
			});
	}

	getPontoDeVendaListFromApi() {
		api.get("/empresa/me/ponto-de-venda")
			.then((response) => {
				let pontoDeVendaList = response.data;
				let pontoDeVendaById = {};
				pontoDeVendaList.forEach((pontoDeVenda) => pontoDeVendaById[pontoDeVenda.pontoDeVendaId] = pontoDeVenda);
				this.setState({pontoDeVendaList: pontoDeVendaList, pontoDeVendaById: pontoDeVendaById});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getPontoDeVendaListFromApi, 3000);
			});
	}

	getViabilidadeListFromApi() {
		api.get("/empresa/me/viabilidade")
			.then((response) => {
				let viabilidadeList = response.data;
				let viabilidadeByViabilidadeId = {};
				viabilidadeList.forEach((viabilidade) => viabilidadeByViabilidadeId[viabilidade.viabilidadeId] = viabilidade);
				this.setState({viabilidadeList: viabilidadeList, viabilidadeByViabilidadeId: viabilidadeByViabilidadeId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getViabilidadeListFromApi, 3000);
			});
	}

	getFiltroVendaFromApi() {
		api.get("/usuario/me/filtro-venda")
			.then((response) => {
				try {
					let filtroVenda = response.data;
					this.setState({
						filtroVenda: filtroVenda,
						tipoProduto: filtroVenda.tipoProduto,
						pdv: filtroVenda.pdv,
						safra: filtroVenda.safra !== null ? dayjs(filtroVenda.safra, "YYYY-MM-DD") : null,
						tipoData: filtroVenda.tipoData,
						dataInicio: filtroVenda.dataInicio !== null ? dayjs(filtroVenda.dataInicio, "YYYY-MM-DD") : null,
						dataFim: filtroVenda.dataFim !== null ? dayjs(filtroVenda.dataFim, "YYYY-MM-DD") : null,
						statusIdList: filtroVenda.statusIdList.split(",").map(statusId => parseInt(statusId) ?? 1).filter((statusId) => statusId in this.state.vendaStatusByVendaStatusId),
						os: filtroVenda.os,
						cpf: filtroVenda.cpf,
						nome: filtroVenda.nome,
					}, () => this.getVendaListFromApi());
				} catch (e) {
					console.log(e);
					this.resetFilters(() => this.getVendaListFromApi());
				}
			})
			.catch((err) => {
				console.log(err);
				if (err?.response?.status == 404) {
					this.resetFilters(() => this.getVendaListFromApi());
					return;
				}
				setTimeout(this.getFiltroVendaFromApi, 3000);
			});
	}

	getVendaVisaoListFromApi() {
		api.get("/usuario/me/venda-visao")
			.then((response) => {
				let vendaVisaoList = response.data;
				vendaVisaoList.forEach((vendaVisao) => {
					try {
						vendaVisao.state = JSON.parse(vendaVisao.state);
					} catch (e) {
						vendaVisao.state = {};
					}
				});
				this.setState({vendaVisaoList: [...this.fixedVendaVisaoList, ...vendaVisaoList]}, () => {
					let vendaVisaoAtual = 0;
					let i;
					for (i=this.fixedVendaVisaoList.length; i<this.state.vendaVisaoList.length; i++) {
						if (this.state.vendaVisaoList[i].atual) {
							vendaVisaoAtual = i;
							break;
						}
					}
					this.applyVendaVisao(this.state.vendaVisaoList[vendaVisaoAtual]);
				});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendaVisaoListFromApi, 3000);
			});
	}

	applyVendaVisao(vendaVisao) {
		let vendaVisaoList = this.state.vendaVisaoList;
		vendaVisaoList.forEach(_vendaVisao => _vendaVisao.vendaVisaoId == vendaVisao.vendaVisaoId ? _vendaVisao.atual = true : _vendaVisao.atual = false);
		this.setState({vendaVisaoList: [...vendaVisaoList]});

		let {columns, filter, sorting, density, pinnedColumns} = vendaVisao.state;

		this.state.vendaListDataGridApiRef.current.restoreState({
			columns: columns,
			//filter: filter,
			sorting: sorting,
			density: density,
			pinnedColumns: pinnedColumns,
		});

		this.updateVendaVisaoAtual(vendaVisao.vendaVisaoId);
	}

	updateVendaVisaoAtual(vendaVisaoId) {
		api.post("/venda-visao/" + vendaVisaoId + "/atual")
			.then((response) => {
				
			})
			.catch((err) => {
				console.log(err);
			});
	}

	calculateRows() {
		let vendaRows = this.state.vendaList.map((venda) => this.calculateRow(venda));
		this.setState({vendaRows: vendaRows});
	}

	calculateRow(venda) {

		let situacao = "Adimplente";
		for (let i=0; i<venda.faturaList.length; i++) {
			if (venda.faturaList[i].status == "EM_ABERTO") {
				situacao = "Inadimplente";
				break;
			}
		}

		let row = {
			id: venda.vendaId,
			vendaId: venda.vendaId,
			statusId: venda.statusId,

			tipoPessoa: venda.tipoPessoa,
			tipoProduto: venda.tipoProduto,
			pdv: venda.pdv,
			safra: venda.safra !== null ? new Date(venda.safra + "T00:00:00") : null,
			dataVenda: venda.dataVenda !== null ? new Date(venda.dataVenda) : null,
			loginVendedor: venda.loginVendedor,
			cadastradorId: venda.cadastradorId,
			agenteBiometriaId: venda.agenteBiometriaId,
			agenteSuporteId: venda.agenteSuporteId,
			sistemaId: venda.sistemaId,
			auditorId: venda.auditorId,
			os: venda.os,
			custcode: venda.custcode,
			ordem: venda.ordem,
			origem: venda.origem,
			infra: venda?.infra !== null ? VendaInfraEnum[venda.infra] : "",
			vendedorId: venda.vendedorId,
			supervisorId: venda.supervisorId,
			vendedorExterno: venda.vendedorExterno,
			supervisorExterno: venda.supervisorExterno,
			auditorExterno: venda.auditorExterno,
			cadastradorExterno: venda.cadastradorExterno,
			agenteBiometriaExterno: venda.agenteBiometriaExterno,
			agenteSuporteExterno: venda.agenteSuporteExterno,
			vendedorReal: venda.vendedorId ?? venda.vendedorExterno,
			supervisorReal: venda.supervisorId ?? venda.supervisorExterno,
			auditorReal: venda.auditorId ?? venda.auditorExterno,
			cadastradorReal: venda.cadastradorId ?? venda.cadastradorExterno,
			agenteBiometriaReal: venda.agenteBiometriaId ?? venda.agenteBiometriaExterno,
			agenteSuporteReal: venda.agenteSuporteId ?? venda.agenteSuporteExterno,

			produtoList: venda.produtoList,
			totalDeProdutos: venda.produtoList.length,
			produto: venda.produtoList?.[0]?.nome ?? "",
			valor: venda.produtoList?.[0] ? ("R$ " + (venda.produtoList?.[0].valor).toFixed(2).replace('.', ',')) : "",
			quantidade: venda.produtoList?.[0]?.quantidade ?? "",
			telefoneFixo: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.telefoneFixo ? "Sim" : "Não") : "",
			valorTelefoneFixo: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.telefoneFixo ? ("R$ " + (venda.produtoList?.[0]?.valorTelefoneFixo ?? 0).toFixed(2)) : "") : "",
			numeroTelefoneFixo: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.numeroTelefoneFixo.replace(/(\d{4})(\d{4})/, "$1-$2") ?? "") : "",
			tipoDeLinha: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.tipoDeLinha !== null ? VendaProdutoTipoDeLinhaEnum[venda.produtoList?.[0]?.tipoDeLinha] : "") : "",
			ddd: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.ddd) : "",
			//operadora: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.operadora) : "",

			uf: venda.uf,
			cidade: venda.cidade,
			bairro: venda.bairro,

			porte: venda?.porte !== null ? VendaPorteEnum[venda.porte] : "",
			cpf: venda.tipoPessoa == "CPF" ? venda.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : venda.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4.$5"),
			nome: venda.tipoPessoa == "CPF" ? venda.nome : venda.razaoSocial,
			nomeContato: venda.nomeContato,

			contato1: venda.contato1.length > 10 ? venda.contato1.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4") : venda.contato1.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3"),
			contato2: venda.contato2.length > 10 ? venda.contato2.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4") : venda.contato2.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3"),
			contato3: venda.contato3.length > 10 ? venda.contato3.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4") : venda.contato3.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3"),
			dataPreferenciaInstalacao1: venda.dataPreferenciaInstalacao1 !== null ? new Date(venda.dataPreferenciaInstalacao1) : null,
			dataPreferenciaInstalacao2: venda.dataPreferenciaInstalacao1 !== null ? new Date(venda.dataPreferenciaInstalacao2) : null,
			email: venda.email,
			observacao: venda.observacao,	

			formaDePagamento: venda?.formaDePagamento !== null ? VendaFormaDePagamentoEnum[venda.formaDePagamento] : "",
			vencimento: venda.vencimento,
			agencia: venda.agencia,
			conta: venda.conta,
			tipoDeConta: venda?.tipoDeconta !== null ? VendaTipoDeContaEnum[venda.tipoDeConta] : "",
			banco: venda.banco,

			dataStatus: venda.dataStatus !== null ? new Date(venda.dataStatus) : null,
			dataAtivacao: venda.dataAtivacao !== null ? new Date(venda.dataAtivacao) : null,
			dataAgendamento: venda.dataAgendamento !== null ? new Date(venda.dataAgendamento) : null,
			dataInstalacao: venda.dataInstalacao !== null ? new Date(venda.dataInstalacao) : null,
			dataCadastro: venda.dataCadastro !== null ? new Date(venda.dataCadastro) : null,

			vendaOriginal: venda.vendaOriginal ? "Sim" : "Não",
			brscan: venda?.brscan !== null ? VendaBrscanEnum[venda.brscan] : "",
			suporte: venda?.suporte !== null ? VendaSuporteEnum[venda.suporte] : "",
			prints: venda.prints ? "Sim" : "Não",
			reimputado: venda?.reimputado !== null ? VendaReimputadoEnum[venda.reimputado] : "",
			operadora: venda.operadora,
			viabilidadeId: venda.viabilidadeId,

			situacao: situacao,

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

	closeEditingVenda() {
		if (this.state.editingVendaId == -1)
			return;
		this.getVendaFromApi(this.state.editingVendaId);
		this.setState({editingVendaId: -1});
	}

	maximizeDataGrid() {
		this.setState({dataGridMaximized: !this.state.dataGridMaximized})
	}

	toggleDataGridRowSelection() {
		this.setState({dataGridRowSelection: !this.state.dataGridRowSelection})
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert} variant="filled">{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
		console.log("VendasModule was rendered at", new Date().toLocaleTimeString());
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex"/*this.props.location.pathname == `/vendas` ? "flex" : "none"*/, flexDirection: "column", aligmItems: "center", justifyContent: "start", gap: 1}} className="modulePaper">
					<Box display={!this.state.dataGridMaximized ? "flex" : "none"} gap={1} flexDirection="column">
						<Stack direction="row" gap={3} alignItems="center">
							<Typography variant="h3">
								Vendas
							</Typography>
							<ButtonGroup>
									<Button variant="contained" size="large" startIcon={<AddCardIcon />} onClick={() => this.props.navigate("/vendas/novo")}>Nova Venda</Button>
							</ButtonGroup>
						</Stack>
						<Divider/>
						<Grid container spacing={1} sx={{maxWidth: 1500}}>
							<Grid item xs={3}>
								<FormControl fullWidth size="small">
									<InputLabel>Tipo do Produto</InputLabel>
									<Select
										id="tipo-prduto"
										value={this.state.tipoProduto ?? ""}
										label="Tipo do Produto"
										onChange={(e) => this.setState({tipoProduto: e.target.value !== "" ? e.target.value : null})}
										>
										<MenuItem key={"nenhum"} value={""}>Ambos</MenuItem>
										{Object.keys(VendaTipoProdutoEnum).map((tipoProduto) => <MenuItem key={tipoProduto} value={tipoProduto}>{VendaTipoProdutoEnum[tipoProduto]}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={3}>
								<Autocomplete
									id="pdv"
									freeSolo
									disableClearable
									options={(this.state.pontoDeVendaList ?? []).map(pontoDeVenda => pontoDeVenda.nome)}
									value={this.state.pdv}
									onInputChange={(event, value) => this.setState({pdv: value})}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											label="PDV"
										/>
									)}
									size="small"
								/>
							</Grid>
							<Grid item xs={3}>
								<DatePicker
									label="Safra"
									views={['month', 'year']}
									value={this.state.safra}
									onChange={(newValue) => this.setState({safra: newValue})}
									slotProps={{
										field: { clearable: true },
										textField: {
											fullWidth: true,
											error: "safra" in this.state.errors,
											helperText: this.state.errors?.safra ?? "",
											size: "small"
										},
									}}
								/>
							</Grid>
							<Grid item xs={3}>
								<Button fullWidth variant="outlined" size="large" onClick={() => this.resetFilters()}>Resetar Filtros</Button>
							</Grid>
							<Grid item xs={3}>
								<FormControl fullWidth size="small">
									<InputLabel>Tipo de Data</InputLabel>
									<Select
										id="tipo-de-data"
										value={this.state.tipoData ?? ""}
										label="Grupo de Status"
										onChange={(e) => this.setState({tipoData: e.target.value !== "" ? e.target.value : null})}
										>
										<MenuItem key={"nenhum"} value={""}>Nenhum</MenuItem>
										{Object.keys(VendaTipoDataEnum).map((tipoData) => <MenuItem key={tipoData} value={tipoData}>{VendaTipoDataEnum[tipoData]}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={4}>
								{this.state.tipoData !== null ?
									<Stack spacing={1}>
										<DateRangePicker
											localeText={{ start: 'Data Inicial', end: 'Data Final' }}
											value={[this.state.dataInicio, this.state.dataFim]}
											onChange={(newValue) => this.setState({dataInicio: newValue[0], dataFim: newValue[1]})}
											calendars={1}
											slotProps={{
												field: { clearable: true },
												textField: {
													fullWidth: true,
													error: "dataInicio" in this.state.errors || "dataValid" in this.state.errors || "dataRangeValid" in this.state.errors,
													helperText: this.state.errors?.dataInicio ?? this.state.errors?.dataValid ?? this.state.errors?.dataRangeValid ?? "",
													size: "small"
												},
											}}
										/>
										<ButtonGroup variant="text" size="small">
											<Button onClick={() => this.setState({dataInicio: dayjs(), dataFim: dayjs()})}>Hoje</Button>
											<Button onClick={() => this.setState({dataInicio: dayjs().day(0), dataFim: dayjs()})}>Esta semana</Button>
											<Button onClick={() => this.setState({dataInicio: dayjs().date(1), dataFim: dayjs()})}>Este mês</Button>
											<Button onClick={() => this.setState({dataInicio: dayjs().subtract(3, 'month'), dataFim: dayjs()})}>Últimos 3 meses</Button>
										</ButtonGroup>
									</Stack>
								: ""}
							</Grid>
							<Grid item xs={5}>
								<Stack spacing={1}>
									<Autocomplete
										multiple
										limitTags={3}
										disableListWrap
										id="venda-status"
										loading={this.state.vendaStatusList == null}
										options={(this.state.vendaStatusList ?? []).map((vendaStatus) => vendaStatus.vendaStatusId).sort((a, b) => this.state.vendaStatusByVendaStatusId[a].ordem - this.state.vendaStatusByVendaStatusId[b].ordem)}
										groupBy={(option) => VendaStatusCategoriaEnum?.[this.state.vendaStatusByVendaStatusId?.[option]?.categoria] ?? "Sem Categoria"}
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
											<VendaStatusChip
												vendaStatus={this.state.vendaStatusByVendaStatusId[option]}
												{...getTagProps({ index })}
											/>
											))
										}
										size="small"
									/>
									<ButtonGroup variant="text" size="small">
										<Button onClick={() => this.setState({statusIdList: []})}>Nenhum</Button>
										<Button onClick={() => this.setState({statusIdList: (this.state.vendaStatusList ?? []).map((vendaStatus) => vendaStatus.vendaStatusId)})}>Todos</Button>
									</ButtonGroup>
								</Stack>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="os"
									value={this.state.os}
									onChange={(e) => this.setState({os: e.target.value})}
									fullWidth
									label="OS"
									variant="outlined"
									disabled={this.state.calling}
									inputProps={{
										maxLength: 50,
									}}
									size="small"
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="cpf"
									value={this.state.cpf}
									onChange={(e) => this.setState({cpf: e.target.value})}
									fullWidth
									label="CPF/CNPJ"
									variant="outlined"
									disabled={this.state.calling}
									inputProps={{
										maxLength: 18,
									}}
									size="small"
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="nome"
									value={this.state.nome}
									onChange={(e) => this.setState({nome: e.target.value})}
									fullWidth
									label="Nome/Razão Social"
									variant="outlined"
									disabled={this.state.calling}
									inputProps={{
										maxLength: 200,
									}}
									size="small"
								/>
							</Grid>
							<Grid item xs={3} sx={{display: "flex", alignItems: "start"}}>
								<LoadingButton fullWidth component="label" variant="contained" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.calling} disabled={this.state.calling || this.state.vendaStatusList == null} onClick={this.getVendaListFromApi}>
									Atualizar
								</LoadingButton>
							</Grid>
						</Grid>
						<Divider/>
					</Box>
					<Box sx={{ flexGrow: 1, height: "1px", minHeight: "400px" }}>
						<VendaListDataGrid
							vendaRows={this.state.vendaRows}
							columns={this.columns}
							vendaList={this.state.vendaList}
							calling={this.state.calling}
							vendaVisaoList={this.state.vendaVisaoList}
							columnGroupingModel={this.columnGroupingModel}
							apiRef={this.state.vendaListDataGridApiRef}
							dataGridMaximized={this.state.dataGridMaximized}
							maximizeDataGrid={this.maximizeDataGrid}
							dataGridRowSelection={this.state.dataGridRowSelection}
							toggleDataGridRowSelection={this.toggleDataGridRowSelection}
							getVendaVisaoListFromApi={this.getVendaVisaoListFromApi}
							applyVendaVisao={this.applyVendaVisao}
						/>
					</Box>
					<Snackbar open={this.state.alertOpen} onClose={(e, reason) => (reason !== "clickaway") ? this.closeAlert() : ""} anchorOrigin={{vertical: "bottom", horizontal: "right"}} autoHideDuration={2000}>
						<div>{this.state.alert}</div>
					</Snackbar>
					<Dialog
						disableEscapeKeyDown
						open={this.state.editingVendaId !== -1}
						onClose={this.closeEditingVenda}
						fullWidth={true}
	        			maxWidth={"xl"}
					>
						<DialogTitle>Editar Venda</DialogTitle>
						<IconButton
							onClick={this.closeEditingVenda}
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
							<Box>
								<CreateEditVendaModule usuario={this.props.usuario} vendaId={this.state.editingVendaId} inlineMode/>
							</Box>
						</DialogContent>
					</Dialog>
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
	return <VendasModule params={params} location={location} navigate={navigate} vendaListDataGridApiRef={vendaListDataGridApiRef} {...props}/>
}