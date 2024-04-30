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
			usuarioByUsuarioId: null,

			anexoList: null,

			nome: "",

			saving: false,
			calling: false,
			updatingAnexoList: false,
			uploadingAnexo: false,
			deletingAnexo: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getVendaFromApi = this.getVendaFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.getAnexoListFromApi = this.getAnexoListFromApi.bind(this);

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
					nome: venda.nome,
					calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getVendaFromApi, 3000);
			});
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
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Nova Venda" : "Editar Venda"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
							<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveVenda}>Salvar</LoadingButton>
					</ButtonGroup>
					<Box sx={{ flexGrow: 1 }}>
						{((!this.state.createMode && this.state.venda == null) ||
							this.state.usuarioList == null
							) ? <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box> :
									<form onSubmit={(e) => e.preventDefault()} disabled={this.state.createMode && this.state.venda == null}>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<Divider><Chip icon={<PersonIcon />} label="Dados do Cliente" /></Divider>
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
													helperText={"nome" in this.state.errors ? this.state.errors["nome"] : ""}
												/>
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
											</React.Fragment> : ""}
										</Grid>
									</form>
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