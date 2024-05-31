import React, {memo} from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarDensitySelector, gridClasses } from '@mui/x-data-grid-premium';
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
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers-pro';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import PreviewIcon from '@mui/icons-material/Preview';
import { useTheme } from "@mui/material/styles";
import Snackbar from '@mui/material/Snackbar';

import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import VendaStatusChip from '../components/VendaStatusChip';
import UsuarioDisplayStack from "../components/UsuarioDisplayStack";
import CustomDataGridPremium from "../components/CustomDataGridPremium";

import VendaStatusCategoriaMap from "../model/VendaStatusCategoriaMap";

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

const VendaListDataGrid = memo(function VendaListDataGrid({ vendaRows, columns, vendaList, calling, columnVisibilityModel, onColumnVisibilityModelChange, projecaoList, setColumnVisibilityModel, columnGroupingModel }) {
  console.log("VendaListDataGrid was rendered at", new Date().toLocaleTimeString());

  const theme = useTheme();

  return (
    <CustomDataGridPremium
		rows={vendaRows}
		columns={columns}
		initialState={{
		    pagination: { paginationModel: { pageSize: 100 } },
		    sorting: {
		    	sortModel: [{ field: 'dataVenda', sort: 'desc' }],
		    },
		    pinnedColumns: { left: ['statusId'] },
		    density: "standard"
		  }}
		pageSizeOptions={[10, 30, 50, 100, 1000]}
		loading={calling}
		sx={{
			marginBottom: 3,
			height: 1000,
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
				projecaoList: projecaoList,
				setColumnVisibilityModel: setColumnVisibilityModel
			}
		}}
		disableColumnFilter
		columnVisibilityModel={columnVisibilityModel}
		onColumnVisibilityModelChange={onColumnVisibilityModelChange}
		columnGroupingModel={columnGroupingModel}
	/>
  );
});

const GridToolbarProjecao = memo(function GridToolbarProjecao({projecaoList, setColumnVisibilityModel}) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box>
			<Button
				startIcon={<PreviewIcon/>}
				onClick={handleClick}
				size="small"
			>
				Projeção
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				>
				{projecaoList.map(projecao => <MenuItem key={projecao.value} onClick={() => {setColumnVisibilityModel(projecao.columnVisibilityModel); handleClose()}}>{projecao.nome}</MenuItem>)}
				
			</Menu>
		</Box>
	);
	}
)

