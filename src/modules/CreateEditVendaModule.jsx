import React, {useCallback} from "react";

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
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
import Badge from '@mui/material/Badge';
import RecyclingIcon from '@mui/icons-material/Recycling';
import HubIcon from '@mui/icons-material/Hub';
import PublicIcon from '@mui/icons-material/Public';
import Pagination from '@mui/material/Pagination';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormHelperText from '@mui/material/FormHelperText';

import CPFInput from "../components/CPFInput";
import CNPJInput from "../components/CNPJInput";
import PhoneInput from "../components/PhoneInput";
import CEPInput from "../components/CEPInput";
import MoneyInput from "../components/MoneyInput";
import UsuarioDisplayChip from "../components/UsuarioDisplayChip";
import VendaStatusChip from '../components/VendaStatusChip';
import CustomDataGridPremium from "../components/CustomDataGridPremium";

import VendaStatusCategoriaEnum from "../model/VendaStatusCategoriaEnum";
import VendaTipoProdutoEnum from "../model/VendaTipoProdutoEnum";
import VendaProdutoTipoDeLinhaEnum from "../model/VendaProdutoTipoDeLinhaEnum";
import VendaPorteEnum from "../model/VendaPorteEnum";
import VendaFaturaStatusEnum from "../model/VendaFaturaStatusEnum";
import VendaFormaDePagamentoEnum from "../model/VendaFormaDePagamentoEnum";
import VendaBrscanEnum from "../model/VendaBrscanEnum";
import VendaSuporteEnum from "../model/VendaSuporteEnum";
import VendaGeneroEnum from "../model/VendaGeneroEnum";
import VendaReimputadoEnum from "../model/VendaReimputadoEnum";
import VendaTipoDeContaEnum from "../model/VendaTipoDeContaEnum";

import axios from "axios";

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

