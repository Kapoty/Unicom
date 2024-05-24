import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Grid from '@mui/material/Grid';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { DateTimePicker } from '@mui/x-date-pickers-pro';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EmailIcon from '@mui/icons-material/Email';
import NumbersIcon from '@mui/icons-material/Numbers';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { TimePicker } from '@mui/x-date-pickers-pro';
import AttachmentIcon from '@mui/icons-material/Attachment';
import RefreshIcon from '@mui/icons-material/Refresh';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DescriptionIcon from '@mui/icons-material/Description';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PlaceIcon from '@mui/icons-material/Place';
import GavelIcon from '@mui/icons-material/Gavel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import PaidIcon from '@mui/icons-material/Paid';
import Icon from '@mui/material/Icon';
import InfoIcon from '@mui/icons-material/Info';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ChatIcon from '@mui/icons-material/Chat';
import UpdateIcon from '@mui/icons-material/Update';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RouterIcon from '@mui/icons-material/Router';
import Link from '@mui/material/Link';
import GroupsIcon from '@mui/icons-material/Groups';

import CPFInput from "../components/CPFInput";
import CNPJInput from "../components/CNPJInput";
import PhoneInput from "../components/PhoneInput";
import CEPInput from "../components/CEPInput";
import MoneyInput from "../components/MoneyInput";
import UsuarioDisplayStack from "../components/UsuarioDisplayStack";
import VendaStatusChip from '../components/VendaStatusChip';
import CustomDataGridPremium from "../components/CustomDataGridPremium";

import VendaStatusCategoriaMap from "../model/VendaStatusCategoriaMap";

import axios from "axios";

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

class CreateEditVendaModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,
			vendaId: null,

			venda: null,
			usuarioList: null,
			usuarioByUsuarioId: {},
			vendaStatusList: null,
			vendaStatusByVendaStatusId: {},
			produtoList: null,
			produtoByProdutoId: {},

			anexoList: null,

			tab: "TIPO_DA_VENDA",

			// tipo da venda

			tipoPessoa: null,
			tipoProduto: null,

			// dados pessoa cpf

			cpf: "",
			nome: "",
			dataNascimento: null,
			genero: null,
			rg: "",
			rgOrgaoEmissor: "",
			rgDataEmissao: null,
			nomeDaMae: "",

			// dados pessoa cnpj

			cnpj: "",
			porte: null,
			razaoSocial: "",
			dataConstituicao: null,
			dataEmissao: null,
			representanteLegal: "",
			cpfRepresentanteLegal: "",

			// contato

			nomeContato: "",
			telefoneCelular: "",
			telefoneWhatsapp: "",
			telefoneResidencial: "",
			email: "",

			// endereco

			cep: "",
			logradouro: "",
			numero: "",
			complemento: "",
			bairro: "",
			referencia: "",
			cidade: "",
			uf: "",

			// produtos
			vendaProdutoList: [],
			addProdutoId: null,
			addProdutoDialogOpen: false,

			// dados contrato ambos

			os: "",
			custcode: "",
			sistema: null,
			supervisorId: null,
			vendedorId: null,
			auditorId: null,
			cadastradorId: null,
			origem: "",
			dataVenda: null,
			safra: null,

			// dados contrato movel

			dataAtivacao: null,
			prints: false,

			// dados contrato fibra

			dataAgendamento: null,
			dataInstalacao: null,
			pdv: "",
			vendaOriginal: false,
			brscan: "NAO",
			suporte: "NAO",
			loginVendedor: "",

			//pagamento
			formaDePagamento: null,
			vencimento: 1,
			agencia: "",
			conta: "",
			banco: "",

			//status
			statusId: null,
			novoStatusId: null,
			relato: "",

			//faturas
			faturaList: [],

			//observacao
			observacao: "",

			//atualização
			atualizacaoList: null,
			atualizacaoRows: [],

			saving: false,
			calling: false,
			updatingAnexoList: false,
			uploadingAnexo: false,
			deletingAnexo: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.tipoPessoaEnum = ["CPF", "CNPJ"];
		this.tipoProdutoEnum = ["FIBRA", "MOVEL"];
		this.generoEnum = [
			{nome: "Masculino", value: "MASCULINO"},
			{nome: "Feminino", value: "FEMININO"},
			{nome: "Não Informado", value: "NAO_INFORMADO"},
			{nome: "Outros", value: "OUTROS"},
		];
		this.porteEnum = [
			{nome: "MEI", value: "MEI"},
			{nome: "LTDA", value: "LTDA"},
		];
		this.sistemaEnum = [
			{nome: "TIM Vendas", value: "TIM_VENDAS"},
			{nome: "Televendas", value: "TELEVENDAS"},
			{nome: "TBP", value: "TBP"},
		];
		this.formaDePagamentoEnum = [
			{nome: "Boleto", value: "BOLETO"},
			{nome: "Débito Automático", value: "DEBITO_AUTOMATICO"},
			{nome: "Cartão de Crédito", value: "CARTAO_CREDITO"},
		];
		this.vencimentoEnum = [1, 3, 7, 10];
		this.faturaStatusEnum = [
			{nome: "N/A", value: "NA"},
			{nome: "A Vencer", value: "A_VENCER"},
			{nome: "Em Aberto", value: "EM_ABERTO"},
			{nome: "Paga", value: "PAGA"},
			{nome: "Multa", value: "MULTA"},
			{nome: "Churn", value: "CHURN"},
		];
		this.pdvEnum = ["UNICOM DF", "UNICOM GO"]
		this.tipoDeLinhaEnum = [
			{nome: "Nova", value: "NOVA"},
			{nome: "Portabilidade", value: "PORTABILIDADE"},
			{nome: "TT", value: "TT"},
		];
		this.brscanEnum = [
			{nome: "Sim", value: "SIM"},
			{nome: "Não", value: "NAO"},
			{nome: "Exceção", value: "EXCECAO"},
			{nome: "Cancelada Internamente", value: "CANCELADA_INTERNAMENTE"},
			{nome: "Aguardando Aceite Digital", value: "AGUARDANDO_ACEITE_DIGITAL"},
			{nome: "Sem Whatsapp", value: "SEM_WHATSAPP"},
		];

		this.suporteEnum = [
			{nome: "Sim", value: "SIM"},
			{nome: "Não", value: "NAO"},
			{nome: "Exceção", value: "EXCECAO"},
			{nome: "Cancelada Internamente", value: "CANCELADA_INTERNAMENTE"},
		];

		this.adicionaisEnum = ["Apps", "Aparelho", "Mob", "Deezer"];

		this.atualizacaoColumns = [
			{ field: 'statusId', headerName: 'Status', valueGetter: (value, row) => this.state.vendaStatusByVendaStatusId?.[value]?.nome, minWidth: 100, flex: 1, renderCell: (params) => <VendaStatusChip
				vendaStatus={this.state.vendaStatusByVendaStatusId?.[params.row.statusId]}
			/>},
			{ field: 'usuarioId', headerName: 'Usuário', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, minWidth: 100, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[params.row.usuarioId]}/>},
			{ field: 'data', headerName: 'Data', minWidth: 150, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'relato', headerName: 'Relato', minWidth: 400, flex: 1, renderCell: (params) => <pre>{params.value.replace(/(\\n)/g, "\n")}</pre> },
		];

		this.getVendaFromApi = this.getVendaFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getAnexoListFromApi = this.getAnexoListFromApi.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);
		this.getProdutoListFromApi = this.getProdutoListFromApi.bind(this);

		this.getCepInfoFromApi = this.getCepInfoFromApi.bind(this);
		this.updateCep = this.updateCep.bind(this);

		this.calculateAtualizacaoRows = this.calculateAtualizacaoRows.bind(this);

		this.addProduto = this.addProduto.bind(this);
		this.updateProduto = this.updateProduto.bind(this);
		this.deleteProduto = this.deleteProduto.bind(this);

		this.addPortabilidade = this.addPortabilidade.bind(this);
		this.updatePortabilidade = this.updatePortabilidade.bind(this);
		this.deletePortabilidade = this.deletePortabilidade.bind(this);

		this.addFatura = this.addFatura.bind(this);
		this.updateFatura = this.updateFatura.bind(this);
		this.deleteFatura = this.deleteFatura.bind(this);

		this.saveVenda = this.saveVenda.bind(this);
		this.patchVenda = this.patchVenda.bind(this);
		this.postVenda = this.postVenda.bind(this);
		this.handleUploadAnexoChange = this.handleUploadAnexoChange.bind(this);
		this.deleteAnexo = this.deleteAnexo.bind(this);

		this.setVendaIdFromParams = this.setVendaIdFromParams.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setVendaIdFromParams();
		this.getUsuarioListFromApi();
		this.getVendaStatusListFromApi();
		this.getProdutoListFromApi();
		if (this.props.searchParams.get("novo") !== null) {
			this.openAlert("success", 'Venda criada com sucesso!');
		}
	}

	setVendaIdFromParams() {
		let paramsVendaId = parseInt(this.props.params.vendaId);
		if (!isNaN(paramsVendaId))
			this.setState({createMode: false, vendaId: paramsVendaId}, () => {
				this.getVendaFromApi();
				this.getAnexoListFromApi();
			});
		else
			this.setState({createMode: true});
	}


	getVendaFromApi() {
		this.setState({calling: true})
		api.get("/venda/" + this.state.vendaId)
			.then((response) => {
				let venda = response.data;

				venda.faturaList.forEach((fatura) => {
					fatura.mes = dayjs(fatura.mes, "YYYY-MM-DD")
				})

				this.setState({
					venda: venda,

					// tipo da venda

					tipoPessoa: venda.tipoPessoa,
					tipoProduto: venda.tipoProduto,

					// dados pessoa cpf

					cpf: venda.cpf,
					nome: venda.nome,
					dataNascimento: venda.dataNascimento !== null ? dayjs(venda.dataNascimento, "YYYY-MM-DD") : null,
					genero: venda.genero,
					rg: venda.rg,
					rgOrgaoEmissor: venda.rgOrgaoEmissor,
					rgDataEmissao: venda.rgDataEmissao !== null ? dayjs(venda.rgDataEmissao, "YYYY-MM-DD") : null,
					nomeDaMae: venda.nomeDaMae,

					// dados pessoa cnpj

					cnpj: venda.cnpj,
					porte: venda.porte,
					razaoSocial: venda.razaoSocial,
					dataConstituicao: venda.dataConstituicao !== null ? dayjs(venda.dataConstituicao, "YYYY-MM-DD") : null,
					dataEmissao: venda.dataEmissao !== null ? dayjs(venda.dataEmissao, "YYYY-MM-DD") : null,
					representanteLegal: venda.representanteLegal,
					cpfRepresentanteLegal: venda.cpfRepresentanteLegal,

					// contato

					nomeContato: venda.nomeContato,
					telefoneCelular: venda.telefoneCelular,
					telefoneWhatsapp: venda.telefoneWhatsapp,
					telefoneResidencial: venda.telefoneResidencial,
					email: venda.email,

					// endereco

					cep: venda.cep,
					logradouro: venda.logradouro,
					numero: venda.numero,
					complemento: venda.complemento,
					bairro: venda.bairro,
					referencia: venda.referencia,
					cidade: venda.cidade,
					uf: venda.uf,

					// produtos
					vendaProdutoList: venda.produtoList,

					// dados contrato ambos

					os: venda.os,
					custcode: venda.custcode,
					sistema: venda.sistema,
					supervisorId: venda.supervisorId,
					vendedorId: venda.vendedorId,
					auditorId: venda.auditorId,
					cadastradorId: venda.cadastradorId,
					origem: venda.origem,
					dataVenda: venda.dataVenda !== null ? dayjs(new Date(venda.dataVenda)) : null,
					safra: venda.safra !== null ? dayjs(venda.safra, "YYYY-MM-DD") : null,

					// dados contrato movel

					dataAtivacao: venda.dataAtivacao !== null ? dayjs(new Date(venda.dataAtivacao)) : null,
					prints: venda.prints,

					// dados contrato fibra

					dataAgendamento: venda.dataAgendamento !== null ? dayjs(new Date(venda.dataAgendamento)) : null,
					dataInstalacao: venda.dataInstalacao !== null ? dayjs(new Date(venda.dataInstalacao)) : null,
					pdv: venda.pdv,
					vendaOriginal: venda.vendaOriginal,
					brscan: venda.brscan,
					suporte: venda.suporte,
					loginVendedor: venda.loginVendedor,

					//pagamento
					formaDePagamento: venda.formaDePagamento,
					vencimento: venda.vencimento,
					agencia: venda.agencia,
					conta: venda.conta,
					banco: venda.banco,

					//status
					statusId: venda.statusId,
					novoStatusId: null,
					relato: "",

					//faturas
					faturaList: venda.faturaList,

					//observacao
					observacao: venda.observacao,

					//atualização
					atualizacaoList: venda.atualizacaoList,

					calling: false
				}, () => this.calculateAtualizacaoRows());
				console.log(venda);
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendaFromApi, 3000);
			});
	}

	calculateAtualizacaoRows() {
		let atualizacaoRows = this.state.venda.atualizacaoList.map((atualizacao) => {
			return {
				id: atualizacao.vendaAtualizacaoId,
				statusId: atualizacao.statusId,
				usuarioId: atualizacao.usuarioId,
				data: new Date(atualizacao.data),
				relato: atualizacao.relato,
			}
		});
		this.setState({atualizacaoRows: atualizacaoRows});
	}

	getAnexoListFromApi() {
		this.setState({updatingAnexoList: true})
		api.get("/anexo/venda/" + this.state.vendaId)
			.then((response) => {
				this.setState({
					anexoList: response.data,
					updatingAnexoList: false});
			})
			.catch((err) => {
				this.setState({updatingAnexoList: false});
				this.openAlert("error", "Falha ao obter anexos!");
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

	getProdutoListFromApi() {
		api.get("/empresa/me/produto")
			.then((response) => {
				let produtoList = response.data;
				let produtoByProdutoId = {};
				produtoList.forEach((produto) => produtoByProdutoId[produto.produtoId] = produto);
				this.setState({produtoList: produtoList, produtoByProdutoId: produtoByProdutoId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getProdutoListFromApi, 3000);
			});
	}

	updateCep(cep) {
		this.setState({cep: cep}, () => {
			if (this.state.cep.replace(/\D/g, "").length == 8)
				this.getCepInfoFromApi();
		});
	}

	getCepInfoFromApi() {
		axios.get(`https://viacep.com.br/ws/${this.state.cep.replace(/\D/g, "")}/json`)
			.then((response) => {
				if (response?.data?.erro) {
					this.openAlert("warning", "CEP não encontrado.");
					return;
				}

				this.setState({
					logradouro: response.data?.logradouro ?? "",
					complemento: response.data?.complemento ?? "",
					bairro: response.data?.bairro ?? "",
					cidade: response.data?.localidade ?? "",
					uf: response.data?.uf ?? ""
				})

				this.openAlert("success", "CEP encontrado.");
			})
			.catch((err) => {
				this.openAlert("warning", "Falha ao buscar CEP.");
			});
	}

	addProduto() {
		let vendaProdutoList = this.state.vendaProdutoList;

		let nome = "Produto Personalizado";

		if (this.state.addProdutoId !== null) {
			nome = this.state.produtoByProdutoId[this.state.addProdutoId].nome;
		}

		vendaProdutoList.push({
			nome: nome,
			adicionais: "",
			valor: 0,
			telefoneFixo: false,
			valorTelefoneFixo: 0,
			tipoDeLinha: "NOVA",
			ddd: "",
			operadora: "",
			quantidade: 1,
			portabilidadeList: [],
		})

		this.setState({
			vendaProdutoList: vendaProdutoList,
			addProdutoDialogOpen: false,
		})
	}

	updateProduto(produtoIndex, atributo, valor) {

		let vendaProdutoList = this.state.vendaProdutoList;

		let produto = vendaProdutoList[produtoIndex];

		produto[atributo] = valor;

		this.setState({vendaProdutoList: vendaProdutoList});
	}

	deleteProduto(produtoIndex) {

		let vendaProdutoList = this.state.vendaProdutoList;

		vendaProdutoList.splice(produtoIndex, 1);

		this.setState({vendaProdutoList: vendaProdutoList});

	}

	addPortabilidade(produtoIndex) {
		let vendaProdutoList = this.state.vendaProdutoList;

		let produto = vendaProdutoList[produtoIndex];

		produto.portabilidadeList.push({
			telefone: "",
		})

		this.setState({
			vendaProdutoList: vendaProdutoList
		})
	}

	updatePortabilidade(produtoIndex, portabilidadeIndex, atributo, valor) {

		let vendaProdutoList = this.state.vendaProdutoList;

		let produto = vendaProdutoList[produtoIndex];

		let portabilidade = produto.portabilidadeList[portabilidadeIndex];

		portabilidade[atributo] = valor;

		this.setState({vendaProdutoList: vendaProdutoList});
	}

	deletePortabilidade(produtoIndex, portabilidadeIndex) {

		let vendaProdutoList = this.state.vendaProdutoList;

		let produto = vendaProdutoList[produtoIndex];

		produto.portabilidadeList.splice(portabilidadeIndex, 1);

		this.setState({vendaProdutoList: vendaProdutoList});

	}

	addFatura() {
		let faturaList = this.state.faturaList;

		faturaList.push({
			mes: dayjs().set('date', 1),
			status: "NA",
			valor: 0,
		})

		this.setState({
			faturaList: faturaList
		})
	}

	updateFatura(faturaIndex, atributo, valor) {

		let faturaList = this.state.faturaList;

		let fatura = faturaList[faturaIndex];

		fatura[atributo] = valor;

		this.setState({faturaList: faturaList});
	}

	deleteFatura(faturaIndex) {

		let faturaList = this.state.faturaList;

		faturaList.splice(faturaIndex, 1);

		this.setState({faturaList: faturaList});

	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert} sx={{ whiteSpace: 'pre-line' }}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	errorsFormat(errors) {
		let msg = "----------------\n";
		Object.keys(errors).forEach((key) => msg += `${key}: ${errors[key]}\n`)
		return msg;
	}

	postVenda(data) {
		this.setState({calling: true, saving: true});
		api.post(`/venda/`, data)
			.then((response) => {
				this.props.navigate("/vendas/" + response.data.vendaId + "?novo");
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors ?? {};
				this.openAlert("error", "Falha ao salvar venda!\n" + this.errorsFormat(errors));
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	patchVenda(data) {
		this.setState({calling: true, saving: true});
		api.patch(`/venda/${this.state.vendaId}`, data)
			.then((response) => {
				this.openAlert("success", `Venda salva com sucesso!`);
				this.getVendaFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors ?? {};
				this.openAlert("error", "Falha ao salvar venda!\n" + this.errorsFormat(errors));
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	saveVenda() {

		let produtoList = JSON.parse(JSON.stringify(this.state.vendaProdutoList));

		produtoList.forEach(produto => {

			produto.portabilidadeList.forEach(portabilidade => {
				portabilidade.telefone = portabilidade.telefone.replace(/\D/g, "");
			})

		});

		let faturaList = [];

		this.state.faturaList.forEach((fatura) => {
			faturaList.push({
				mes: fatura.mes.set('date', 1).format("YYYY-MM-DD"),
				status: fatura.status,
				valor: fatura.valor,
			})
		})

		let data = {
			// tipo da venda

			tipoPessoa: this.state.tipoPessoa,
			tipoProduto: this.state.tipoProduto,

			// dados pessoa cpf

			cpf: this.state.cpf.replace(/\D/g, ""),
			nome: this.state.nome,
			dataNascimento: this.state.dataNascimento !== null ? this.state.dataNascimento.format("YYYY-MM-DD") : null,
			genero: this.state.genero,
			rg: this.state.rg,
			rgOrgaoEmissor: this.state.rgOrgaoEmissor,
			rgDataEmissao: this.state.rgDataEmissao !== null ? this.state.rgDataEmissao.format("YYYY-MM-DD") : null,
			nomeDaMae: this.state.nomeDaMae,

			// dados pessoa cnpj

			cnpj: this.state.cnpj.replace(/\D/g, ""),
			porte: this.state.porte,
			razaoSocial: this.state.razaoSocial,
			dataConstituicao: this.state.dataConstituicao !== null ? this.state.dataConstituicao.format("YYYY-MM-DD") : null,
			dataEmissao: this.state.dataEmissao !== null ? this.state.dataEmissao.format("YYYY-MM-DD") : null,
			representanteLegal: this.state.representanteLegal,
			cpfRepresentanteLegal: this.state.cpfRepresentanteLegal.replace(/\D/g, ""),

			// contato

			nomeContato: this.state.nomeContato,
			telefoneCelular: this.state.telefoneCelular.replace(/\D/g, ""),
			telefoneWhatsapp: this.state.telefoneWhatsapp.replace(/\D/g, ""),
			telefoneResidencial: this.state.telefoneResidencial.replace(/\D/g, ""),
			email: this.state.email,

			// endereco

			cep: this.state.cep.replace(/\D/g, ""),
			logradouro: this.state.logradouro,
			numero: this.state.numero,
			complemento: this.state.complemento,
			bairro: this.state.bairro,
			referencia: this.state.referencia,
			cidade: this.state.cidade,
			uf: this.state.uf,

			// produtos
			produtoList: produtoList,

			// dados contrato ambos

			os: this.state.os,
			custcode: this.state.custcode,
			sistema: this.state.sistema,
			supervisorId: this.state.supervisorId,
			vendedorId: this.state.vendedorId,
			auditorId: this.state.auditorId,
			cadastradorId: this.state.cadastradorId,
			origem: this.state.origem,
			dataVenda: this.state.dataVenda !== null ? this.state.dataVenda.format("YYYY-MM-DDTHH:mm:ss") : null,
			safra: this.state.safra !== null ? this.state.safra.format("YYYY-MM-DD") : null,

			// dados contrato movel

			dataAtivacao: this.state.dataAtivacao !== null ? this.state.dataAtivacao.format("YYYY-MM-DDTHH:mm:ss") : null,
			prints: this.state.prints,

			// dados contrato fibra

			dataAgendamento: this.state.dataAgendamento !== null ? this.state.dataAgendamento.format("YYYY-MM-DDTHH:mm:ss") : null,
			dataInstalacao: this.state.dataInstalacao !== null ? this.state.dataInstalacao.format("YYYY-MM-DDTHH:mm:ss") : null,
			pdv: this.state.pdv ?? "",
			vendaOriginal: this.state.vendaOriginal,
			brscan: this.state.brscan,
			suporte: this.state.suporte,
			loginVendedor: this.state.loginVendedor,

			//pagamento
			formaDePagamento: this.state.formaDePagamento,
			vencimento: this.state.vencimento ?? "",
			agencia: this.state.agencia,
			conta: this.state.conta,
			banco: this.state.banco,

			//status
			statusId: this.state.novoStatusId,
			relato: this.state.relato,

			//faturas
			faturaList: faturaList,

			//observacao
			observacao: this.state.observacao,
		};

		if (this.state.createMode)
			this.postVenda(data);
		else
			this.patchVenda(data);
	}

	handleUploadAnexoChange(event) {
		this.setState({calling: true, uploadingAnexo: true});
		let formData = new FormData();
		formData.append('file', event.target.files[0]);
		let config = {
			headers: {
			'content-type': 'multipart/form-data',
			},
		};

		api.post(`/anexo/venda/${this.state.vendaId}/upload`, formData, config)
			.then((response) => {
				this.openAlert("success", "Anexo salvo com sucesso!");
				this.getAnexoListFromApi();
				this.setState({calling: false, uploadingAnexo: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao salvar anexo!");
				this.setState({calling: false, uploadingAnexo: false, errors: {}});
			})

		event.target.value = "";
	}

	deleteAnexo(anexoId) {
		this.setState({calling: true, deletingAnexo: true});
		api.delete(`/anexo/delete/${anexoId}`)
			.then((response) => {
				this.openAlert("success", "Anexo deletado com sucesso!");
				this.getAnexoListFromApi();
				this.setState({calling: false, deletingAnexo: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deletar anexo!");
				this.setState({calling: false, deletingAnexo: false, errors: {}});
			})
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "1000px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Nova Venda" : "Editar Venda"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
					</ButtonGroup>
					<Box display="flex" justifyContent="center">
						{((!this.state.createMode && this.state.venda == null)
							) ? <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box> :
									<Grid container spacing={3} sx={{margin: 0, width: "100%"}}>
										<Grid item xs={12}>
											<Tabs
												value={this.state.tab}
												onChange={(e, newValue) => this.setState({tab: newValue})}
												variant="scrollable"
												scrollButtons
												allowScrollButtonsMobile
												aria-label="scrollable auto tabs example"
											>
												<Tab icon={<DescriptionIcon />} value="TIPO_DA_VENDA" label="Tipo da Venda" />
												<Tab icon={<PersonIcon />} value="DADOS_DO_CLIENTE" label="Dados do Cliente" />
												<Tab icon={<LocalPhoneIcon />} value="CONTATO" label="Contato" />
												<Tab icon={<PlaceIcon />} value="ENDERECO" label="Endereço" />
												<Tab icon={<DescriptionIcon />} value="PRODUTOS" label="Produtos" />
												<Tab icon={<GavelIcon />} value="DADOS_DO_CONTRATO" label="Dados do Contrato" />
												<Tab icon={<GroupsIcon />} value="ATORES" label="Atores" />
												<Tab icon={<PaidIcon />} value="PAGAMENTO" label="Pagamento" />
												<Tab icon={<RequestQuoteIcon />} value="FATURAS" label="Faturas" />
												<Tab icon={<ChatIcon />} value="OBSERVACAO" label="Observação" />
												<Tab icon={<InfoIcon />} value="STATUS" label="Status / Salvar" />
												<Tab icon={<AttachmentIcon />} value="ANEXOS" label="Anexos" />
												<Tab icon={<UpdateIcon />} value="ATUALIZACOES" label="Atualizações" />
											</Tabs>
										</Grid>

										{this.state.tab == "TIPO_DA_VENDA" ? <React.Fragment>
											<Grid item xs={12}>
												<Divider><Chip icon={<DescriptionIcon />} label="Tipo do Produto" /></Divider>
											</Grid>
											<Grid item xs={12}>
												<ToggleButtonGroup
													id="tipoProduto"
													fullWidth
													color="primary"
													value={this.state.tipoProduto}
													exclusive
													onChange={(event, value) => this.setState({tipoProduto: value})}
													aria-label="Tipo do Produto"
												>
													<ToggleButton value={"FIBRA"} sx={{display: "flex", flexDirection: "row", gap: 1}}><RouterIcon/>FIBRA</ToggleButton>
													<ToggleButton value={"MOVEL"} sx={{display: "flex", flexDirection: "row", gap: 1}}><SmartphoneIcon/>MOVEL</ToggleButton>
												</ToggleButtonGroup>
											</Grid>
											<Grid item xs={12}>
												<Divider><Chip icon={<PersonIcon />} label="Tipo da Pessoa" /></Divider>
											</Grid>
											<Grid item xs={12}>
												<ToggleButtonGroup
													id="tipoPessoa"
													fullWidth
													color="primary"
													value={this.state.tipoPessoa}
													exclusive
													onChange={(event, value) => this.setState({tipoPessoa: value})}
													aria-label="Tipo da Pessoa"
												>
													<ToggleButton value={"CPF"} sx={{display: "flex", flexDirection: "row", gap: 1}}><PersonIcon/>CPF</ToggleButton>
													<ToggleButton value={"CNPJ"} sx={{display: "flex", flexDirection: "row", gap: 1}}><ApartmentIcon/>CNPJ</ToggleButton>
												</ToggleButtonGroup>
											</Grid>
										</React.Fragment> : ""}

										{this.state.tab == "DADOS_DO_CLIENTE" ? <React.Fragment>
											{this.state.tipoPessoa == "CPF" && this.state.tipoProduto !== null ? <React.Fragment>
												<Grid item xs={6}>
													<CPFInput
														id="cpf"
														value={this.state.cpf}
														onChange={(e) => this.setState({cpf: e.target.value})}
														fullWidth
														label="CPF"
														variant="outlined"
														disabled={this.state.calling}
														error={"nome" in this.state.errors}
														helperText={this.state.errors?.cpf ?? ""}
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														id="nome"
														value={this.state.nome}
														onChange={(e) => this.setState({nome: e.target.value})}
														fullWidth
														label="Nome"
														variant="outlined"
														disabled={this.state.calling}
														error={"nome" in this.state.errors}
														helperText={this.state.errors?.nome ?? ""}
														inputProps={{
															maxLength: 200,
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<DatePicker
														label="Data de Nascimento"
														value={this.state.dataNascimento}
														onChange={(newValue) => this.setState({dataNascimento: newValue})}
														slotProps={{
															field: { clearable: true },
															textField: {
																fullWidth: true,
																error: "dataNascimento" in this.state.errors,
																helperText: this.state.errors?.dataNascimento ?? "",
															},
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<FormControl fullWidth>
														<InputLabel>Gênero</InputLabel>
														<Select
															id="genero"
															value={this.state.genero}
															label="Gênero"
															onChange={(e) => this.setState({genero: e.target.value})}
															>
															<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
															{this.generoEnum.map((genero) => <MenuItem key={genero.value} value={genero.value}>{genero.nome}</MenuItem>)}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={4}>
													<TextField
														id="rg"
														value={this.state.rg}
														onChange={(e) => this.setState({rg: e.target.value})}
														fullWidth
														label="RG"
														variant="outlined"
														disabled={this.state.calling}
														error={"rg" in this.state.errors}
														helperText={this.state.errors?.rg ?? ""}
														inputProps={{
															maxLength: 20,
														}}
													/>
												</Grid>
												<Grid item xs={4}>
													<TextField
														id="rg-orgao-emissor"
														value={this.state.rgOrgaoEmissor}
														onChange={(e) => this.setState({rgOrgaoEmissor: e.target.value})}
														fullWidth
														label="Órgão Emissor"
														variant="outlined"
														disabled={this.state.calling}
														error={"rgOrgaoEmissor" in this.state.errors}
														helperText={this.state.errors?.rgOrgaoEmissor ?? ""}
														inputProps={{
															maxLength: 50,
														}}
													/>
												</Grid>
												<Grid item xs={4}>
													<DatePicker
														label="Data de Emissão"
														value={this.state.rgDataEmissao}
														onChange={(newValue) => this.setState({rgDataEmissao: newValue})}
														slotProps={{
															field: { clearable: true },
															textField: {
																fullWidth: true,
																error: "rgDataEmissao" in this.state.errors,
																helperText: this.state.errors?.rgDataEmissao ?? "",
															},
														}}
													/>
												</Grid>
												<Grid item xs={12}>
													<TextField
														id="nome-da-mae"
														value={this.state.nomeDaMae}
														onChange={(e) => this.setState({nomeDaMae: e.target.value})}
														fullWidth
														label="Nome da Mãe"
														variant="outlined"
														disabled={this.state.calling}
														error={"nomeDaMae" in this.state.errors}
														helperText={this.state.errors?.nomeDaMae ?? ""}
														inputProps={{
															maxLength: 200,
														}}
													/>
												</Grid>
											</React.Fragment> : this.state.tipoPessoa == "CNPJ" && this.state.tipoProduto !== null ? <React.Fragment>
												<Grid item xs={6}>
													<CNPJInput
														id="cnpj"
														value={this.state.cnpj}
														onChange={(e) => this.setState({cnpj: e.target.value})}
														fullWidth
														label="CNPJ"
														variant="outlined"
														disabled={this.state.calling}
														error={"cnpj" in this.state.errors}
														helperText={this.state.errors?.cnpj ?? ""}
													/>
												</Grid>
												<Grid item xs={6}>
													<FormControl fullWidth>
														<InputLabel>Porte</InputLabel>
														<Select
															id="porte"
															value={this.state.porte}
															label="Porte"
															onChange={(e) => this.setState({porte: e.target.value})}
															>
															<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
															{this.porteEnum.map((porte) => <MenuItem key={porte.value} value={porte.value}>{porte.nome}</MenuItem>)}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={4}>
													<TextField
														id="razao-social"
														value={this.state.razaoSocial}
														onChange={(e) => this.setState({razaoSocial: e.target.value})}
														fullWidth
														label="Razão Social"
														variant="outlined"
														disabled={this.state.calling}
														error={"razaoSocial" in this.state.errors}
														helperText={this.state.errors?.razaoSocial ?? ""}
														inputProps={{
															maxLength: 200,
														}}
													/>
												</Grid>
												<Grid item xs={4}>
													<DatePicker
														label="Data da Constituição"
														value={this.state.dataConstituicao}
														onChange={(newValue) => this.setState({dataConstituicao: newValue})}
														slotProps={{
															field: { clearable: true },
															textField: {
																fullWidth: true,
																error: "dataConstituicao" in this.state.errors,
																helperText: this.state.errors?.dataConstituicao ?? "",
															},
														}}
													/>
												</Grid>
												<Grid item xs={4}>
													<DatePicker
														label="Data de Emissão"
														value={this.state.dataEmissao}
														onChange={(newValue) => this.setState({dataEmissao: newValue})}
														slotProps={{
															field: { clearable: true },
															textField: {
																fullWidth: true,
																error: "dataEmissao" in this.state.errors,
																helperText: this.state.errors?.dataEmissao ?? "",
															},
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														id="representante-legal"
														value={this.state.representanteLegal}
														onChange={(e) => this.setState({representanteLegal: e.target.value})}
														fullWidth
														label="Representante Legal"
														variant="outlined"
														disabled={this.state.calling}
														error={"representanteLegal" in this.state.errors}
														helperText={this.state.errors?.representanteLegal ?? ""}
														inputProps={{
															maxLength: 200,
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<CPFInput
														id="cpf-representante-legal"
														value={this.state.cpfRepresentanteLegal}
														onChange={(e) => this.setState({cpfRepresentanteLegal: e.target.value})}
														fullWidth
														label="CPF do Representante Legal"
														variant="outlined"
														disabled={this.state.calling}
														error={"cpfRepresentanteLegal" in this.state.errors}
														helperText={this.state.errors?.cpfRepresentanteLegal ?? ""}
													/>
												</Grid>
											</React.Fragment> : <Grid item xs={12}><Alert severity="info">Você poderá ver os dados do cliente após definir o tipo da venda.</Alert></Grid>}
										</React.Fragment> : ""}

										{this.state.tab == "CONTATO" ? <React.Fragment>
											<Grid item xs={12}>
												<TextField
													id="nome-contato"
													value={this.state.nomeContato}
													onChange={(e) => this.setState({nomeContato: e.target.value})}
													fullWidth
													label="Nome Contato"
													variant="outlined"
													disabled={this.state.calling}
													error={"nomeContato" in this.state.errors}
													helperText={this.state.errors?.nomeContato ?? ""}
													inputProps={{
														maxLength: 200,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<PhoneInput
													id="telefone-celular"
													value={this.state.telefoneCelular}
													onChange={(e) => this.setState({telefoneCelular: e.target.value})}
													fullWidth
													label="Telefone Celular"
													variant="outlined"
													disabled={this.state.calling}
													error={"telefoneCelular" in this.state.errors}
													helperText={this.state.errors?.telefoneCelular ?? ""}
												/>
											</Grid>
											<Grid item xs={4}>
												<PhoneInput
													id="telefone-whatsapp"
													value={this.state.telefoneWhatsapp}
													onChange={(e) => this.setState({telefoneWhatsapp: e.target.value})}
													fullWidth
													label="Whatsapp"
													variant="outlined"
													disabled={this.state.calling}
													error={"telefoneWhatsapp" in this.state.errors}
													helperText={this.state.errors?.telefoneWhatsapp ?? ""}
												/>
											</Grid>
											<Grid item xs={4}>
												<PhoneInput
													id="telefone-residencial"
													value={this.state.telefoneResidencial}
													onChange={(e) => this.setState({telefoneResidencial: e.target.value})}
													fullWidth
													label="Telefone Residencial"
													variant="outlined"
													disabled={this.state.calling}
													error={"telefoneResidencial" in this.state.errors}
													helperText={this.state.errors?.telefoneResidencial ?? ""}
												/>
											</Grid>
											<Grid item xs={12}>
												<TextField
													id="email"
													value={this.state.email}
													onChange={(e) => this.setState({email: e.target.value})}
													fullWidth
													label="Email"
													variant="outlined"
													disabled={this.state.calling}
													error={"email" in this.state.errors}
													helperText={this.state.errors?.email ?? ""}
													inputProps={{
														maxLength: 200,
													}}
												/>
											</Grid>
										</React.Fragment> : ""}

										{this.state.tab == "ENDERECO" ? <React.Fragment>
											<Grid item container xs={4} display="flex" gap={1} flexDirection="column">
												<CEPInput
													id="cep"
													value={this.state.cep}
													onChange={(e) => this.updateCep(e.target.value)}
													fullWidth
													label="CEP"
													variant="outlined"
													disabled={this.state.calling}
													error={"cep" in this.state.errors}
													helperText={this.state.errors?.cep ?? ""}
												/>
												<Link href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" sx={{alignSelf: "end"}}>Descobrir CEP</Link>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="logradouro"
													value={this.state.logradouro}
													onChange={(e) => this.setState({logradouro: e.target.value})}
													fullWidth
													label="Logradouro"
													variant="outlined"
													disabled={this.state.calling}
													error={"logradouro" in this.state.errors}
													helperText={this.state.errors?.logradouro ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="numero"
													value={this.state.numero}
													onChange={(e) => this.setState({numero: e.target.value})}
													fullWidth
													label="Número"
													variant="outlined"
													disabled={this.state.calling}
													error={"numero" in this.state.errors}
													helperText={this.state.errors?.numero ?? ""}
													inputProps={{
														maxLength: 10,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="complemento"
													value={this.state.complemento}
													onChange={(e) => this.setState({complemento: e.target.value})}
													fullWidth
													label="Complemento"
													variant="outlined"
													disabled={this.state.calling}
													error={"complemento" in this.state.errors}
													helperText={this.state.errors?.complemento ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="bairro"
													value={this.state.bairro}
													onChange={(e) => this.setState({bairro: e.target.value})}
													fullWidth
													label="Bairro"
													variant="outlined"
													disabled={this.state.calling}
													error={"bairro" in this.state.errors}
													helperText={this.state.errors?.bairro ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="referencia"
													value={this.state.referencia}
													onChange={(e) => this.setState({referencia: e.target.value})}
													fullWidth
													label="Referência"
													variant="outlined"
													disabled={this.state.calling}
													error={"referencia" in this.state.errors}
													helperText={this.state.errors?.referencia ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													id="cidade"
													value={this.state.cidade}
													onChange={(e) => this.setState({cidade: e.target.value})}
													fullWidth
													label="Cidade"
													variant="outlined"
													disabled={this.state.calling}
													error={"cidade" in this.state.errors}
													helperText={this.state.errors?.cidade ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													id="uf"
													value={this.state.uf}
													onChange={(e) => this.setState({uf: e.target.value})}
													fullWidth
													label="UF"
													variant="outlined"
													disabled={this.state.calling}
													error={"uf" in this.state.errors}
													helperText={this.state.errors?.uf ?? ""}
													inputProps={{
														maxLength: 2,
													}}
												/>
											</Grid>
										</React.Fragment> : ""}

										{this.state.tab == "PRODUTOS" ? <React.Fragment>
											{this.state.tipoProduto == null || this.state.tipoPessoa == null ? <Grid item xs={12}><Alert severity="info">Você poderá ver os produtos após definir o tipo da venda.</Alert></Grid> : <React.Fragment>
												<Grid item xs={12}>
													<Box display="flex" flexDirection="column" gap={3}>
														{this.state.vendaProdutoList.length == 0 ? <Alert severity="info">Os produtos que você adicionar aparecerão aqui.</Alert> : ""}
														{this.state.vendaProdutoList.map((produto, i) => 
															<Paper key={i} sx={{padding: 3}}>
																<Grid container spacing={3}>
																	<Grid item xs={6}>
																		<TextField
																			value={produto.nome}
																			onChange={(e) => this.updateProduto(i, "nome", e.target.value)}
																			fullWidth
																			label="Nome"
																			variant="outlined"
																			disabled={this.state.calling}
																			inputProps={{
																				maxLength: 100,
																			}}
																		/>
																	</Grid>
																	<Grid item xs={6}>
																		<MoneyInput
																			value={produto.valor}
																			onChange={(e) => this.updateProduto(i, "valor", e.target.value)}
																			fullWidth
																			label="Valor"
																			variant="outlined"
																			disabled={this.state.calling}
																		/>
																	</Grid>
																	{this.state.tipoProduto == "MOVEL" ? <React.Fragment>
																		<Grid item xs={12}>
																			<Autocomplete
																				freeSolo
																				disableClearable
																				options={this.adicionaisEnum}
																				value={produto.adicionais}
																				onInputChange={(event, value) => this.updateProduto(i, "adicionais", value)}
																				renderInput={(params) => (
																					<TextField
																						{...params}
																						variant="outlined"
																						label="Adicionais"
																					/>
																				)}
																			/>
																		</Grid>
																		<Grid item xs={6}>
																			<FormControl fullWidth>
																				<InputLabel>Tipo de Linha</InputLabel>
																				<Select
																					value={produto.tipoDeLinha}
																					label="Tipo de Linha"
																					onChange={(e) => this.updateProduto(i, "tipoDeLinha", e.target.value)}
																					>
																					{this.tipoDeLinhaEnum.map((tipoDeLinha) => <MenuItem key={tipoDeLinha.value} value={tipoDeLinha.value}>{tipoDeLinha.nome}</MenuItem>)}
																				</Select>
																			</FormControl>
																		</Grid>
																		<Grid item xs={6}>
																			<TextField
																				value={produto.ddd}
																				onChange={(e) => this.updateProduto(i, "ddd", e.target.value)}
																				fullWidth
																				label="DDD"
																				variant="outlined"
																				disabled={this.state.calling}
																				inputProps={{
																					maxLength: 2,
																				}}
																			/>
																		</Grid>
																		{produto.tipoDeLinha == "NOVA" ? 
																			<Grid item xs={12}>
																				<TextField
																					value={produto.quantidade}
																					onChange={(e) => this.updateProduto(i, "quantidade", e.target.value)}
																					fullWidth
																					label="Quantidade"
																					variant="outlined"
																					disabled={this.state.calling}
																					type="number"
																				/>
																			</Grid>
																			: ""}
																		{["PORTABILIDADE", "TT"].includes(produto.tipoDeLinha) ? <React.Fragment>
																			<Grid item xs={12}>
																				<TextField
																					value={produto.operadora}
																					onChange={(e) => this.updateProduto(i, "operadora", e.target.value)}
																					fullWidth
																					label="operadora"
																					variant="outlined"
																					disabled={this.state.calling}
																					inputProps={{
																						maxLength: 20,
																					}}
																				/>
																			</Grid>
																			{produto.portabilidadeList.length == 0 ? <Grid item xs={12}><Alert severity="info">Os telefones que você adicionar aparecerão aqui.</Alert></Grid> : ""}
																			{produto.portabilidadeList.map((portabilidade, j) =>
																				<Grid item xs={3} key={j}>
																					<PhoneInput
																						value={portabilidade.telefone}
																						onChange={(e) => this.updatePortabilidade(i, j, "telefone", e.target.value)}
																						fullWidth
																						label="Telefone (sem DDD)"
																						variant="outlined"
																						disabled={this.state.calling}
																						ddd={false}
																						InputProps={{
																							endAdornment: 	<InputAdornment position="end">
																												<IconButton
																													onClick={() => this.deletePortabilidade(i, j)}
																												>
																													<DeleteIcon/>
																												</IconButton>
																											</InputAdornment>,
																						}}
																					/>
																				</Grid>
																			)}
																			<Grid item xs={12} container display="flex" justifyContent="flex-end">
																				<Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => this.addPortabilidade(i)}>Adicionar Telefone</Button>
																			</Grid>
																		</React.Fragment> : ""}
																	</React.Fragment> : <React.Fragment>
																		<Grid item xs={3}>
																			<FormControl>
																				<FormLabel id={"telefone-fixo" + i}>Telefone Fixo</FormLabel>
																				<RadioGroup
																					row
																					aria-labelledby={"telefone-fixo" + i}
																					name="controlled-radio-buttons-group"
																					value={produto.telefoneFixo}
																					onChange={(e) => this.updateProduto(i, "telefoneFixo", e.target.value)}
																				>
																				<FormControlLabel value={true} control={<Radio />} label="Sim" />
																				<FormControlLabel value={false} control={<Radio />} label="Não" />
																				</RadioGroup>
																			</FormControl>
																		</Grid>
																		{String(produto.telefoneFixo) == "true" ?
																			<Grid item xs={3}>
																				<MoneyInput
																					value={produto.valorTelefoneFixo}
																					onChange={(e) => this.updateProduto(i, "valorTelefoneFixo", e.target.value)}
																					fullWidth
																					label="Valor Telefone Fixo"
																					variant="outlined"
																					disabled={this.state.calling}
																				/>
																			</Grid> : ""}
																	</React.Fragment>}
																	<Grid item xs={12}>
																		<Button color="error" variant="contained" size="large" startIcon={<DeleteIcon />} onClick={() => this.deleteProduto(i)}>Remover Produto</Button>
																	</Grid>
																</Grid>
															</Paper>
														)}
													</Box>
												</Grid>
												<Grid item xs={12} container display="flex" justifyContent="flex-end">
													<Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => this.setState({addProdutoDialogOpen: true, addProdutoId: null})}>Adicionar Produto</Button>
												</Grid>
											</React.Fragment>}
										</React.Fragment> : ""}

										{this.state.tab == "DADOS_DO_CONTRATO" ? <React.Fragment>
											<Grid item xs={4}>
												<TextField
													id="os"
													value={this.state.os}
													onChange={(e) => this.setState({os: e.target.value})}
													fullWidth
													label="OS"
													variant="outlined"
													disabled={this.state.calling}
													error={"os" in this.state.errors}
													helperText={this.state.errors?.os ?? ""}
													inputProps={{
														maxLength: 50,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="custcode"
													value={this.state.custcode}
													onChange={(e) => this.setState({custcode: e.target.value})}
													fullWidth
													label="Cust-Code"
													variant="outlined"
													disabled={this.state.calling}
													error={"os" in this.state.errors}
													helperText={this.state.errors?.custcode ?? ""}
													inputProps={{
														maxLength: 50,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<FormControl fullWidth>
													<InputLabel>Sistema</InputLabel>
													<Select
														id="sistema"
														value={this.state.sistema}
														label="Sistema"
														onChange={(e) => this.setState({sistema: e.target.value})}
														>
														<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
														{this.sistemaEnum.map((sistema) => <MenuItem key={sistema.value} value={sistema.value}>{sistema.nome}</MenuItem>)}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="origem"
													value={this.state.origem}
													onChange={(e) => this.setState({origem: e.target.value})}
													fullWidth
													label="Mailing/Origem"
													variant="outlined"
													disabled={this.state.calling}
													error={"origem" in this.state.errors}
													helperText={this.state.errors?.origem ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={4}>
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
														},
													}}
												/>
											</Grid>
											<Grid item xs={4}>
												<DateTimePicker
													label="Data da Venda"
													value={this.state.dataVenda}
													onChange={(newValue) => this.setState({dataVenda: newValue})}
													slotProps={{
														field: { clearable: true },
														textField: {
															fullWidth: true,
															error: "dataVenda" in this.state.errors,
															helperText: this.state.errors?.dataVenda ?? (this.state.createMode ? (this.state.dataVenda == null ? "agora" : "outra data") : ""),
														},
													}}
												/>
											</Grid>
											{this.state.tipoProduto == "MOVEL" ? <React.Fragment>
												<Grid item xs={6}>
													<DateTimePicker
															label="Data da Ativação"
															value={this.state.dataAtivacao}
															onChange={(newValue) => this.setState({dataAtivacao: newValue})}
															slotProps={{
																field: { clearable: true },
																textField: {
																	fullWidth: true,
																	error: "dataAtivacao" in this.state.errors,
																	helperText: this.state.errors?.dataAtivacao ?? "",
																},
															}}
														/>
												</Grid>
												<Grid item xs={6}>
													<FormControl>
														<FormLabel id="prints">Prints</FormLabel>
														<RadioGroup
															row
															aria-labelledby="prints"
															name="controlled-radio-buttons-group"
															value={this.state.prints}
															onChange={(e) => this.setState({prints: e.target.value})}
														>
														<FormControlLabel value={true} control={<Radio />} label="Sim" />
														<FormControlLabel value={false} control={<Radio />} label="Não" />
														</RadioGroup>
													</FormControl>
												</Grid>
											</React.Fragment> : <React.Fragment>
												<Grid item xs={6}>
													<DateTimePicker
															label="Data de Agendamento"
															value={this.state.dataAgendamento}
															onChange={(newValue) => this.setState({dataAgendamento: newValue})}
															slotProps={{
																field: { clearable: true },
																textField: {
																	fullWidth: true,
																	error: "dataAgendamento" in this.state.errors,
																	helperText: this.state.errors?.dataAgendamento ?? "",
																},
															}}
														/>
												</Grid>
												<Grid item xs={6}>
													<DateTimePicker
															label="Data de Instalação"
															value={this.state.dataInstalacao}
															onChange={(newValue) => this.setState({dataInstalacao: newValue})}
															slotProps={{
																field: { clearable: true },
																textField: {
																	fullWidth: true,
																	error: "dataInstalacao" in this.state.errors,
																	helperText: this.state.errors?.dataInstalacao ?? "",
																},
															}}
														/>
												</Grid>
												<Grid item xs={3}>
													<Autocomplete
														id="pdv"
														freeSolo
														disableClearable
														options={this.pdvEnum}
														value={this.state.pdv}
														onInputChange={(event, value) => this.setState({pdv: value})}
														renderInput={(params) => (
															<TextField
																{...params}
																variant="outlined"
																label="PDV"
																error={"pdv" in this.state.errors}
																helperText={this.state.errors?.pdv ?? ""}
															/>
														)}
													/>
												</Grid>
												<Grid item xs={3}>
													<FormControl>
														<FormLabel id="venda-original">Venda Original</FormLabel>
														<RadioGroup
															row
															aria-labelledby="venda-original"
															name="controlled-radio-buttons-group"
															value={this.state.vendaOriginal}
															onChange={(e) => this.setState({vendaOriginal: e.target.value})}
														>
														<FormControlLabel value={true} control={<Radio />} label="Sim" />
														<FormControlLabel value={false} control={<Radio />} label="Não" />
														</RadioGroup>
													</FormControl>
												</Grid>
												<Grid item xs={3}>
													<FormControl fullWidth>
														<InputLabel>BrScan</InputLabel>
														<Select
															value={this.state.brscan}
															label="BrScan"
															onChange={(e) => this.setState({brscan: e.target.value})}
															>
															{this.brscanEnum.map((brscan) => <MenuItem key={brscan.value} value={brscan.value}>{brscan.nome}</MenuItem>)}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={3}>
													<FormControl fullWidth>
														<InputLabel>Suporte</InputLabel>
														<Select
															value={this.state.suporte}
															label="Suporte"
															onChange={(e) => this.setState({suporte: e.target.value})}
															>
															{this.suporteEnum.map((suporte) => <MenuItem key={suporte.value} value={suporte.value}>{suporte.nome}</MenuItem>)}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<TextField
														id="login-vendedor"
														value={this.state.loginVendedor}
														onChange={(e) => this.setState({loginVendedor: e.target.value})}
														fullWidth
														label="Login Vendedor"
														variant="outlined"
														disabled={this.state.calling}
														error={"loginVendedor" in this.state.errors}
														helperText={this.state.errors?.loginVendedor ?? ""}
														inputProps={{
															maxLength: 50,
														}}
													/>
												</Grid>
											</React.Fragment>}
										</React.Fragment> : ""}

										{this.state.tab == "ATORES" ? <React.Fragment>
											{!this.state.createMode ? <React.Fragment>
												<Grid item xs={3}>
													<Stack spacing={3}>
														<Typography align="center">Vendedor</Typography>
														<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[this.state.vendedorId]} direction="column"/>
														{this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR") ? <Autocomplete
															id="vendedor"
															options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
															getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
															renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																		<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[option]}/>
																	</Box>}
															value={this.state.vendedorId}
															onChange={(event, value) => this.setState({vendedorId: value})}
															renderInput={(params) => (
																<TextField
																{...params}
																variant="outlined"
																label="Vendedor"
																/>
															)}
															loading={this.state.usuarioList == null}
														/> : ""}
													</Stack>
												</Grid>
												<Grid item xs={3}>
													<Stack spacing={3}>
														<Typography align="center">Supervisor</Typography>
														<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[this.state.supervisorId]} direction="column"/>
														{this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR") ? <Autocomplete
															id="supervisor"
															options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
															getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
															renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																		<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[option]}/>
																	</Box>}
															value={this.state.supervisorId}
															onChange={(event, value) => this.setState({supervisorId: value})}
															renderInput={(params) => (
																<TextField
																{...params}
																variant="outlined"
																label="Supervisor"
																/>
															)}
															loading={this.state.usuarioList == null}
														/> : ""}
													</Stack>
												</Grid>
												<Grid item xs={3}>
													<Stack spacing={3}>
														<Typography align="center">Auditor</Typography>
														<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[this.state.auditorId]} direction="column"/>
														{this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR") ? <Autocomplete
															id="auditor"
															options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
															getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
															renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																		<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[option]}/>
																	</Box>}
															value={this.state.auditorId}
															onChange={(event, value) => this.setState({auditorId: value})}
															renderInput={(params) => (
																<TextField
																{...params}
																variant="outlined"
																label="Auditor"
																/>
															)}
															loading={this.state.usuarioList == null}
														/> : ""}
													</Stack>
												</Grid>
												<Grid item xs={3}>
													<Stack spacing={3}>
														<Typography align="center">Cadastrador</Typography>
														<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[this.state.cadastradorId]} direction="column"/>
														{this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR") ? <Autocomplete
															id="cadastrador"
															options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
															getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
															renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																		<UsuarioDisplayStack usuario={this.state.usuarioByUsuarioId?.[option]}/>
																	</Box>}
															value={this.state.cadastradorId}
															onChange={(event, value) => this.setState({cadastradorId: value})}
															renderInput={(params) => (
																<TextField
																{...params}
																variant="outlined"
																label="Cadastrador"
																/>
															)}
															loading={this.state.usuarioList == null}
														/> : ""}
													</Stack>
												</Grid>
											</React.Fragment> : <Grid item xs={12}><Alert severity="info">Você poderá ver os atores da venda após salva-la.</Alert></Grid>}
										</React.Fragment> : ""}

										{this.state.tab == "PAGAMENTO" ? <React.Fragment>
											<Grid item xs={12}>
												<FormControl fullWidth>
													<InputLabel>Forma de Pagamento</InputLabel>
													<Select
														id="forma-de-pagamento"
														value={this.state.formaDePagamento}
														label="Forma de Pagamento"
														onChange={(e) => this.setState({formaDePagamento: e.target.value})}
														>
														<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
														{this.formaDePagamentoEnum.map((formaDePagamento) => <MenuItem key={formaDePagamento.value} value={formaDePagamento.value}>{formaDePagamento.nome}</MenuItem>)}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<Autocomplete
													id="vencimento"
													freeSolo
													disableClearable
													options={this.vencimentoEnum}
													value={this.state.vencimento}
													onInputChange={(event, value) => this.setState({vencimento: value})}
													renderInput={(params) => (
														<TextField
															{...params}
															variant="outlined"
															label="Vencimento"
															error={"vencimento" in this.state.errors}
															helperText={this.state.errors?.vencimento ?? ""}
														/>
													)}
												/>
											</Grid>
											{this.state.formaDePagamento == "DEBITO_AUTOMATICO" ? <React.Fragment>
												<Grid item xs={4}>
													<TextField
														id="agencia"
														value={this.state.agencia}
														onChange={(e) => this.setState({agencia: e.target.value})}
														fullWidth
														label="Agência"
														variant="outlined"
														disabled={this.state.calling}
														error={"agencia" in this.state.errors}
														helperText={this.state.errors?.agencia ?? ""}
														inputProps={{
															maxLength: 50,
														}}
													/>
												</Grid>
												<Grid item xs={4}>
													<TextField
														id="conta"
														value={this.state.conta}
														onChange={(e) => this.setState({conta: e.target.value})}
														fullWidth
														label="Conta"
														variant="outlined"
														disabled={this.state.calling}
														error={"conta" in this.state.errors}
														helperText={this.state.errors?.conta ?? ""}
														inputProps={{
															maxLength: 50,
														}}
													/>
												</Grid>
												<Grid item xs={4}>
													<TextField
														id="banco"
														value={this.state.banco}
														onChange={(e) => this.setState({banco: e.target.value})}
														fullWidth
														label="Banco"
														variant="outlined"
														disabled={this.state.calling}
														error={"banco" in this.state.errors}
														helperText={this.state.errors?.banco ?? ""}
														inputProps={{
															maxLength: 50,
														}}
													/>
												</Grid>
											</React.Fragment> : ""}
										</React.Fragment> : ""}

										{this.state.tab == "FATURAS" ? <React.Fragment>
											<Grid item xs={12}>
												<Box display="flex" flexDirection="column" gap={3}>
													{this.state.faturaList.length == 0 ? <Alert severity="info">As faturas que você adicionar aparecerão aqui.</Alert> : ""}
													{this.state.faturaList.map((fatura, i) => 
														<Paper key={i} sx={{padding: 3}}>
															<Grid container spacing={3}>
																<Grid item xs={4}>
																	<DatePicker
																		label="Mês"
																		views={['month', 'year']}
																		value={fatura.mes}
																		onChange={(newValue) => this.updateFatura(i, "mes", newValue)}
																		slotProps={{
																			textField: {
																				fullWidth: true,
																			}
																		}}
																	/>
																</Grid>
																<Grid item xs={4}>
																	<FormControl fullWidth>
																		<InputLabel>Status</InputLabel>
																		<Select
																			value={fatura.status}
																			label="Status"
																			onChange={(e) => this.updateFatura(i, "status", e.target.value)}
																			>
																			{this.faturaStatusEnum.map((status) => <MenuItem key={status.value} value={status.value}>{status.nome}</MenuItem>)}
																		</Select>
																	</FormControl>
																</Grid>
																<Grid item container xs={4} display="flex" flexDirection="row" gap={3} alignItems="center">
																	<MoneyInput
																		value={fatura.valor}
																		onChange={(e) => this.updateFatura(i, "valor", e.target.value)}
																		label="Valor"
																		variant="outlined"
																		disabled={this.state.calling}
																		sx={{flexGrow: 1}}
																	/>
																	<IconButton
																		onClick={() => this.deleteFatura(i)}
																	>
																		<DeleteIcon/>
																	</IconButton>
																</Grid>
															</Grid>
														</Paper>
													)}
												</Box>
											</Grid>
											<Grid item xs={12} container display="flex" justifyContent="flex-end">
												<Button variant="contained" size="large" startIcon={<AddIcon />} onClick={this.addFatura}>Adicionar Fatura</Button>
											</Grid>
										</React.Fragment> : ""}

										{this.state.tab == "OBSERVACAO" ? <React.Fragment>
											<Grid item xs={12}>
												<TextField
													id="observacao"
													value={this.state.observacao}
													onChange={(e) => this.setState({observacao: e.target.value})}
													fullWidth
													label="Observação"
													variant="outlined"
													disabled={this.state.calling}
													error={"observacao" in this.state.errors}
													helperText={this.state.errors?.observacao ?? ""}
													inputProps={{
														maxLength: 200,
													}}
													multiline
													rows={4}
												/>
											</Grid>
										</React.Fragment> : ""}

										{this.state.tab == "STATUS" ? <React.Fragment>
											<Grid item xs={6}>
												<Stack spacing={1}>
													<Autocomplete
														id="novo-status"
														loading={this.state.vendaStatusList == null}
														options={(this.state.vendaStatusList ?? []).map((vendaStatus) => vendaStatus.vendaStatusId).sort((a, b) => this.state.vendaStatusByVendaStatusId[a].ordem - this.state.vendaStatusByVendaStatusId[b].ordem)}
														groupBy={(option) => VendaStatusCategoriaMap?.[this.state.vendaStatusByVendaStatusId?.[option]?.categoria] ?? "Sem Categoria"}
														getOptionLabel={(option) => this.state.vendaStatusByVendaStatusId?.[option]?.nome ?? ""}
														value={this.state.novoStatusId}
														onChange={(event, value) => this.setState({novoStatusId: value})}
														renderInput={(params) => (
															<TextField
																error={"statusId" in this.state.errors}
																helperText={this.state.errors?.statusId}
																	{...params}
																variant="outlined"
																label="Novo Status"
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
													/>
													{!this.state.createMode ? <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
														<Typography>Status atual:</Typography>
														<VendaStatusChip vendaStatus={this.state.vendaStatusByVendaStatusId?.[this.state.statusId]}/>
													</Stack> : ""}
												</Stack>
											</Grid>
											<Grid item xs={6}>
												<TextField
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
														maxLength: 200,
													}}
													multiline
													rows={4}
												/>
											</Grid>
											<Grid item xs={12}>
												<LoadingButton color="success" fullWidth variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveVenda}>Salvar Venda</LoadingButton>
											</Grid>
										</React.Fragment> : ""}

										{this.state.tab == "ANEXOS" ? <React.Fragment>
											{!this.state.createMode ? <React.Fragment>
												<Grid item xs={12}>
													<ButtonGroup sx={{marginBottom: 3}}>
														<LoadingButton component="label" variant="outlined" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.updatingAnexoList} disabled={this.state.updatingAnexoList} onClick={this.getAnexoListFromApi}>
															Atualizar
														</LoadingButton>
														<LoadingButton component="label" variant="contained" startIcon={<CloudUploadIcon />} loadingPosition="start" loading={this.state.uploadingAnexo} disabled={this.state.updatingAnexoList}>
															Adicionar Anexo
															<input type="file" id="anexo" hidden onChange={this.handleUploadAnexoChange}/>
														</LoadingButton>
													</ButtonGroup>
												</Grid>
												<Grid item xs={12}>
													{(this.state?.anexoList ?? []).length == 0 ? <Alert severity="info">Os anexos que você adicionar aparecerão aqui.</Alert> : ""}
													<Stack direction="row" spacing={1}>
														{(this.state?.anexoList ?? []).map((anexo) =>
															<Chip
																key={anexo.id}
																component="a"
																clickable
																target="_blank"
																label={anexo.name}
																href={api.defaults.baseURL + "/anexo/download/" + anexo.id}
																onDelete={(e) => {e.preventDefault();this.deleteAnexo(anexo.id)}}
															/>)}
													</Stack>
												</Grid>
											</React.Fragment> : <Grid item xs={12}><Alert severity="info">Você poderá enviar anexos após salvar a venda.</Alert></Grid>}
										</React.Fragment> : ""}

										{this.state.tab == "ATUALIZACOES" ? <React.Fragment>
											{!this.state.createMode ? <React.Fragment>
												<Grid item xs={12}>
													<CustomDataGridPremium
														rows={this.state.atualizacaoRows}
														columns={this.atualizacaoColumns}
														disableRowSelectionOnClick
														getRowHeight={() => 'auto'}
														initialState={{
														    pagination: { paginationModel: { pageSize: 50 } },
														    sorting: {
														    	sortModel: [{ field: 'data', sort: 'desc' }],
														    }
														  }}
														pageSizeOptions={[5, 10, 15, 20, 50, 100]}
														loading={this.state.calling}
														sx={{
															marginBottom: 3,
															height: 800
														}}
														pagination
														disableAggregation
														slots={{
															headerFilterMenu: null,
														}}
														disableColumnFilter
													/>
												</Grid>
											</React.Fragment> : <Grid item xs={12}><Alert severity="info">Você poderá ver as atualizações da venda após salva-la.</Alert></Grid>}
										</React.Fragment> : ""}

									</Grid>
								}
							</Box>
				</Paper>
				<Snackbar open={this.state.alertOpen} onClose={(e, reason) => (reason !== "clickaway") ? this.closeAlert() : ""} anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
					<div>{this.state.alert}</div>
				</Snackbar>
				<Dialog
					disableEscapeKeyDown
					open={this.state.addProdutoDialogOpen}
					onClose={() => this.setState({addProdutoDialogOpen: false})}
					fullWidth={true}
        			maxWidth={"md"}
				>
					<DialogTitle>Adicionar Produto</DialogTitle>
					<DialogContent dividers>
						<Box>
							<Autocomplete
								id="add-produto"
								loading={this.state.produtoList == null}
								options={Object.keys(this.state.produtoByProdutoId ?? {}).map(key => parseInt(key)).filter((option) => this.state.produtoByProdutoId[option].tipo == this.state.tipoProduto)}
								getOptionLabel={(option) => `${this.state.produtoByProdutoId[option].nome}`}
								value={this.state.addProdutoId}
								onChange={(event, value) => this.setState({addProdutoId: value})}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Novo Produto"
										helperText={this.state.addProdutoId == null ? "produto personalizado" : ""}
									/>
								)}
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button variant="outlined" onClick={() => this.setState({addProdutoDialogOpen: false})}>Cancelar</Button>
						<Button variant="contained" onClick={this.addProduto}>Adicionar</Button>
					</DialogActions>
				</Dialog>
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	return <CreateEditVendaModule params={params} location={location} navigate={navigate} searchParams={searchParams} {...props}/>
}