const CustomToolbar = memo(function CustomToolbar({projecaoList, setColumnVisibilityModel}) {
	return (
		<GridToolbarContainer>
			<GridToolbarProjecao projecaoList={projecaoList} setColumnVisibilityModel={setColumnVisibilityModel}/>
			<GridToolbarColumnsButton />
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

			vendaRows: [],

			// projecao

			columnVisibilityModel: {},
			projecao: "TUDO",

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
			alert: null
		}

		this.state = {...this.state, ...this.getCleanFilters()};

		this.tipoDataList = [
			{nome: "Data da Venda", value: "DATA_VENDA"},
			{nome: "Data do Status", value: "DATA_STATUS"},
			{nome: "Data da Ativação", value: "DATA_ATIVACAO"},
			{nome: "Data de Agendamento", value: "DATA_AGENDAMENTO"},
			{nome: "Data da Instalação", value: "DATA_INSTALACAO"},
			{nome: "Data do Cadastro", value: "DATA_CADASTRO"},
		];

		this.tipoProdutoEnum = [
			{nome: "Fibra", value: "FIBRA"},
			{nome: "Móvel", value: "MOVEL"},
		];
		this.tipoDeLinhaMap = {
			"NOVA": "Nova",
			"PORTABILIDADE": "Portabilidade",
			"TT": "TT",
		};
		this.faturaStatusMap = {
			"NA": "N/A",
			"A_VENCER": "A Vencer",
			"EM_ABERTO": "Em Aberto",
			"PAGA": "Paga",
			"MULTA": "Multa",
			"CHURN": "Churn",
			"PARCELADA": "Parcelada"
		};
		this.porteMap = {
			"MEI": "MEI",
			"LTDA": "LTDA",
		};
		this.formaDePagamentoMap = {
			"BOLETO": "Boleto",
			"DEBITO_AUTOMATICO": "Débito Automático",
			"CARTAO_CREDITO": "Cartão de Crédito"
		}
		this.brscanMap = {
			"SIM": "Sim",
			"NAO": "Não",
			"EXCECAO": "Exceção",
			"CANCELADA_INTERNAMENTE": "Cancelada Internamente",
			"AGUARDANDO_ACEITE_DIGITAL": "Aguardando Aceite Digital",
			"SEM_WHATSAPP": "Sem Whatsapp"
		};
		this.suporteMap = {
			"SIM": "Sim",
			"NAO": "Não",
			"EXCECAO": "Exceção",
			"CANCELADA_INTERNAMENTE": "Cancelada Internamente",
		};
		this.faturaStatusMap = {
			"NA": "N/A",
			"A_VENCER": "A Vencer",
			"EM_ABERTO": "Em Aberto",
			"PAGA": "Paga",
			"MULTA": "Multa",
			"CHURN": "Churn",
		};

		this.columnGroupingModel = [
			/*{
				groupId: 'Dados do Cliente',
				freeReordering: true,
				children: [{ field: 'cpf' }, {field: 'nome'}],
			},*/
		];

		this.numeroFaturas = 14;

		this.columns = [
			{ field: 'statusId', headerName: 'Status', valueGetter: (value, row) => this.state.vendaStatusByVendaStatusId?.[value]?.nome, minWidth: 200, flex: 1, hideable: false, renderCell: (params) => <VendaStatusChip
				vendaStatus={this.state.vendaStatusByVendaStatusId?.[params.row.statusId]}
				onClick={() => this.props.navigate("/vendas/" + params.row.vendaId)}
			/>},
			{ field: 'dataStatus', headerName: 'Data do Status', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataCadastro', headerName: 'Data do Cadastro', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'tipoProduto', headerName: 'Tipo', minWidth: 100, flex: 1 },
			{ field: 'pdv', headerName: 'PDV', minWidth: 100, flex: 1 },
			{ field: 'safra', headerName: 'Safra', minWidth: 100, flex: 1, valueGetter: (value, row) => value !== null ? dayjs(value).format('MMMM YYYY') : "" },
			{ field: 'dataVenda', headerName: 'Data da Venda', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'loginVendedor', headerName: 'Login Vendedor', minWidth: 200, flex: 1 },
			{ field: 'cadastradorId', headerName: 'Cadastrador', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, minWidth: 200, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[params.row.cadastradorId]}/>},
			{ field: 'sistemaId', headerName: 'Sistema', valueGetter: (value, row) => this.state.sistemaBySistemaId?.[value]?.nome, minWidth: 150, flex: 1 },
			{ field: 'auditorId', headerName: 'Auditor', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, minWidth: 200, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[params.row.auditorId]}/>},
			{ field: 'os', headerName: 'OS', minWidth: 100, flex: 1 },
			{ field: 'custcode', headerName: 'Cust-Code', minWidth: 100, flex: 1 },
			{ field: 'origem', headerName: 'Mailing/Origem', minWidth: 200, flex: 1 },
			{ field: 'vendedorId', headerName: 'Vendedor', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, minWidth: 200, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[params.row.vendedorId]}/>},
			{ field: 'supervisorId', headerName: 'Supervisor', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, minWidth: 200, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[params.row.supervisorId]}/>},
			{ field: 'vendedorExterno', headerName: 'Vendedor Externo', minWidth: 200, flex: 1 },
			{ field: 'supervisorExterno', headerName: 'Supervisor Externo', minWidth: 200, flex: 1 },
			{ field: 'auditorExterno', headerName: 'Auditor Externo', minWidth: 200, flex: 1 },
			{ field: 'cadastradorExterno', headerName: 'Cadastrador Externo', minWidth: 200, flex: 1 },
			{ field: 'totalDeProdutos', headerName: 'N° de Produtos', minWidth: 100, flex: 1 },
			{ field: 'produto', headerName: 'Produto', minWidth: 200, flex: 1 },
			{ field: 'valor', headerName: 'Valor', minWidth: 100, flex: 1 },
			{ field: 'quantidade', headerName: 'Quantidade', minWidth: 100, flex: 1 },
			{ field: 'telefoneFixo', headerName: 'Telefone Fixo', minWidth: 200, flex: 1 },
			{ field: 'valorTelefoneFixo', headerName: 'Valor Telefone Fixo', minWidth: 200, flex: 1 },
			{ field: 'tipoDeLinha', headerName: 'Tipo de Linha', minWidth: 200, flex: 1 },
			{ field: 'ddd', headerName: 'DDD', minWidth: 100, flex: 1 },
			{ field: 'operadora', headerName: 'Operadora', minWidth: 150, flex: 1 },

			{ field: 'uf', headerName: 'UF', minWidth: 100, flex: 1 },
			{ field: 'cidade', headerName: 'Cidade', minWidth: 200, flex: 1 },
			{ field: 'bairro', headerName: 'Bairro', minWidth: 200, flex: 1 },

			{ field: 'porte', headerName: 'Porte', minWidth: 200, flex: 1 },
			{ field: 'cpf', headerName: 'CPF/CNPJ', minWidth: 200, flex: 1 },
			{ field: 'nome', headerName: 'Nome/Razão Social', minWidth: 200, flex: 1 },
			{ field: 'nomeContato', headerName: 'Nome Contato', minWidth: 200, flex: 1 },

			{ field: 'contato1', headerName: 'Contato 1', minWidth: 200, flex: 1 },
			{ field: 'contato2', headerName: 'Contato 2', minWidth: 200, flex: 1 },
			{ field: 'contato3', headerName: 'Contato 3', minWidth: 200, flex: 1 },
			{ field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
			{ field: 'observacao', headerName: 'Observação', minWidth: 200, flex: 1 },

			{ field: 'formaDePagamento', headerName: 'Forma de Pagamento', minWidth: 200, flex: 1 },
			{ field: 'vencimento', headerName: 'Vencimento', minWidth: 100, flex: 1 },

			{ field: 'dataAgendamento', headerName: 'Data de Agendamento', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataInstalacao', headerName: 'Data de Instalação', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'dataAtivacao', headerName: 'Data da Ativação', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },

			{ field: 'vendaOriginal', headerName: 'Venda Original', minWidth: 200, flex: 1 },
			{ field: 'brscan', headerName: 'BrScan', minWidth: 200, flex: 1 },
			{ field: 'suporte', headerName: 'Suporte', minWidth: 200, flex: 1 },
			{ field: 'prints', headerName: 'Prints', minWidth: 100, flex: 1 },

			{ field: 'situacao', headerName: 'Situação', minWidth: 200, flex: 1 },
		];

		for (let i=1; i<=this.numeroFaturas; i++) {
			this.columns.push({ field: `m${i}Mes`, headerName: `M${i} Mês`, minWidth: 150, flex: 1, valueGetter: (value, row) => value !== null ? dayjs(value).format('MMMM YYYY') : "" });
			this.columns.push({ field: `m${i}Status`, headerName: `M${i} Status`, minWidth: 100, flex: 1});
			this.columns.push({ field: `m${i}Valor`, headerName: `M${i} Valor`, minWidth: 100, flex: 1});
		}

		this.allHiddenColumnVisibilityModel = {};
		Object.keys(this.columns).forEach((column) => this.allHiddenColumnVisibilityModel[this.columns[column].field] = false);

		this.projecaoList = [
			{nome: "Fibra - Vendas", value: "FIBRA_VENDAS", columnVisibilityModel: {
				...this.allHiddenColumnVisibilityModel,
				statusId: true,
				dataStatus: true,
				tipoProduto: true,
				pdv: true,
				safra: true,
				dataVenda: true,
				loginVendedor: true,
				cadastradorId: true,
				sistemaId: true,
				auditorId: true,
				os: true,
				origem: true,
				vendedorId: true,
				supervisorId: true,
				produto: true,
				valor: true,
				quantidade: true,
				telefoneFixo: true,
				valorTelefoneFixo: true,
				uf: true,
				cidade: true,
				bairro: true,
				cpf: true,
				nome: true,
				contato1: true,
				contato2: true,
				contato3: true,
				email: true,
				observacao: true,
				formaDePagamento: true,
				dataAgendamento: true,
				dataInstalacao: true,
				vendaOriginal: true,
				brscan: true,
				suporte: true,
			}},
			{nome: "Móvel - Vendas", value: "MOVEL_VENDAS", columnVisibilityModel: {
				...this.allHiddenColumnVisibilityModel,
				statusId: true,
				dataStatus: true,
				tipoProduto: true,
				pdv: true,
				safra: true,
				dataVenda: true,
				loginVendedor: true,
				cadastradorId: true,
				sistemaId: true,
				auditorId: true,
				os: true,
				origem: true,
				vendedorId: true,
				supervisorId: true,
				totalDeProdutos: true,
				produto: true,
				valor: true,
				quantidade: true,
				tipoDeLinha: true,
				ddd: true,
				operadora: true,
				uf: true,
				cidade: true,
				bairro: true,
				porte: true,
				cpf: true,
				nome: true,
				contato1: true,
				contato2: true,
				contato3: true,
				email: true,
				observacao: true,
				dataAtivacao: true,
				prints: true,
			}},
			{nome: "Fibra - Qualidade", value: "FIBRA_QUALIDADE", columnVisibilityModel: {
				...this.allHiddenColumnVisibilityModel,
				statusId: true,
				dataStatus: true,
				tipoProduto: true,
				pdv: true,
				safra: true,
				os: true,
				custcode: true,
				dataInstalacao: true,
				contato1: true,
				contato2: true,
				contato3: true,
				email: true,
				produto: true,
				valor: true,
				cpf: true,
				nome: true,
				formaDePagamento: true,
				vencimento: true,
				situacao: true,
				observacao: true,
			}},
			{nome: "Móvel - Qualidade", value: "MOVEL_QUALIDADE", columnVisibilityModel: {
				...this.allHiddenColumnVisibilityModel,
				statusId: true,
				dataStatus: true,
				tipoProduto: true,
				pdv: true,
				safra: true,
				os: true,
				dataAtivacao: true,
				contato1: true,
				contato2: true,
				contato3: true,
				email: true,
				produto: true,
				valor: true,
				quantidade: true,
				tipoDeLinha: true,
				cpf: true,
				nome: true,
				nomeContato: true,
				formaDePagamento: true,
				vencimento: true,
				situacao: true,
				observacao: true,
			}},
		];

		for (let j=2; j<=3; j++) {
			for (let i=1; i<=this.numeroFaturas; i++) {
				this.projecaoList[j].columnVisibilityModel[`m${i}Mes`] = true;
				this.projecaoList[j].columnVisibilityModel[`m${i}Status`] = true;
				this.projecaoList[j].columnVisibilityModel[`m${i}Valor`] = true;
			}
		}

		this.state.columnVisibilityModel = this.projecaoList[0].columnVisibilityModel;

		this.getVendaListFromApi = this.getVendaListFromApi.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getFiltroVendaFromApi = this.getFiltroVendaFromApi.bind(this);
		this.getSistemaListFromApi = this.getSistemaListFromApi.bind(this);
		this.getPontoDeVendaListFromApi = this.getPontoDeVendaListFromApi.bind(this);

		this.calculateRows = this.calculateRows.bind(this);

		this.resetFilters = this.resetFilters.bind(this);

		this.onColumnVisibilityModelChange = this.onColumnVisibilityModelChange.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		console.log("VendasModule was mounted at", new Date().toLocaleTimeString());
		this.getVendaStatusListFromApi();
		this.getUsuarioListFromApi();
		this.getSistemaListFromApi();
		this.getPontoDeVendaListFromApi();
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
				cpf: this.state.cpf,
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

	calculateRows() {
		let vendaRows = this.state.vendaList.map((venda) => {

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

				tipoProduto: venda.tipoProduto,
				pdv: venda.pdv,
				safra: venda.safra !== null ? new Date(venda.safra) : null,
				dataVenda: venda.dataVenda !== null ? new Date(venda.dataVenda) : null,
				loginVendedor: venda.loginVendedor,
				cadastradorId: venda.cadastradorId,
				sistemaId: venda.sistemaId,
				auditorId: venda.auditorId,
				os: venda.os,
				custcode: venda.custcode,
				origem: venda.origem,
				vendedorId: venda.vendedorId,
				supervisorId: venda.supervisorId,
				vendedorExterno: venda.vendedorExterno,
				supervisorExterno: venda.supervisorExterno,
				auditorExterno: venda.auditorExterno,
				cadastradorExterno: venda.cadastradorExterno,

				produtoList: venda.produtoList,
				totalDeProdutos: venda.produtoList.length,
				produto: venda.produtoList?.[0]?.nome ?? "",
				valor: venda.produtoList?.[0] ? ("R$ " + (venda.produtoList?.[0].valor).toFixed(2)) : "",
				quantidade: venda.produtoList?.[0]?.quantidade ?? "",
				telefoneFixo: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.telefoneFixo ? "Sim" : "Não") : "",
				valorTelefoneFixo: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.telefoneFixo ? ("R$ " + (venda.produtoList?.[0]?.valorTelefoneFixo ?? 0).toFixed(2)) : "") : "",
				tipoDeLinha: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.tipoDeLinha !== null ? this.tipoDeLinhaMap[venda.produtoList?.[0]?.tipoDeLinha] : "") : "",
				ddd: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.ddd) : "",
				operadora: venda.produtoList?.[0] ? (venda.produtoList?.[0]?.operadora) : "",

				uf: venda.uf,
				cidade: venda.cidade,
				bairro: venda.bairro,

				porte: venda?.porte !== null ? this.porteMap[venda.porte] : "",
				cpf: venda.tipoPessoa == "CPF" ? venda.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : venda.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4.$5"),
				nome: venda.tipoPessoa == "CPF" ? venda.nome : venda.razaoSocial,
				nomeContato: venda.nomeContato,

				contato1: venda.contato1.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4"),
				contato2: venda.contato2.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4"),
				contato3: venda.contato3.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4"),
				email: venda.email,
				observacao: venda.observacao,

				formaDePagamento: venda?.formaDePagamento !== null ? this.formaDePagamentoMap[venda.formaDePagamento] : "",
				vencimento: venda.vencimento,

				dataStatus: venda.dataStatus !== null ? new Date(venda.dataStatus) : null,
				dataAtivacao: venda.dataAtivacao !== null ? new Date(venda.dataAtivacao) : null,
				dataAgendamento: venda.dataAgendamento !== null ? new Date(venda.dataAgendamento) : null,
				dataInstalacao: venda.dataInstalacao !== null ? new Date(venda.dataInstalacao) : null,
				dataCadastro: venda.dataCadastro !== null ? new Date(venda.dataCadastro) : null,

				vendaOriginal: venda.vendaOriginal ? "Sim" : "Não",
				brscan: venda?.brscan !== null ? this.brscanMap[venda.brscan] : "",
				suporte: venda?.suporte !== null ? this.suporteMap[venda.suporte] : "",
				prints: venda.prints ? "Sim" : "Não",

				situacao: situacao,

			};

			for (let i=1; i<=this.numeroFaturas; i++) {
				row[`m${i}Mes`] = venda.faturaList?.[i - 1] ? new Date(venda.faturaList?.[i - 1].mes) : null;
				row[`m${i}Status`] = venda.faturaList?.[i - 1] ? this.faturaStatusMap[venda.faturaList?.[i - 1].status] : "";
				row[`m${i}Valor`] = venda.faturaList?.[i - 1] ? ("R$ " + (venda.faturaList?.[i - 1].valor).toFixed(2)) : "";
			}

			return row;
		});
		this.setState({vendaRows: vendaRows});
	}

	onColumnVisibilityModelChange(newModel) {
		this.setState({columnVisibilityModel: newModel});
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
		console.log("VendasModule was rendered at", new Date().toLocaleTimeString());
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "1000px", boxSizing: "border-box", display: "flex"/*this.props.location.pathname == `/vendas` ? "flex" : "none"*/, flexDirection: "column", aligmItems: "center", justifyContent: "start", gap: 3}} className="modulePaper">
					<Typography variant="h3">
						Vendas
					</Typography>
					<ButtonGroup>
							<Button variant="contained" size="large" startIcon={<AddCardIcon />} onClick={() => this.props.navigate("/vendas/novo")}>Nova Venda</Button>
					</ButtonGroup>
					<Divider/>
					<Grid container spacing={3} sx={{maxWidth: 1500}}>
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
									{this.tipoProdutoEnum.map((tipoProduto) => <MenuItem key={tipoProduto.value} value={tipoProduto.value}>{tipoProduto.nome}</MenuItem>)}
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
									{this.tipoDataList.map((tipoData) => <MenuItem key={tipoData.value} value={tipoData.value}>{tipoData.nome}</MenuItem>)}
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
									groupBy={(option) => VendaStatusCategoriaMap?.[this.state.vendaStatusByVendaStatusId?.[option]?.categoria] ?? "Sem Categoria"}
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
									maxLength: 14,
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
					<Box sx={{ flexGrow: 1 }}>
						<VendaListDataGrid
							vendaRows={this.state.vendaRows}
							columns={this.columns}
							vendaList={this.state.vendaList}
							calling={this.state.calling}
							columnVisibilityModel={this.state.columnVisibilityModel}
							onColumnVisibilityModelChange={this.onColumnVisibilityModelChange}
							projecaoList={this.projecaoList}
							setColumnVisibilityModel={this.onColumnVisibilityModelChange}
							columnGroupingModel={this.columnGroupingModel}
						/>
					</Box>
					<Snackbar open={this.state.alertOpen} onClose={(e, reason) => (reason !== "clickaway") ? this.closeAlert() : ""} anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
						<div>{this.state.alert}</div>
					</Snackbar>
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