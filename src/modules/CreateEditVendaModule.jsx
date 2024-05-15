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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EmailIcon from '@mui/icons-material/Email';
import NumbersIcon from '@mui/icons-material/Numbers';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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

import CPFInput from "../components/CPFInput";
import CNPJInput from "../components/CNPJInput";
import PhoneInput from "../components/PhoneInput";
import CEPInput from "../components/CEPInput";
import UsuarioDisplayStack from "../components/UsuarioDisplayStack";

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

			// tipo da venda

			tipoPessoa: null,
			tipoProduto: null,

			// dados pessoa cpf

			cpf: "",
			nome: "",
			dataDeNascimento: null,
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

			// dados contrato ambos

			os: "",
			sistema: null,
			supervisorId: null,
			vendedorId: null,
			auditorId: null,
			origem: "",
			dataVenda: null,

			// dados contrato movel

			dataAtivacao: null,
			prints: false,

			// dados contrato fibra

			dataAgendamento: null,
			dataInstalacao: null,
			pdv: "",
			vendaOriginal: false,
			brscan: false,
			loginVendedor: "",

			//pagamento
			formaDePagamento: null,
			vencimento: null,
			agencia: "",
			conta: "",
			banco: "",

			//status
			statusId: null,
			relato: "",

			//observacao
			observacao: "",

			saving: false,
			calling: false,
			updatingAnexoList: false,
			uploadingAnexo: false,
			deletingAnexo: false,

			//atualização
			atualizacaoList: null,
			atualizacaoRows: [],

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
			{nome: "Debito Automático", value: "DEBITO_AUTOMATICO"},
			{nome: "Cartão de Crédito", value: "CARTAO_CREDITO"},
		];
		this.vencimentoEnum = ["1", "3", "7", "10"];

		this.atualizacaoColumns = [
			{ field: 'statusNome', headerName: 'Status', minWidth: 100, flex: 1, renderCell: (params) => <Chip
				color="primary"
				variant="contained"
				label={params.row.status.nome}
				icon={<Icon>{params.row.status.icon}</Icon>}
			/>},
			{ field: 'usuarioNome', headerName: 'Usuário', minWidth: 100, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={params.row.usuario}/>},
			{ field: 'data', headerName: 'Data', minWidth: 150, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'relato', headerName: 'Relato', minWidth: 400, flex: 1, renderCell: (params) => <pre>{params.value.replace(/(\\n)/g, "\n")}</pre> },
		];

		this.getVendaFromApi = this.getVendaFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getAnexoListFromApi = this.getAnexoListFromApi.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);
		this.getProdutoListFromApi = this.getProdutoListFromApi.bind(this);

		this.calculateAtualizacaoRows = this.calculateAtualizacaoRows.bind(this);

		this.addProduto = this.addProduto.bind(this);
		this.updateProduto = this.updateProduto.bind(this);
		this.deleteProduto = this.deleteProduto.bind(this);

		this.addPortabilidade = this.addPortabilidade.bind(this);
		this.updatePortabilidade = this.updatePortabilidade.bind(this);
		this.deletePortabilidade = this.deletePortabilidade.bind(this);

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
				this.setState({
					venda: venda,
					tipoProduto: venda.tipoProduto,
					tipoPessoa: venda.tipoPessoa,
					atualizacaoList: venda.atualizacaoList,
					vendaProdutoList: venda.produtoList,
					calling: false
				}, () => this.calculateAtualizacaoRows());
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
				status: atualizacao.status,
				statusNome: atualizacao.status.nome,
				usuario: atualizacao.usuario,
				usuarioNome: atualizacao.usuario.nome,
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

	addProduto() {
		let vendaProdutoList = this.state.vendaProdutoList;

		let tipo = this.state.tipoProduto ?? "MOVEL";
		let nome = "Produto Personalizado";

		if (this.state.addProdutoId !== null) {
			tipo = this.state.produtoByProdutoId[this.state.addProdutoId].tipo;
			nome = this.state.produtoByProdutoId[this.state.addProdutoId].nome;
		}

		vendaProdutoList.push({
			tipo: tipo,
			nome: nome,
			valor: 0,
			quantidade: 1,
			telefoneFixo: 0,
			valorTelefoneFixo: 0,
			portabilidade: 0,
			portabilidadeList: [],
		})

		this.setState({
			vendaProdutoList: vendaProdutoList
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
			operadora: "",
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

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	postVenda(data) {
		this.setState({calling: true, saving: true});
		api.post(`/venda/`, data)
			.then((response) => {
				this.props.navigate("/vendas/" + response.data.vendaId + "?novo");
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao criar venda!");
				}
				else
					this.openAlert("error", "Erro inesperado");
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
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar venda!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	saveVenda() {

		let data = {
			nome: this.state.nome,
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
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Nova Venda" : "Editar Venda"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
					</ButtonGroup>
					<Box display="flex" justifyContent="center">
						{((!this.state.createMode && this.state.venda == null)
							) ? <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box> :
									<Grid container spacing={3} sx={{margin: 0, maxWidth: 1200}}>
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
												{this.tipoProdutoEnum.map((tipoProduto) => <ToggleButton key={tipoProduto} value={tipoProduto}>{tipoProduto}</ToggleButton>)}
											</ToggleButtonGroup>
										</Grid>
										<Grid item xs={12}>
											<Divider><Chip icon={<SwitchAccountIcon />} label="Tipo da Pessoa" /></Divider>
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
												{this.tipoPessoaEnum.map((tipoPessoa) => <ToggleButton key={tipoPessoa} value={tipoPessoa}>{tipoPessoa}</ToggleButton>)}
											</ToggleButtonGroup>
										</Grid>
										{this.state.tipoProduto !== null && this.state.tipoPessoa !== null ? <React.Fragment>
											<Grid item xs={12}>
												<Divider><Chip icon={<PersonIcon />} label="Dados do Cliente" /></Divider>
											</Grid>
											{this.state.tipoPessoa == "CPF" ? <React.Fragment>
												<Grid item xs={6}>
													<CPFInput
														id="cpf"
														value={this.state.cpf}
														onChange={(e) => this.setState({cpf: e.target.value})}
														fullWidth
														label="CPF"
														required
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
														required
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
														value={this.state.dataDeNascimento}
														onChange={(newValue) => this.setState({dataDeNascimento: newValue})}
														slotProps={{
															field: { clearable: true },
															textField: {
																fullWidth: true,
																error: "dataDeNascimento" in this.state.errors,
																helperText: this.state.errors?.dataDeNascimento ?? "",
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
														required
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
														required
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
														required
														variant="outlined"
														disabled={this.state.calling}
														error={"nomeDaMae" in this.state.errors}
														helperText={this.state.errors?.nomeDaMae ?? ""}
														inputProps={{
															maxLength: 200,
														}}
													/>
												</Grid>
											</React.Fragment> : <React.Fragment>
												<Grid item xs={6}>
													<CNPJInput
														id="cnpj"
														value={this.state.cnpj}
														onChange={(e) => this.setState({cnpj: e.target.value})}
														fullWidth
														label="CNPJ"
														required
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
														required
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
														required
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
														required
														variant="outlined"
														disabled={this.state.calling}
														error={"cpfRepresentanteLegal" in this.state.errors}
														helperText={this.state.errors?.cpfRepresentanteLegal ?? ""}
													/>
												</Grid>
											</React.Fragment>}
											<Grid item xs={12}>
												<Divider><Chip icon={<LocalPhoneIcon />} label="Contato" /></Divider>
											</Grid>
											<Grid item xs={12}>
												<TextField
													id="nome-contato"
													value={this.state.nomeContato}
													onChange={(e) => this.setState({nomeContato: e.target.value})}
													fullWidth
													label="Nome Contato"
													required
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
													required
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
													required
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
													required
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
													required
													variant="outlined"
													disabled={this.state.calling}
													error={"email" in this.state.errors}
													helperText={this.state.errors?.email ?? ""}
													inputProps={{
														maxLength: 200,
													}}
												/>
											</Grid>
											<Grid item xs={12}>
												<Divider><Chip icon={<PlaceIcon />} label="Endereço" /></Divider>
											</Grid>
											<Grid item xs={4}>
												<CEPInput
													id="cep"
													value={this.state.cep}
													onChange={(e) => this.setState({cep: e.target.value})}
													fullWidth
													label="CEP"
													required
													variant="outlined"
													disabled={this.state.calling}
													error={"cep" in this.state.errors}
													helperText={this.state.errors?.cep ?? ""}
												/>
											</Grid>
											<Grid item xs={4}>
												<TextField
													id="logradouro"
													value={this.state.logradouro}
													onChange={(e) => this.setState({logradouro: e.target.value})}
													fullWidth
													label="Logradouro"
													required
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
													required
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
													required
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
													required
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
													required
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
													required
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
													required
													variant="outlined"
													disabled={this.state.calling}
													error={"uf" in this.state.errors}
													helperText={this.state.errors?.uf ?? ""}
													inputProps={{
														maxLength: 2,
													}}
												/>
											</Grid>
											<Grid item xs={12}>
												<Divider><Chip icon={<DescriptionIcon />} label="Produtos" /></Divider>
											</Grid>
											<Grid item xs={12}>
												<Box display="flex" flexDirection="column" gap={3}>
													{this.state.vendaProdutoList.map((produto, i) => 
														<Paper key={i} sx={{padding: 1}}>
															<Grid container spacing={3}>
																<Grid item xs={6}>
																	<TextField
																		value={produto.nome}
																		onChange={(e) => this.updateProduto(i, "nome", e.target.value)}
																		fullWidth
																		label="Nome"
																		required
																		variant="outlined"
																		disabled={this.state.calling}
																		inputProps={{
																			maxLength: 100,
																		}}
																	/>
																</Grid>
																<Grid item xs={6}>
																	<FormControl fullWidth>
																		<InputLabel>Tipo</InputLabel>
																		<Select
																			value={produto.tipo}
																			label="Tipo"
																			onChange={(e) => this.updateProduto(i, "tipo", e.target.value)}
																			>
																			{this.tipoProdutoEnum.map((tipoProduto) => <MenuItem key={tipoProduto} value={tipoProduto}>{tipoProduto}</MenuItem>)}
																		</Select>
																	</FormControl>
																</Grid>
																<Grid item xs={6}>
																	<TextField
																		value={produto.valor}
																		onChange={(e) => this.updateProduto(i, "valor", e.target.value)}
																		fullWidth
																		label="Valor"
																		required
																		variant="outlined"
																		disabled={this.state.calling}
																	/>
																</Grid>
																<Grid item xs={6}>
																	<TextField
																		value={produto.quantidade}
																		onChange={(e) => this.updateProduto(i, "quantidade", e.target.value)}
																		fullWidth
																		label="Quantidade"
																		required
																		variant="outlined"
																		disabled={this.state.calling}
																	/>
																</Grid>
																{produto.tipo == "MOVEL" ? <React.Fragment>
																	<Grid item xs={12}>
																		<FormControl>
																			<FormLabel id={"portabilidade" + i}>Portabilidade</FormLabel>
																			<RadioGroup
																				row
																				aria-labelledby={"portabilidade" + i}
																				name="controlled-radio-buttons-group"
																				value={produto.portabilidade}
																				onChange={(e) => this.updateProduto(i, "portabilidade", e.target.value)}
																			>
																			<FormControlLabel value={true} control={<Radio />} label="Sim" />
																			<FormControlLabel value={false} control={<Radio />} label="Não" />
																			</RadioGroup>
																		</FormControl>
																	</Grid>
																	{String(produto.portabilidade) == "true" ? <React.Fragment>
																		<Grid item xs={12}>
																			<Box display="flex" flexDirection="column" gap={3}>
																				{produto.portabilidadeList.map((portabilidade, j) => 
																					<Paper elevation={2} key={i} sx={{padding: 1}}>
																						<Grid container spacing={3}>
																							<Grid item xs={5}>
																								<PhoneInput
																									value={portabilidade.telefone}
																									onChange={(e) => this.updatePortabilidade(i, j, "telefone", e.target.value)}
																									fullWidth
																									label="Número"
																									required
																									variant="outlined"
																									disabled={this.state.calling}
																								/>
																							</Grid>
																							<Grid item xs={5}>
																								<TextField
																									value={portabilidade.operadora}
																									onChange={(e) => this.updatePortabilidade(i, j, "operadora", e.target.value)}
																									fullWidth
																									label="Operadora"
																									required
																									variant="outlined"
																									disabled={this.state.calling}
																								/>
																							</Grid>
																							<Grid item xs>
																								<Button color="error" fullWidth variant="contained" size="large" startIcon={<DeleteIcon />} onClick={() => this.deletePortabilidade(i, j)}>Remover</Button>
																							</Grid>
																						</Grid>
																					</Paper>
																				)}
																			</Box>
																		</Grid>
																		<Grid item xs={12}>
																			<Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => this.addPortabilidade(i)}>Adicionar Portabilidade</Button>
																		</Grid>
																	</React.Fragment> : ""}
																</React.Fragment> : <React.Fragment>
																	<Grid item xs={6}>
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
																		<Grid item xs={6}>
																			<TextField
																				value={produto.valorTelefoneFixo}
																				onChange={(e) => this.updateProduto(i, "valorTelefoneFixo", e.target.value)}
																				fullWidth
																				label="Valor Telefone Fixo"
																				required
																				variant="outlined"
																				disabled={this.state.calling}
																			/>
																		</Grid> : ""}
																</React.Fragment>}
																<Grid item xs={12}>
																	<Button fullWidth color="error" variant="contained" size="large" startIcon={<AddIcon />} onClick={() => this.deleteProduto(i)}>Remover Produto</Button>
																</Grid>
															</Grid>
														</Paper>
													)}
												</Box>
											</Grid>
											<Grid item xs={12}>
												<Autocomplete
													id="add-produto"
													loading={this.state.produtoList == null}
													options={Object.keys(this.state.produtoByProdutoId ?? {}).map(key => parseInt(key))}
													getOptionLabel={(option) => `${this.state.produtoByProdutoId[option].nome} - ${this.state.produtoByProdutoId[option].tipo}`}
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
											</Grid>
											<Grid item xs={12}>
												<Button fullWidth variant="contained" size="large" startIcon={<AddIcon />} onClick={this.addProduto}>Adicionar Produto</Button>
											</Grid>
											<Grid item xs={12}>
												<Divider><Chip icon={<GavelIcon />} label="Dados do Contrato" /></Divider>
											</Grid>
											<Grid item xs={6}>
												<TextField
													id="os"
													value={this.state.os}
													onChange={(e) => this.setState({os: e.target.value})}
													fullWidth
													label="OS"
													required
													variant="outlined"
													disabled={this.state.calling}
													error={"os" in this.state.errors}
													helperText={this.state.errors?.os ?? ""}
													inputProps={{
														maxLength: 50,
													}}
												/>
											</Grid>
											<Grid item xs={6}>
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
											<Grid item xs={6}>
												<TextField
													id="origem"
													value={this.state.origem}
													onChange={(e) => this.setState({origem: e.target.value})}
													fullWidth
													label="Mailing/Origem"
													required
													variant="outlined"
													disabled={this.state.calling}
													error={"origem" in this.state.errors}
													helperText={this.state.errors?.origem ?? ""}
													inputProps={{
														maxLength: 100,
													}}
												/>
											</Grid>
											<Grid item xs={6}>
													<DateTimePicker
														label="Data da Venda"
														value={this.state.dataVenda}
														onChange={(newValue) => this.setState({dataVenda: newValue})}
														slotProps={{
															field: { clearable: true },
															textField: {
																fullWidth: true,
																error: "dataVenda" in this.state.errors,
																helperText: this.state.errors?.dataVenda ?? this.state.dataVenda == null ? "agora" : "outra data",
															},
														}}
													/>
												</Grid>
											{!this.state.createMode ? <React.Fragment>
												<Grid item xs={4}>
													<Autocomplete
														id="vendedor"
														options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
														getOptionLabel={(option) => this.state.usuarioByUsuarioId[option].nome}
														renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																	<Stack direction="row" spacing={1} alignItems="center">
																		<Avatar src={this.state.usuarioByUsuarioId[option].fotoPerfil ? api.defaults.baseURL + "/usuario/" + this.state.usuarioByUsuarioId[option].usuarioId + "/foto-perfil?versao=" + this.state.usuarioByUsuarioId[option].fotoPerfilVersao : ""}>{this.state.usuarioByUsuarioId[option].nome.charAt(0)}</Avatar>
																		<div>{this.state.usuarioByUsuarioId[option].nome}</div>
																		<div>#{this.state.usuarioByUsuarioId[option].matricula}</div>
																	</Stack>
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
														readOnly
													/>
												</Grid>
												<Grid item xs={4}>
													<Autocomplete
														id="supervisor"
														options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
														getOptionLabel={(option) => this.state.usuarioByUsuarioId[option].nome}
														renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																	<Stack direction="row" spacing={1} alignItems="center">
																		<Avatar src={this.state.usuarioByUsuarioId[option].fotoPerfil ? api.defaults.baseURL + "/usuario/" + this.state.usuarioByUsuarioId[option].usuarioId + "/foto-perfil?versao=" + this.state.usuarioByUsuarioId[option].fotoPerfilVersao : ""}>{this.state.usuarioByUsuarioId[option].nome.charAt(0)}</Avatar>
																		<div>{this.state.usuarioByUsuarioId[option].nome}</div>
																		<div>#{this.state.usuarioByUsuarioId[option].matricula}</div>
																	</Stack>
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
														readOnly
													/>
												</Grid>
												<Grid item xs={4}>
													<Autocomplete
														id="auditor"
														options={Object.keys(this.state.usuarioByUsuarioId).map(key => parseInt(key))}
														getOptionLabel={(option) => this.state.usuarioByUsuarioId[option].nome}
														renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
																	<Stack direction="row" spacing={1} alignItems="center">
																		<Avatar src={this.state.usuarioByUsuarioId[option].fotoPerfil ? api.defaults.baseURL + "/usuario/" + this.state.usuarioByUsuarioId[option].usuarioId + "/foto-perfil?versao=" + this.state.usuarioByUsuarioId[option].fotoPerfilVersao : ""}>{this.state.usuarioByUsuarioId[option].nome.charAt(0)}</Avatar>
																		<div>{this.state.usuarioByUsuarioId[option].nome}</div>
																		<div>#{this.state.usuarioByUsuarioId[option].matricula}</div>
																	</Stack>
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
														readOnly
													/>
												</Grid>
											</React.Fragment> : ""}
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
												<Grid item xs={4}>
													<TextField
														id="pdv"
														value={this.state.pdv}
														onChange={(e) => this.setState({pdv: e.target.value})}
														fullWidth
														label="PDV"
														required
														variant="outlined"
														disabled={this.state.calling}
														error={"pdv" in this.state.errors}
														helperText={this.state.errors?.pdv ?? ""}
														inputProps={{
															maxLength: 50,
														}}
													/>
												</Grid>
												<Grid item xs={4}>
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
												<Grid item xs={4}>
													<FormControl>
														<FormLabel id="brscan">BrScan</FormLabel>
														<RadioGroup
															row
															aria-labelledby="brscan"
															name="controlled-radio-buttons-group"
															value={this.state.brscan}
															onChange={(e) => this.setState({brscan: e.target.value})}
														>
														<FormControlLabel value={true} control={<Radio />} label="Sim" />
														<FormControlLabel value={false} control={<Radio />} label="Não" />
														</RadioGroup>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<TextField
														id="login-vendedor"
														value={this.state.loginVendedor}
														onChange={(e) => this.setState({loginVendedor: e.target.value})}
														fullWidth
														label="Login Vendedor"
														required
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
											<Grid item xs={12}>
												<Divider><Chip icon={<PaidIcon />} label="Pagamento" /></Divider>
											</Grid>
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
											{this.state.formaDePagamento == "BOLETO" ?
												<Grid item xs={12}>
													<FormControl fullWidth>
														<InputLabel>Vencimento</InputLabel>
														<Select
															id="vencimento"
															value={this.state.vencimento}
															label="Vencimento"
															onChange={(e) => this.setState({vencimento: e.target.value})}
															>
															<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
															{this.vencimentoEnum.map((vencimento) => <MenuItem key={vencimento} value={vencimento}>{vencimento}</MenuItem>)}
														</Select>
													</FormControl>
												</Grid>
											: this.state.formaDePagamento == "DEBITO_AUTOMATICO" ? <React.Fragment>
												<Grid item xs={4}>
													<TextField
														id="agencia"
														value={this.state.agencia}
														onChange={(e) => this.setState({agencia: e.target.value})}
														fullWidth
														label="Agência"
														required
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
														required
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
														required
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
											<Grid item xs={12}>
												<Divider><Chip icon={<RequestQuoteIcon />} label="Faturas" /></Divider>
											</Grid>
											<Grid item xs={12}>
												<Divider><Chip icon={<ChatIcon />} label="Observação" /></Divider>
											</Grid>
											<Grid item xs={12}>
												<TextField
													id="observacao"
													value={this.state.observacao}
													onChange={(e) => this.setState({observacao: e.target.value})}
													fullWidth
													label="Observação"
													required
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
											<Grid item xs={12}>
												<Divider><Chip icon={<InfoIcon />} label="Status" /></Divider>
											</Grid>
											<Grid item xs={6}>
												<Autocomplete
													id="status"
													loading={this.state.vendaStatusList == null}
													options={Object.keys(this.state.vendaStatusByVendaStatusId ?? {}).map(key => parseInt(key))}
													getOptionLabel={(option) => this.state.vendaStatusByVendaStatusId[option].nome}
													value={this.state.statusId}
													onChange={(event, value) => this.setState({statusId: value})}
													renderInput={(params) => (
														<TextField
															error={"statusId" in this.state.errors}
															helperText={this.state.errors?.statusId}
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
											<Grid item xs={6}>
												<TextField
													id="relato"
													value={this.state.relato}
													onChange={(e) => this.setState({relato: e.target.value})}
													fullWidth
													label="Relato"
													required
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
												<LoadingButton fullWidth variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveVenda}>Salvar Venda</LoadingButton>
											</Grid>
											<Grid item xs={12}>
												<Divider><Chip icon={<AttachmentIcon />} label="Anexos" /></Divider>
											</Grid>
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
											{!this.state.createMode ? <React.Fragment>
												<Grid item xs={12}>
													<Divider><Chip icon={<UpdateIcon />} label="Atualizações" /></Divider>
												</Grid>
												<Grid item xs={12}>
													<DataGrid
														rows={this.state.atualizacaoRows}
														columns={this.atualizacaoColumns}
														disableRowSelectionOnClick
														autoHeight
														getRowHeight={() => 'auto'}
														initialState={{
														    pagination: { paginationModel: { pageSize: 10 } },
														    sorting: {
														    	sortModel: [{ field: 'data', sort: 'desc' }],
														    }
														  }}
														pageSizeOptions={[5, 10, 15, 20]}
														loading={this.state.calling}
														sx={{marginBottom: 3}}
													/>
												</Grid>
											</React.Fragment> : ""}
											{/*<Grid item xs={12}>
												<pre>
													{JSON.stringify(this.state.venda, null, "\t")}
												</pre>
											</Grid>*/}
										</React.Fragment> : <Grid item xs={12}><Alert severity="info">Selecione o tipo do produto e o tipo da pessoa da venda.</Alert></Grid>}
									</Grid>
								}
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
	const [searchParams] = useSearchParams();
	return <CreateEditVendaModule params={params} location={location} navigate={navigate} searchParams={searchParams} {...props}/>
}