const ProdutoPaper = React.memo(({ produto, i, errors, calling, updateProduto, deleteProduto, addPortabilidade, portabilidadeList, updatePortabilidade, deletePortabilidade, tipoProduto, adicionalList }) => {

	const updateProdutoNome = useCallback((e) => updateProduto(i, "nome", e.target.value), [i]);
	const updateProdutoValor = useCallback((e) => updateProduto(i, "valor", e.target.value), [i]);
	//const updateProdutoAdicionais = useCallback((event, value) => updateProduto(i, "adicionais", value), [i]);
	const updateProdutoAdicionais = useCallback((event, newValue) => updateProduto(i, "adicionais", newValue.join(",")), [i]);
	const getProdutoAdicionaisOptionList = useCallback(() => adicionalList.filter((adicional) => adicional.tipo == tipoProduto).map((adicional) => adicional.nome), [adicionalList]);
	const updateProdutoTipoDeLinha = useCallback((e) => updateProduto(i, "tipoDeLinha", e.target.value), [i]);
	const updateProdutoDdd = useCallback((e) => updateProduto(i, "ddd", e.target.value), [i]);
	const updateProdutoQuantidade = useCallback((e) => updateProduto(i, "quantidade", e.target.value), [i]);
	const updateProdutoOperadora = useCallback((e) => updateProduto(i, "operadora", e.target.value), [i]);
	const updateProdutoTelefoneFixo = useCallback((e) => updateProduto(i, "telefoneFixo", e.target.value), [i]);
	const updateProdutoValorTelefoneFixo = useCallback((e) => updateProduto(i, "valorTelefoneFixo", e.target.value), [i]);
	const updateProdutoNumeroTelefoneFixo = useCallback((e) => updateProduto(i, "numeroTelefoneFixo", e.target.value), [i]);
	const _addPortabilidade = useCallback(() => addPortabilidade(i), [i]);
	const _deleteProduto = useCallback(() => deleteProduto(i), [i])

	return <Paper key={i} sx={{padding: 3}}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Divider><Chip label={i + 1} /></Divider>
					</Grid>
					<Grid item xs={6}>
						<TextField
							required
							value={produto.nome}
							onChange={updateProdutoNome}
							fullWidth
							label="Nome"
							variant="outlined"
							disabled={calling}
							error={`produtoList[${i}].nome` in errors}
							helperText={errors?.[`produtoList[${i}].nome`] ?? ""}
							inputProps={{
								maxLength: 100,
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<MoneyInput
							required
							value={produto.valor}
							onChange={updateProdutoValor}
							fullWidth
							label="Valor"
							variant="outlined"
							error={`produtoList[${i}].valor` in errors}
							helperText={errors?.[`produtoList[${i}].valor`] ?? ""}
							disabled={calling}
						/>
					</Grid>
					{/*<Grid item xs={12}>
						<Autocomplete
							freeSolo
							disableClearable
							options={adicionalList.filter((adicional) => adicional.tipo == tipoProduto).map((adicional) => adicional.nome)}
							value={produto.adicionais}
							onInputChange={updateProdutoAdicionais}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									label="Adicionais"
								/>
							)}
						/>
					</Grid>*/}
					<Grid item xs={12}>
						<Autocomplete
							multiple
							freeSolo
							options={getProdutoAdicionaisOptionList()}
							value={produto.adicionais.split(",").filter(Boolean)}
							onChange={updateProdutoAdicionais}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									label="Adicionais"
									error={`produtoList[${i}].adicionais` in errors}
									helperText={errors?.[`produtoList[${i}].adicionais`] ?? "Pressione ENTER para adicionar"}
								/>
							)}
						/>
					</Grid>
					{tipoProduto == "FIBRA" && <React.Fragment>
						<Grid item xs={4}>
							<FormControl>
								<FormLabel id={"telefone-fixo" + i}>Telefone Fixo</FormLabel>
								<RadioGroup
									row
									aria-labelledby={"telefone-fixo" + i}
									name="controlled-radio-buttons-group"
									value={produto.telefoneFixo}
									onChange={updateProdutoTelefoneFixo}
								>
								<FormControlLabel value={true} control={<Radio />} label="Sim" />
								<FormControlLabel value={false} control={<Radio />} label="Não" />
								</RadioGroup>
							</FormControl>
						</Grid>
						{String(produto.telefoneFixo) == "true" && <React.Fragment>
								<Grid item xs={4}>
									<MoneyInput
										required
										value={produto.valorTelefoneFixo}
										onChange={updateProdutoValorTelefoneFixo}
										fullWidth
										label="Valor Telefone Fixo"
										variant="outlined"
										disabled={calling}
										error={`produtoList[${i}].valorTelefoneFixo` in errors}
										helperText={errors?.[`produtoList[${i}].valorTelefoneFixo`] ?? ""}
									/>
								</Grid>
								<Grid item xs={4}>
									<PhoneInput
										value={produto.numeroTelefoneFixo}
										onChange={updateProdutoNumeroTelefoneFixo}
										fullWidth
										label="Número Telefone Fixo"
										variant="outlined"
										disabled={calling}
										error={`produtoList[${i}].numeroTelefoneFixo` in errors}
										helperText={errors?.[`produtoList[${i}].numeroTelefoneFixo`] ?? ""}
										ddd={false}
										fixo={true}
									/>
								</Grid>
							</React.Fragment>}
					</React.Fragment>}
					{(tipoProduto == "MOVEL" || String(produto.telefoneFixo) == "true") && <React.Fragment>
							<Grid item xs={4}>
								<FormControl fullWidth required>
									<InputLabel>Tipo de Linha</InputLabel>
									<Select
										value={produto.tipoDeLinha}
										label="Tipo de Linha"
										onChange={updateProdutoTipoDeLinha}
										>
										{Object.keys(VendaProdutoTipoDeLinhaEnum).map((tipoDeLinha) => <MenuItem key={tipoDeLinha} value={tipoDeLinha}>{VendaProdutoTipoDeLinhaEnum[tipoDeLinha]}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={4}>
								<TextField
									value={produto.ddd}
									onChange={updateProdutoDdd}
									fullWidth
									label="DDD"
									variant="outlined"
									disabled={calling}
									error={`produtoList[${i}].ddd` in errors}
									helperText={errors?.[`produtoList[${i}].ddd`] ?? ""}
									inputProps={{
										maxLength: 2,
									}}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									value={produto.operadora}
									onChange={updateProdutoOperadora}
									fullWidth
									label="Operadora"
									variant="outlined"
									disabled={calling}
									error={`produtoList[${i}].operadora` in errors}
									helperText={errors?.[`produtoList[${i}].operadora`] ?? ""}
									inputProps={{
										maxLength: 20,
									}}
								/>
							</Grid>
						</React.Fragment>
					}
					{tipoProduto == "MOVEL" && <React.Fragment>
						<Grid item xs={12}>
							<TextField
								required
								value={produto.quantidade}
								onChange={updateProdutoQuantidade}
								fullWidth
								label="Quantidade"
								variant="outlined"
								disabled={calling}
								error={`produtoList[${i}].quantidade` in errors}
								helperText={errors?.[`produtoList[${i}].quantidade`] ?? ""}
								type="number"
							/>
						</Grid>
						{portabilidadeList.length == 0 ? <Grid item xs={12}><Alert severity="info">Os telefones que você adicionar aparecerão aqui.</Alert></Grid> : ""}
						{portabilidadeList.map((portabilidade, j) =>
							<Grid item xs={3} key={j}>
								<PhoneInput
									required
									value={portabilidade.telefone}
									onChange={(e) => updatePortabilidade(i, j, "telefone", e.target.value)}
									fullWidth
									label="Telefone (sem DDD)"
									variant="outlined"
									disabled={calling}
									error={`produtoList[${i}].portabilidadeList[${j}].telefone` in errors}
									helperText={errors?.[`produtoList[${i}].portabilidadeList[${j}].telefone`] ?? ""}
									ddd={false}
									InputProps={{
										endAdornment: 	<InputAdornment position="end">
															<IconButton
																onClick={() => deletePortabilidade(i, j)}
															>
																<DeleteIcon/>
															</IconButton>
														</InputAdornment>,
									}}
								/>
							</Grid>
						)}
						<Grid item xs={12} container display="flex" justifyContent="flex-end">
							<Button variant="contained" size="large" startIcon={<AddIcon />} onClick={_addPortabilidade}>Adicionar Telefone</Button>
						</Grid>
					</React.Fragment>}
					<Grid item xs={12}>
						<Button color="error" variant="contained" size="large" startIcon={<DeleteIcon />} onClick={_deleteProduto}>Remover Produto</Button>
					</Grid>
				</Grid>
			</Paper>
});

const FaturaPaper = React.memo(({fatura, i, errors, calling, updateFatura, deleteFatura, ALTERAR_AUDITOR}) => {

	const updateFaturaMes = useCallback((newValue) => updateFatura(i, "mes", newValue), [i]);
	const updateFaturaStatus = useCallback((e) => updateFatura(i, "status", e.target.value), [i]);
	const updateFaturaValor = useCallback((e) => updateFatura(i, "valor", e.target.value), [i]);
	const _deleteFatura = useCallback(() => deleteFatura(i), [i]);

	return <Paper sx={{padding: 3}}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Divider><Chip label={i + 1} /></Divider>
					</Grid>
					<Grid item xs={3}>
						<DatePicker
							label="Mês"
							views={['month', 'year']}
							value={fatura.mes}
							onChange={updateFaturaMes}
							slotProps={{
								textField: {
									required: true,
									fullWidth: true,
									error: `faturaList[${i}].mes` in errors,
									helperText: errors?.[`faturaList[${i}].mes`] ?? ""
								}
							}}
							disabled={calling || !ALTERAR_AUDITOR}
						/>
					</Grid>
					<Grid item xs={4}>
						<FormControl fullWidth required disabled={calling || !ALTERAR_AUDITOR}>
							<InputLabel>Status</InputLabel>
							<Select
								value={fatura.status}
								label="Status"
								onChange={updateFaturaStatus}
								>
								{Object.keys(VendaFaturaStatusEnum).map((faturaStatus) => <MenuItem key={faturaStatus} value={faturaStatus}>{VendaFaturaStatusEnum[faturaStatus]}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={5} display="flex" flexDirection="row" gap={3} alignItems="center">
						<MoneyInput
							required
							value={fatura.valor}
							onChange={updateFaturaValor}
							label="Valor"
							variant="outlined"
							disabled={calling || !ALTERAR_AUDITOR}
							error={`faturaList[${i}].valor` in errors}
							helperText={errors?.[`faturaList[${i}].valor`] ?? ""}
							sx={{flexGrow: 1}}
						/>
						<IconButton
							disabled={calling || !ALTERAR_AUDITOR}
							onClick={_deleteFatura}
						>
							<DeleteIcon/>
						</IconButton>
					</Grid>
				</Grid>
			</Paper>
});

class CreateEditVendaModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,
			vendaId: null,

			venda: null,
			usuarioList: null,
			usuarioByUsuarioId: {},
			vendedorList: null,
			vendaStatusList: null,
			vendaStatusByVendaStatusId: {},
			produtoList: null,
			produtoByProdutoId: {},
			sistemaList: null,
			sistemaBySistemaId: {},
			pontoDeVendaList: null,
			pontoDeVendaById: {},
			origemList: null,
			origemByOrigemId: {},
			bancoList: null,
			bancoByBancoId: {},
			adicionalList: null,
			adicionalByAdicionalId: {},

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
			contato1: "",
			contato2: "",
			contato3: "",
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
			sistemaId: null,
			ordem: "",
			origem: "",
			dataVenda: null,
			safra: dayjs().date(1),

			// dados contrato movel

			dataAtivacao: null,
			prints: false,

			// dados contrato fibra

			dataAgendamento: null,
			dataInstalacao: null,
			pdv: "",
			reimputado: "NAO",
			vendaOriginal: true,
			brscan: null,
			suporte: "NAO",
			loginVendedor: "",

			// atores

			supervisorId: null,
			vendedorId: null,
			auditorId: null,
			cadastradorId: null,
			agenteBiometriaId: null,
			vendedorExterno: "",
			supervisorExterno: "",
			auditorExterno: "",
			cadastradorExterno: "",
			agenteBiometriaExterno: "",

			//pagamento
			formaDePagamento: null,
			vencimento: "1",
			agencia: "",
			conta: "",
			banco: "",
			tipoDeConta: null,

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
			updatingVenda: false,
			updatingAnexoList: false,
			uploadingAnexo: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.vencimentoEnum = ["7", "10", "15", "20"];

		this.atualizacaoColumns = [
			{ field: 'statusId', headerName: 'Status', valueGetter: (value, row) => this.state.vendaStatusByVendaStatusId?.[value]?.nome, minWidth: 100, flex: 1, renderCell: (params) => <VendaStatusChip
				vendaStatus={this.state.vendaStatusByVendaStatusId?.[params.row.statusId]}
			/>},
			{ field: 'usuarioId', headerName: 'Usuário', valueGetter: (value, row) => this.state.usuarioByUsuarioId?.[value]?.nome, minWidth: 100, flex: 1, renderCell: (params) => <UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[params.row.usuarioId]}/>},
			{ field: 'data', headerName: 'Data', minWidth: 150, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L LTS') : "" },
			{ field: 'relato', headerName: 'Relato', minWidth: 400, flex: 1, renderCell: (params) => <pre style={{overflow: "auto"}}>{params.value.replace(/(\\n)/g, "\n")}</pre> },
		];

		this.getVendaFromApi = this.getVendaFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getVendedorListFromApi = this.getVendedorListFromApi.bind(this);
		this.getAnexoListFromApi = this.getAnexoListFromApi.bind(this);
		this.getVendaStatusListFromApi = this.getVendaStatusListFromApi.bind(this);
		this.getProdutoListFromApi = this.getProdutoListFromApi.bind(this);
		this.getSistemaListFromApi = this.getSistemaListFromApi.bind(this);
		this.getPontoDeVendaListFromApi = this.getPontoDeVendaListFromApi.bind(this);
		this.getOrigemListFromApi = this.getOrigemListFromApi.bind(this);
		this.getBancoListFromApi = this.getBancoListFromApi.bind(this);
		this.getAdicionalListFromApi = this.getAdicionalListFromApi.bind(this);

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

		this.updateOs = this.updateOs.bind(this);
		this.updateCustcode = this.updateCustcode.bind(this);
		this.updateSistemaId = this.updateSistemaId.bind(this);
		this.updateOrigem = this.updateOrigem.bind(this);
		this.updateSafra = this.updateSafra.bind(this);
		this.updateDataVenda = this.updateDataVenda.bind(this);
		this.updateReimputado = this.updateReimputado.bind(this);
		this.updateDataAtivacao = this.updateDataAtivacao.bind(this);
		this.updatePrints = this.updatePrints.bind(this);
		this.updateDataAgendamento = this.updateDataAgendamento.bind(this);
		this.updateDataInstalacao = this.updateDataInstalacao.bind(this);
		this.updatePdv = this.updatePdv.bind(this);
		this.updateVendaOriginal = this.updateVendaOriginal.bind(this);
		this.updateBrscan = this.updateBrscan.bind(this);
		this.updateSuporte = this.updateSuporte.bind(this);
		this.updateLoginVendedor = this.updateLoginVendedor.bind(this);

		this.saveVenda = this.saveVenda.bind(this);
		this.patchVenda = this.patchVenda.bind(this);
		this.postVenda = this.postVenda.bind(this);
		this.handleUploadAnexoChange = this.handleUploadAnexoChange.bind(this);
		this.trashAnexo = this.trashAnexo.bind(this);
		this.untrashAnexo = this.untrashAnexo.bind(this);
		this.deleteAnexo = this.deleteAnexo.bind(this);

		this.setVendaIdFromParams = this.setVendaIdFromParams.bind(this);
		this.setVendaIdFromProps = this.setVendaIdFromProps.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		!this.props.inlineMode ? this.setVendaIdFromParams() : this.setVendaIdFromProps();
		this.getUsuarioListFromApi();
		this.getVendedorListFromApi();
		this.getVendaStatusListFromApi();
		this.getProdutoListFromApi();
		this.getSistemaListFromApi();
		this.getPontoDeVendaListFromApi();
		this.getOrigemListFromApi();
		this.getBancoListFromApi();
		this.getAdicionalListFromApi();
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
			this.setState({createMode: true, vendedorId: this.props.usuario.usuarioId});
	}

	setVendaIdFromProps() {
		this.setState({createMode: false, vendaId: this.props.vendaId}, () => {
			this.getVendaFromApi();
			this.getAnexoListFromApi();
		});
	}

	getVendaFromApi() {
		this.setState({calling: true, updatingVenda: true})
		api.get("/venda/" + this.state.vendaId, {redirect403: false})
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
					contato1: venda.contato1,
					contato2: venda.contato2,
					contato3: venda.contato3,
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
					sistemaId: venda.sistemaId,
					ordem: venda.ordem,
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
					reimputado: venda.reimputado,
					vendaOriginal: venda.vendaOriginal,
					brscan: venda.brscan,
					suporte: venda.suporte,
					loginVendedor: venda.loginVendedor,

					//atores

					supervisorId: venda.supervisorId,
					vendedorId: venda.vendedorId,
					auditorId: venda.auditorId,
					cadastradorId: venda.cadastradorId,
					agenteBiometriaId: venda.agenteBiometriaId,
					vendedorExterno: venda.vendedorExterno,
					supervisorExterno: venda.supervisorExterno,
					auditorExterno: venda.auditorExterno,
					cadastradorExterno: venda.cadastradorExterno,
					agenteBiometriaExterno: venda.agenteBiometriaExterno,

					//pagamento
					formaDePagamento: venda.formaDePagamento,
					vencimento: venda.vencimento,
					agencia: venda.agencia,
					conta: venda.conta,
					banco: venda.banco,
					tipoDeConta: venda.tipoDeConta,

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

					calling: false,
					updatingVenda: false,
				}, () => {
					this.calculateAtualizacaoRows()
				});
				console.log(venda);
			})
			.catch((err) => {
				console.log(err);
				this.openAlert("error", "Falha ao obter venda!");
				this.setState({calling: false, updatingVenda: false});
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

	getVendedorListFromApi() {
		api.get("/usuario/me/usuario-list?include-me=true")
			.then((response) => {
				let vendedorList = response.data;
				this.setState({vendedorList: vendedorList});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendedorListFromApi, 3000);
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

	getOrigemListFromApi() {
		api.get("/empresa/me/origem")
			.then((response) => {
				let origemList = response.data;
				let origemByOrigemId = {};
				origemList.forEach((origem) => origemByOrigemId[origem.origemId] = origem);
				this.setState({origemList: origemList, origemByOrigemId: origemByOrigemId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getOrigemListFromApi, 3000);
			});
	}

	getBancoListFromApi() {
		api.get("/empresa/me/banco")
			.then((response) => {
				let bancoList = response.data;
				let bancoByBancoId = {};
				bancoList.forEach((banco) => bancoByBancoId[banco.bancoId] = banco);
				this.setState({bancoList: bancoList, bancoByBancoId: bancoByBancoId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getBancoListFromApi, 3000);
			});
	}

	getAdicionalListFromApi() {
		api.get("/empresa/me/adicional")
			.then((response) => {
				let adicionalList = response.data;
				let adicionalByAdicionalId = {};
				adicionalList.forEach((adicional) => adicionalByAdicionalId[adicional.adicionalId] = adicional);
				this.setState({adicionalList: adicionalList, adicionalByAdicionalId: adicionalByAdicionalId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getAdicionalListFromApi, 3000);
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
			numeroTelefoneFixo: "",
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

		vendaProdutoList[produtoIndex] = Object.assign({}, produto);

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

		produto.portabilidadeList = [...produto.portabilidadeList];

		this.setState({
			vendaProdutoList: vendaProdutoList
		})
	}

	updatePortabilidade(produtoIndex, portabilidadeIndex, atributo, valor) {

		let vendaProdutoList = this.state.vendaProdutoList;

		let produto = vendaProdutoList[produtoIndex];

		let portabilidade = produto.portabilidadeList[portabilidadeIndex];

		portabilidade[atributo] = valor;

		produto.portabilidadeList = [...produto.portabilidadeList];

		this.setState({vendaProdutoList: vendaProdutoList});
	}

	deletePortabilidade(produtoIndex, portabilidadeIndex) {

		let vendaProdutoList = this.state.vendaProdutoList;

		let produto = vendaProdutoList[produtoIndex];

		produto.portabilidadeList.splice(portabilidadeIndex, 1);

		produto.portabilidadeList = [...produto.portabilidadeList];

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

		faturaList[faturaIndex] = Object.assign({}, fatura);

		this.setState({faturaList: faturaList});
	}

	deleteFatura(faturaIndex) {

		let faturaList = this.state.faturaList;

		faturaList.splice(faturaIndex, 1);

		this.setState({faturaList: faturaList});

	}

	// otimização

	updateOs = (e) => this.setState({os: e.target.value});

	updateCustcode = (e) => this.setState({custcode: e.target.value});

	updateSistemaId = (e) => this.setState({sistemaId: e.target.value});

	updateOrdem = (e) => this.setState({ordem: e.target.value});

	updateOrigem = (event, value) => this.setState({origem: value});

	updateSafra = (newValue) => this.setState({safra: newValue});

	updateDataVenda = (newValue) => this.setState({dataVenda: newValue});

	updateReimputado = (e) => this.setState({reimputado: e.target.value});

	updateDataAtivacao = (newValue) => this.setState({dataAtivacao: newValue});

	updatePrints = (e) => this.setState({prints: e.target.value});

	updateDataAgendamento = (newValue) => this.setState({dataAgendamento: newValue});

	updateDataInstalacao = (newValue) => this.setState({dataInstalacao: newValue});

	updatePdv = (event, value) => this.setState({pdv: value});

	updateVendaOriginal = (e) => this.setState({vendaOriginal: e.target.value});

	updateBrscan = (e) => this.setState({brscan: e.target.value});

	updateSuporte = (e) => this.setState({suporte: e.target.value});

	updateLoginVendedor = (e) => this.setState({loginVendedor: e.target.value});

	// fim otimização

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert} sx={{ whiteSpace: 'pre-line' }}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	formatErrors(errors) {
		let msg = "----------------\n";
		Object.keys(errors).forEach((key) => msg += `${key}: ${errors[key]}\n`)
		return msg;
	}

	parseErrors(errors) {
		let keys = Object.keys(errors);

		if (["tipoProduto", "tipoPessoa"].some(r => keys.includes(r)))
			errors["TIPO_DA_VENDA"] = "";

		if (["cpf", "nome", "dataNascimento", "genero", "rg", "rgOrgaoEmissor", "rgDataEmissao", "nomeDaMae",
			"cnpj", "porte", "razaoSocial", "dataConstituicao", "dataEmissao", "representanteLegal", "cpfRepresentanteLegal"].some(r => keys.includes(r)))
			errors["DADOS_DO_CLIENTE"] = "";

		if (["nomeContato", "contato1", "contato2", "contato3", "email"].some(r => keys.includes(r)))
			errors["CONTATO"] = "";

		if (["cep", "logradouro", "numero", "complemento", "bairro", "referencia", "cidade", "uf"].some(r => keys.includes(r)))
			errors["ENDERECO"] = "";

		if (keys.some(k => k.startsWith("produtoList")))
			errors["PRODUTOS"] = "";

		if (["os", "custcode", "sistemaId", "ordem", "origem", "safra", "dataVenda", "dataAtivacao", "prints",
			"dataAgendamento", "dataInstalacao", "pdv", "reimputado", "vendaOriginal", "brscan", "suporte", "loginVendedor"].some(r => keys.includes(r)))
			errors["DADOS_DO_CONTRATO"] = "";

		if (["formaDePagamento", "vencimento", "agencia", "conta", "banco", "tipoDeConta"].some(r => keys.includes(r)))
			errors["PAGAMENTO"] = "";

		if (["statusId", "relato"].some(r => keys.includes(r)))
			errors["STATUS"] = "";

		if (keys.some(k => k.startsWith("faturaList")))
			errors["FATURAS"] = "";

		return errors;
	}

	postVenda(data) {
		this.setState({calling: true, saving: true});
		api.post(`/venda/`, data)
			.then((response) => {
				this.props.navigate("/vendas/" + response.data.vendaId + "?novo");
			})
			.catch((err) => {
				let errors = err?.response?.data?.errors ?? {};
				errors = this.parseErrors(errors);
				this.openAlert("error", "Falha ao salvar venda!");
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
				errors = this.parseErrors(errors);
				this.openAlert("error", "Falha ao salvar venda!");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	saveVenda() {

		let produtoList = JSON.parse(JSON.stringify(this.state.vendaProdutoList));

		produtoList.forEach(produto => {

			produto.numeroTelefoneFixo = produto.numeroTelefoneFixo.replace(/\D/g, "");

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
			contato1: this.state.contato1.replace(/\D/g, ""),
			contato2: this.state.contato2.replace(/\D/g, ""),
			contato3: this.state.contato3.replace(/\D/g, ""),
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
			sistemaId: this.state.sistemaId,
			ordem: this.state.ordem,
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
			reimputado: this.state.reimputado,
			vendaOriginal: this.state.vendaOriginal,
			brscan: this.state.brscan,
			suporte: this.state.suporte,
			loginVendedor: this.state.loginVendedor,

			//atores

			supervisorId: this.state.supervisorId,
			vendedorId: this.state.vendedorId,
			auditorId: this.state.auditorId,
			cadastradorId: this.state.cadastradorId,
			agenteBiometriaId: this.state.agenteBiometriaId,
			vendedorExterno: this.state.vendedorExterno,
			supervisorExterno: this.state.supervisorExterno,
			auditorExterno: this.state.auditorExterno,
			cadastradorExterno: this.state.cadastradorExterno,
			agenteBiometriaExterno: this.state.agenteBiometriaExterno,

			//pagamento
			formaDePagamento: this.state.formaDePagamento,
			vencimento: this.state.vencimento ?? "",
			agencia: this.state.agencia,
			conta: this.state.conta,
			banco: this.state.banco,
			tipoDeConta: this.state.tipoDeConta,

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

	trashAnexo(anexoId) {
		this.setState({calling: true});
		api.post(`/anexo/trash/${anexoId}`, {}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Anexo enviado para lixeira com sucesso!");
				this.getAnexoListFromApi();
				this.setState({calling: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao enviar anexo para lixeira!");
				this.setState({calling: false, errors: {}});
			})
	}

	untrashAnexo(anexoId) {
		this.setState({calling: true});
		api.post(`/anexo/untrash/${anexoId}`, {}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Anexo restaurado com sucesso!");
				this.getAnexoListFromApi();
				this.setState({calling: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao restaurar para lixeira!");
				this.setState({calling: false, errors: {}});
			})
	}

	deleteAnexo(anexoId) {
		this.setState({calling: true});
		api.delete(`/anexo/delete/${anexoId}`, {redirect403: false})
			.then((response) => {
				this.openAlert("success", "Anexo deletado com sucesso!");
				this.getAnexoListFromApi();
				this.setState({calling: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deletar anexo!");
				this.setState({calling: false, errors: {}});
			})
	}

	render() {

		let ALTERAR_AUDITOR = this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR");

		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: this.props.inlineMode ? 0 : 2, minHeight: "100%", minWidth: this.props.inlineMode ? "400px" : "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "start"}} className="modulePaper">
					{!this.props.inlineMode && <React.Fragment>
						<Typography variant="h3" gutterBottom>
						{this.state.createMode ? "Nova Venda" : "Editar Venda"}
						</Typography>
						<ButtonGroup sx={{marginBottom: 3}}>
								<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate("/vendas")}>Voltar</Button>
								{!this.state.createMode && <LoadingButton color="primary" variant="outlined" size="large" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.updatingVenda} disabled={this.state.calling} onClick={this.getVendaFromApi}>Atualizar</LoadingButton>}
						</ButtonGroup>
					</React.Fragment>}
					<Box display="flex" justifyContent="center" sx={{pb: 3, pr: 3}}>
						{((this.state.createMode || this.state.venda !== null)) ?
							<Grid container spacing={3} sx={{margin: 0}} maxWidth="xl">
								<Grid item xs={12}>
									<Tabs
										value={this.state.tab}
										onChange={(e, newValue) => this.setState({tab: newValue})}
										variant="scrollable"
										scrollButtons
										allowScrollButtonsMobile
										aria-label="scrollable auto tabs example"
									>
										<Tab icon={<Badge color="error" variant="dot" invisible={!("TIPO_DA_VENDA" in this.state.errors)}><DescriptionIcon /></Badge>} value="TIPO_DA_VENDA" label="Tipo da Venda" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("DADOS_DO_CLIENTE" in this.state.errors)}><PersonIcon /></Badge>} value="DADOS_DO_CLIENTE" label="Dados do Cliente" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("CONTATO" in this.state.errors)}><LocalPhoneIcon /></Badge>} value="CONTATO" label="Contato" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("ENDERECO" in this.state.errors)}><PlaceIcon /></Badge>} value="ENDERECO" label="Endereço" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("PRODUTOS" in this.state.errors)}><DescriptionIcon /></Badge>} value="PRODUTOS" label="Produtos" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("DADOS_DO_CONTRATO" in this.state.errors)}><GavelIcon /></Badge>} value="DADOS_DO_CONTRATO" label="Dados do Contrato" />
										<Tab icon={<GroupsIcon />} value="ATORES" label="Atores" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("PAGAMENTO" in this.state.errors)}><PaidIcon /></Badge>} value="PAGAMENTO" label="Pagamento" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("FATURAS" in this.state.errors)}><RequestQuoteIcon /></Badge>} value="FATURAS" label="Faturas" />
										<Tab icon={<ChatIcon />} value="OBSERVACAO" label="Observação" />
										<Tab icon={<Badge color="error" variant="dot" invisible={!("STATUS" in this.state.errors)}><InfoIcon /></Badge>} value="STATUS" label="Status / Salvar" />
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
									{"tipoProduto" in this.state.errors && <Grid item xs={12}><Alert severity="error">selecione uma das opções</Alert></Grid>}
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
									{"tipoPessoa" in this.state.errors && <Grid item xs={12}><Alert severity="error">selecione uma das opções</Alert></Grid>}
								</React.Fragment> : ""}

								{this.state.tab == "DADOS_DO_CLIENTE" ? <React.Fragment>
									{this.state.tipoPessoa == "CPF" && this.state.tipoProduto !== null ? <React.Fragment>
										<Grid item xs={6}>
											<CPFInput
												required
												id="cpf"
												value={this.state.cpf}
												onChange={(e) => this.setState({cpf: e.target.value})}
												fullWidth
												label="CPF"
												variant="outlined"
												disabled={this.state.calling}
												error={"cpf" in this.state.errors}
												helperText={this.state.errors?.cpf ?? ""}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Copiar sem formatação">
																<IconButton
																	onClick={() => navigator.clipboard.writeText(this.state.cpf.replace(/\D/g, "")).then(() => this.openAlert("success", "CPF copiado!")).catch(() => this.openAlert("error", "Falha ao copiar CPF!"))}
																	edge="end"
																>
																	<ContentCopyIcon/>
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
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
														required: true,
														fullWidth: true,
														error: "dataNascimento" in this.state.errors,
														helperText: this.state.errors?.dataNascimento ?? "",
													},
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<FormControl fullWidth required error={"genero" in this.state.errors}>
												<InputLabel>Gênero</InputLabel>
												<Select
													id="genero"
													value={this.state.genero}
													label="Gênero"
													onChange={(e) => this.setState({genero: e.target.value})}
													
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{Object.keys(VendaGeneroEnum).map((genero) => <MenuItem key={genero} value={genero}>{VendaGeneroEnum[genero]}</MenuItem>)}
												</Select>
												<FormHelperText error>{this.state.errors?.genero ?? ""}</FormHelperText>
											</FormControl>
										</Grid>
										<Grid item xs={4}>
											<TextField
												required
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
												required
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
														required: true,
														fullWidth: true,
														error: "rgDataEmissao" in this.state.errors,
														helperText: this.state.errors?.rgDataEmissao ?? "",
													},
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												required
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
												required
												id="cnpj"
												value={this.state.cnpj}
												onChange={(e) => this.setState({cnpj: e.target.value})}
												fullWidth
												label="CNPJ"
												variant="outlined"
												disabled={this.state.calling}
												error={"cnpj" in this.state.errors}
												helperText={this.state.errors?.cnpj ?? ""}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Copiar sem formatação">
																<IconButton
																	onClick={() => navigator.clipboard.writeText(this.state.cnpj.replace(/\D/g, "")).then(() => this.openAlert("success", "CNPJ copiado!")).catch(() => this.openAlert("error", "Falha ao copiar CNPJ!"))}
																	edge="end"
																>
																	<ContentCopyIcon/>
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
												}}
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
													{Object.keys(VendaPorteEnum).map((porte) => <MenuItem key={porte} value={porte}>{VendaPorteEnum[porte]}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={4}>
											<TextField
												required
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
														required: true,
														fullWidth: true,
														error: "dataEmissao" in this.state.errors,
														helperText: this.state.errors?.dataEmissao ?? "",
													},
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
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
												required
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
											required
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
											required
											id="contato1"
											value={this.state.contato1}
											onChange={(e) => this.setState({contato1: e.target.value})}
											fullWidth
											label="Contato 1"
											variant="outlined"
											disabled={this.state.calling}
											error={"contato1" in this.state.errors}
											helperText={this.state.errors?.contato1 ?? ""}
											fixoDinamico
										/>
									</Grid>
									<Grid item xs={4}>
										<PhoneInput
											required
											id="contato2"
											value={this.state.contato2}
											onChange={(e) => this.setState({contato2: e.target.value})}
											fullWidth
											label="Contato 2"
											variant="outlined"
											disabled={this.state.calling}
											error={"contato2" in this.state.errors}
											helperText={this.state.errors?.contato2 ?? ""}
											fixoDinamico
										/>
									</Grid>
									<Grid item xs={4}>
										<PhoneInput
											id="contato3"
											value={this.state.contato3}
											onChange={(e) => this.setState({contato3: e.target.value})}
											fullWidth
											label="Contato 3"
											variant="outlined"
											disabled={this.state.calling}
											error={"contato3" in this.state.errors}
											helperText={this.state.errors?.contato3 ?? ""}
											fixoDinamico
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											required
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
											required
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
											required
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
											required
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
													<ProdutoPaper
														key={i}
														produto={produto}
														i={i}
														errors={this.state.errors}
														calling={this.state.calling}
														updateProduto={this.updateProduto}
														deleteProduto={this.deleteProduto}
														portabilidadeList={produto.portabilidadeList}
														addPortabilidade={this.addPortabilidade}
														updatePortabilidade={this.updatePortabilidade}
														deletePortabilidade={this.deletePortabilidade}
														tipoProduto={this.state.tipoProduto}
														adicionalList={this.state.adicionalList}
													/>
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
											onChange={this.updateOs}
											fullWidth
											label="OS"
											variant="outlined"
											disabled={this.state.calling || !ALTERAR_AUDITOR}
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
											onChange={this.updateCustcode}
											fullWidth
											label="Cust-Code"
											variant="outlined"
											disabled={this.state.calling || !ALTERAR_AUDITOR}
											error={"os" in this.state.errors}
											helperText={this.state.errors?.custcode ?? ""}
											inputProps={{
												maxLength: 50,
											}}
										/>
									</Grid>
									<Grid item xs={4}>
										<FormControl fullWidth required error={"sistemaId" in this.state.errors}>
											<InputLabel>Sistema</InputLabel>
											<Select
												id="sistema"
												value={this.state.sistemaId}
												label="Sistema"
												onChange={this.updateSistemaId}
											>
												<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
												{(this.state.sistemaList ?? []).map((sistema) => <MenuItem key={sistema.sistemaId} value={sistema.sistemaId}>{sistema.nome}</MenuItem>)}
											</Select>
											<FormHelperText error>{this.state.errors?.sistemaId ?? ""}</FormHelperText>
										</FormControl>
									</Grid>
									<Grid item xs={3}>
										<TextField
											id="ordem"
											value={this.state.ordem}
											onChange={this.updateOrdem}
											fullWidth
											label="Ordem"
											variant="outlined"
											disabled={this.state.calling || !ALTERAR_AUDITOR}
											error={"ordem" in this.state.errors}
											helperText={this.state.errors?.ordem ?? ""}
											inputProps={{
												maxLength: 50,
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<Autocomplete
											id="origem"
											freeSolo
											disableClearable
											options={(this.state.origemList ?? []).map(origem => origem.nome)}
											value={this.state.origem}
											onInputChange={this.updateOrigem}
											renderInput={(params) => (
												<TextField
													{...params}
													required
													variant="outlined"
													label="Mailing/Origem"
													error={"origem" in this.state.errors}
													helperText={this.state.errors?.origem ?? ""}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={3}>
										<DatePicker
											label="Safra"
											views={['month', 'year']}
											value={this.state.safra}
											onChange={this.updateSafra}
											slotProps={{
												field: { clearable: true },
												textField: {
													required: true,
													fullWidth: true,
													error: "safra" in this.state.errors,
													helperText: this.state.errors?.safra ?? "",
												},
											}}
										/>
									</Grid>
									<Grid item xs={3}>
										<FormControl fullWidth disabled={this.state.calling  || !ALTERAR_AUDITOR}>
											<InputLabel>Reimputado</InputLabel>
											<Select
												value={this.state.reimputado}
												label="Reimputado"
												onChange={this.updateReimputado}
												>
												{Object.keys(VendaReimputadoEnum).map((reimputado) => <MenuItem key={reimputado} value={reimputado}>{VendaReimputadoEnum[reimputado]}</MenuItem>)}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={this.state.tipoProduto == "MOVEL" ? 3 : 4}>
										<DateTimePicker
											label="Data da Venda"
											value={this.state.dataVenda}
											onChange={this.updateDataVenda}
											slotProps={{
												required: !this.state.createMode,
												field: { clearable: true },
												textField: {
													required: true,
													fullWidth: true,
													error: "dataVenda" in this.state.errors,
													helperText: this.state.errors?.dataVenda ?? (this.state.createMode ? (this.state.dataVenda == null ? "agora" : "outra data") : ""),
												},
											}}
										/>
									</Grid>
									{this.state.tipoProduto == "MOVEL" ? <React.Fragment>
										<Grid item xs={3}>
											<Autocomplete
												id="pdv"
												freeSolo
												disableClearable
												options={(this.state.pontoDeVendaList ?? []).map(pontoDeVenda => pontoDeVenda.nome)}
												value={this.state.pdv}
												onInputChange={this.updatePdv}
												renderInput={(params) => (
													<TextField
														{...params}
														required
														variant="outlined"
														label="PDV"
														error={"pdv" in this.state.errors}
														helperText={this.state.errors?.pdv ?? ""}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={3}>
											<DateTimePicker
													label="Data da Ativação"
													value={this.state.dataAtivacao}
													onChange={this.updateDataAtivacao}
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
										<Grid item xs={3}>
											<FormControl>
												<FormLabel id="prints">Prints</FormLabel>
												<RadioGroup
													row
													aria-labelledby="prints"
													name="controlled-radio-buttons-group"
													value={this.state.prints}
													onChange={this.updatePrints}
												>
												<FormControlLabel value={true} control={<Radio />} label="Sim" />
												<FormControlLabel value={false} control={<Radio />} label="Não" />
												</RadioGroup>
											</FormControl>
										</Grid>
									</React.Fragment> : <React.Fragment>
										<Grid item xs={4}>
											<DateTimePicker
													label="Data de Agendamento"
													value={this.state.dataAgendamento}
													onChange={this.updateDataAgendamento}
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
										<Grid item xs={4}>
											<DateTimePicker
													label="Data de Instalação"
													value={this.state.dataInstalacao}
													onChange={this.updateDataInstalacao}
													slotProps={{
														field: { clearable: true },
														textField: {
															fullWidth: true,
															error: "dataInstalacao" in this.state.errors,
															helperText: this.state.errors?.dataInstalacao ?? "",
														},
													}}
													disabled={this.state.calling  || !ALTERAR_AUDITOR}
												/>
										</Grid>
										<Grid item xs={3}>
											<Autocomplete
												id="pdv"
												freeSolo
												disableClearable
												options={(this.state.pontoDeVendaList ?? []).map(pontoDeVenda => pontoDeVenda.nome)}
												value={this.state.pdv}
												onInputChange={this.updatePdv}
												renderInput={(params) => (
													<TextField
														{...params}
														required
														variant="outlined"
														label="PDV"
														error={"pdv" in this.state.errors}
														helperText={this.state.errors?.pdv ?? ""}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={3}>
											<FormControl disabled={this.state.calling  || !ALTERAR_AUDITOR}>
												<FormLabel id="venda-original">Venda Original</FormLabel>
												<RadioGroup
													row
													aria-labelledby="venda-original"
													name="controlled-radio-buttons-group"
													value={this.state.vendaOriginal}
													onChange={this.updateVendaOriginal}
												>
												<FormControlLabel value={true} control={<Radio />} label="Sim" />
												<FormControlLabel value={false} control={<Radio />} label="Não" />
												</RadioGroup>
											</FormControl>
										</Grid>
										<Grid item xs={3}>
											<FormControl fullWidth disabled={this.state.calling  || !ALTERAR_AUDITOR}>
												<InputLabel>Biometria</InputLabel>
												<Select
													value={this.state.brscan}
													label="Biometria"
													onChange={this.updateBrscan}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{Object.keys(VendaBrscanEnum).map((brscan) => <MenuItem key={brscan} value={brscan}>{VendaBrscanEnum[brscan]}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={3}>
											<FormControl fullWidth disabled={this.state.calling  || !ALTERAR_AUDITOR}>
												<InputLabel>Suporte</InputLabel>
												<Select
													value={this.state.suporte}
													label="Suporte"
													onChange={this.updateSuporte}
													>
													{Object.keys(VendaSuporteEnum).map((suporte) => <MenuItem key={suporte} value={suporte}>{VendaSuporteEnum[suporte]}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12}>
											<TextField
												id="login-vendedor"
												value={this.state.loginVendedor}
												onChange={this.updateLoginVendedor}
												fullWidth
												label="Login Vendedor"
												variant="outlined"
												disabled={this.state.calling  || !ALTERAR_AUDITOR}
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
									<Grid item xs={12}>
										<Divider><Chip icon={<HubIcon />} label="Interno" /></Divider>
									</Grid>
										<Grid item xs={2.4}>
											<Stack spacing={3} justifyContent="start" height="100%">
												<Typography align="center">Vendedor</Typography>
												<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[this.state.vendedorId]} color={this.state.vendedorId ? "primary" : "default"}/>
												{this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR") || this.state.createMode ? <Autocomplete
													id="vendedor"
													options={this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR") ? (Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))) : (this.state.vendedorList?.map(vendedor => vendedor.usuarioId) ?? [])}
													getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
													renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
																<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
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
													loading={this.state.usuarioList == null || this.state.vendedorList == null}
												/> : ""}
											</Stack>
										</Grid>
										<Grid item xs={2.4}>
											<Stack spacing={3} justifyContent="start" height="100%">
												<Typography align="center">Supervisor</Typography>
												<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[this.state.supervisorId]} color={this.state.supervisorId ? "primary" : "default"}/>
												{this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR") ? <Autocomplete
													id="supervisor"
													options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
													getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
													renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
																<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
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
										<Grid item xs={2.4}>
											<Stack spacing={3} justifyContent="start" height="100%">
												<Typography align="center">Auditor</Typography>
												<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[this.state.auditorId]} color={this.state.auditorId ? "primary" : "default"}/>
												{this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR") ? <Autocomplete
													id="auditor"
													options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
													getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
													renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
																<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
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
										<Grid item xs={2.4}>
											<Stack spacing={3} justifyContent="start" height="100%">
												<Typography align="center">Cadastrador</Typography>
												<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[this.state.cadastradorId]} color={this.state.cadastradorId ? "primary" : "default"}/>
												{this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR") ? <Autocomplete
													id="cadastrador"
													options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
													getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
													renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
																<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
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
										<Grid item xs={2.4}>
											<Stack spacing={3} justifyContent="start" height="100%">
												<Typography align="center">Agente Biometria</Typography>
												<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[this.state.agenteBiometriaId]} color={this.state.agenteBiometriaId ? "primary" : "default"}/>
												{this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR") ? <Autocomplete
													id="agente-biometria"
													options={Object.keys(this.state.usuarioByUsuarioId ?? {}).map(key => parseInt(key))}
													getOptionLabel={(option) => this.state.usuarioByUsuarioId?.[option]?.nome}
													renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
																<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
															</Box>}
													value={this.state.agenteBiometriaId}
													onChange={(event, value) => this.setState({agenteBiometriaId: value})}
													renderInput={(params) => (
														<TextField
														{...params}
														variant="outlined"
														label="Agente Biometria"
														/>
													)}
													loading={this.state.usuarioList == null}
												/> : ""}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Divider><Chip icon={<PublicIcon />} label="Externo" /></Divider>
										</Grid>
										<Grid item xs={2.4}>
											<TextField
												id="vendedor-externo"
												value={this.state.vendedorExterno}
												onChange={(e) => this.setState({vendedorExterno: e.target.value})}
												fullWidth
												label="Vendedor Externo"
												variant="outlined"
												disabled={this.state.calling || (!this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR") && !this.state.createMode)}
												error={"vendedorExterno" in this.state.errors}
												helperText={this.state.errors?.vendedorExterno ?? ""}
												inputProps={{
													maxLength: 100,
												}}
											/>
										</Grid>
										<Grid item xs={2.4}>
											<TextField
												id="supervisor-externo"
												value={this.state.supervisorExterno}
												onChange={(e) => this.setState({supervisorExterno: e.target.value})}
												fullWidth
												label="Supervisor Externo"
												variant="outlined"
												disabled={this.state.calling || !this.props.usuario.permissaoList.includes("ALTERAR_VENDEDOR")}
												error={"supervisorExterno" in this.state.errors}
												helperText={this.state.errors?.supervisorExterno ?? ""}
												inputProps={{
													maxLength: 100,
												}}
											/>
										</Grid>
										<Grid item xs={2.4}>
											<TextField
												id="auditor-externo"
												value={this.state.auditorExterno}
												onChange={(e) => this.setState({auditorExterno: e.target.value})}
												fullWidth
												label="Auditor Externo"
												variant="outlined"
												disabled={this.state.calling || !this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR")}
												error={"auditorExterno" in this.state.errors}
												helperText={this.state.errors?.auditorExterno ?? ""}
												inputProps={{
													maxLength: 100,
												}}
											/>
										</Grid>
										<Grid item xs={2.4}>
											<TextField
												id="cadastrador-externo"
												value={this.state.cadastradorExterno}
												onChange={(e) => this.setState({cadastradorExterno: e.target.value})}
												fullWidth
												label="Cadastrador Externo"
												variant="outlined"
												disabled={this.state.calling || !this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR")}
												error={"cadastradorExterno" in this.state.errors}
												helperText={this.state.errors?.cadastradorExterno ?? ""}
												inputProps={{
													maxLength: 100,
												}}
											/>
										</Grid>
										<Grid item xs={2.4}>
											<TextField
												id="agente-biometria-externo"
												value={this.state.agenteBiometriaExterno}
												onChange={(e) => this.setState({agenteBiometriaExterno: e.target.value})}
												fullWidth
												label="Agente Biometria Externo"
												variant="outlined"
												disabled={this.state.calling || !this.props.usuario.permissaoList.includes("ALTERAR_AUDITOR")}
												error={"agenteBiometriaExterno" in this.state.errors}
												helperText={this.state.errors?.agenteBiometriaExterno ?? ""}
												inputProps={{
													maxLength: 100,
												}}
											/>
										</Grid>
								</React.Fragment> : ""}

								{this.state.tab == "PAGAMENTO" ? <React.Fragment>
									<Grid item xs={12}>
										<FormControl fullWidth required error={"formaDePagamento" in this.state.errors}>
											<InputLabel>Forma de Pagamento</InputLabel>
											<Select
												id="forma-de-pagamento"
												value={this.state.formaDePagamento}
												label="Forma de Pagamento"
												onChange={(e) => this.setState({formaDePagamento: e.target.value})}
												>
												<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
												{Object.keys(VendaFormaDePagamentoEnum).map((formaDePagamento) => <MenuItem key={formaDePagamento} value={formaDePagamento}>{VendaFormaDePagamentoEnum[formaDePagamento]}</MenuItem>)}
											</Select>
											<FormHelperText error>{this.state.errors?.formaDePagamento ?? ""}</FormHelperText>
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
													required
													variant="outlined"
													label="Vencimento"
													error={"vencimento" in this.state.errors}
													helperText={this.state.errors?.vencimento ?? ""}
													type="number"
												/>
											)}
										/>
									</Grid>
									{this.state.formaDePagamento == "DEBITO_AUTOMATICO" ? <React.Fragment>
										<Grid item xs={3}>
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
										<Grid item xs={3}>
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
										<Grid item xs={3}>
											<FormControl fullWidth>
												<InputLabel>Tipo de Conta</InputLabel>
												<Select
													id="tipoDeConta"
													value={this.state.tipoDeConta}
													label="Tipo de Conta"
													onChange={(e) => this.setState({tipoDeConta: e.target.value})}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{Object.keys(VendaTipoDeContaEnum).map((tipo) => <MenuItem key={tipo} value={tipo}>{VendaTipoDeContaEnum[tipo]}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={3}>
											<Autocomplete
												id="banco"
												freeSolo
												disableClearable
												options={(this.state.bancoList ?? []).map(banco => banco.nome)}
												value={this.state.banco}
												onInputChange={(event, value) => this.setState({banco: value})}
												renderInput={(params) => (
													<TextField
														{...params}
														variant="outlined"
														label="Banco"
														error={"banco" in this.state.errors}
														helperText={this.state.errors?.banco ?? ""}
													/>
												)}
											/>
										</Grid>
									</React.Fragment> : ""}
								</React.Fragment> : ""}

								{this.state.tab == "FATURAS" ? <React.Fragment>
									<Grid item xs={12}>
										<Box display="flex" flexDirection="column" gap={3}>
											{this.state.faturaList.length == 0 ? <Alert severity="info">As faturas que você adicionar aparecerão aqui.</Alert> :
												this.state.faturaList.map((fatura, i) =>
													<FaturaPaper
														key={i}
														fatura={fatura}
														i={i}
														errors={this.state.errors}
														calling={this.state.calling}
														updateFatura={this.updateFatura}
														deleteFatura={this.deleteFatura}
														ALTERAR_AUDITOR={ALTERAR_AUDITOR}
													/>
												)
											}
										</Box>
									</Grid>
									<Grid item xs={12} container display="flex" justifyContent="flex-end">
										<Button variant="contained" size="large" startIcon={<AddIcon />} onClick={this.addFatura} disabled={this.state.calling || !ALTERAR_AUDITOR} >Adicionar Fatura</Button>
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
												groupBy={(option) => VendaStatusCategoriaEnum?.[this.state.vendaStatusByVendaStatusId?.[option]?.categoria] ?? "Sem Categoria"}
												getOptionLabel={(option) => this.state.vendaStatusByVendaStatusId?.[option]?.nome ?? ""}
												value={this.state.novoStatusId}
												onChange={(event, value) => this.setState({novoStatusId: value})}
												renderInput={(params) => (
													<TextField
														required
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
											required={!this.state.createMode}
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
												<LoadingButton component="label" variant="outlined" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.updatingAnexoList} disabled={this.state.updatingAnexoList || this.state.calling} onClick={this.getAnexoListFromApi}>
													Atualizar
												</LoadingButton>
												<LoadingButton component="label" variant="contained" startIcon={<CloudUploadIcon />} loadingPosition="start" loading={this.state.uploadingAnexo} disabled={this.state.updatingAnexoList || this.state.calling}>
													Adicionar Anexo
													<input type="file" id="anexo" hidden onChange={this.handleUploadAnexoChange}/>
												</LoadingButton>
											</ButtonGroup>
										</Grid>
										<Grid item xs={12}>
											{(this.state?.anexoList ?? []).length == 0 ? <Alert severity="info">Os anexos que você adicionar aparecerão aqui.</Alert> : ""}
											<Stack direction="row" gap={1} flexWrap="wrap">
												{(this.state?.anexoList ?? []).map((anexo) =>
													!anexo.trashed && <Tooltip key={anexo.id} title={anexo.thumbnailLink ? <img width="200px" src={anexo.thumbnailLink}/> : "Pré-visualização indisponível"} arrow><Chip
														component="a"
														clickable
														target="_blank"
														label={anexo.name}
														href={api.defaults.baseURL + "/anexo/download/" + anexo.id}
														deleteIcon={<DeleteIcon/>}
														onDelete={(e) => {e.preventDefault();this.trashAnexo(anexo.id)}}
														disabled={this.state.calling}
														color="primary"
													/></Tooltip>)}
											</Stack>
										</Grid>
										{this.props.usuario.permissaoList.includes("VER_LIXEIRA") && <React.Fragment>
												<Grid item xs={12}>
													<Divider><Chip icon={<RecyclingIcon />} label="Lixeira" /></Divider>
												</Grid>
												<Grid item xs={12}><Alert severity="warning">Os itens da lixeira serão excluídos definitivamente após 30 dias</Alert></Grid>
												<Grid item xs={12}>
													<Stack direction="row" gap={1} flexWrap="wrap">
														{(this.state?.anexoList ?? []).map((anexo) =>
														anexo.trashed && <Tooltip key={anexo.id} title={anexo.thumbnailLink ? <img width="200px" src={anexo.thumbnailLink}/> : "Pré-visualização indisponível"} arrow><Chip
															component="a"
															clickable
															target="_blank"
															label={anexo.name}
															deleteIcon={<DeleteForeverIcon/>}
															onClick={(e) => {e.preventDefault();this.untrashAnexo(anexo.id)}}
															onDelete={(e) => {e.preventDefault();this.deleteAnexo(anexo.id)}}
															disabled={this.state.calling}
															color="error"
														/></Tooltip>)}
													</Stack>
												</Grid>
											</React.Fragment>
										}
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
							: ""}
						</Box>
				</Paper>
				{!this.props.inlineMode ? <Snackbar open={this.state.alertOpen} onClose={(e, reason) => (reason !== "clickaway") ? this.closeAlert() : ""} anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
					<div>{this.state.alert}</div>
				</Snackbar> : <Collapse in={this.state.alertOpen} sx={{marginTop: 3}}>
						{this.state.alert}
					</Collapse>}
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