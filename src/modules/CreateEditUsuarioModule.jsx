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
import { DatePicker } from '@mui/x-date-pickers-pro';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EmailIcon from '@mui/icons-material/Email';
import NumbersIcon from '@mui/icons-material/Numbers';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { TimePicker } from '@mui/x-date-pickers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import CPFInput from "../components/CPFInput";
import PhoneInput from "../components/PhoneInput";
import UsuarioAvatar from "../components/UsuarioAvatar";

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

class CreateEditUsuarioModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,

			usuario: null,
			papelList: null,
			papelByPapelId: null,
			cargoList: null,
			cargoByCargoId: null,
			contratoList: null,
			contratoByContratoId: null,
			departamentoList: null,
			departamentoByDepartamentoId: null,
			equipeList: null,
			equipeListByEquipeId: null,
			jornadaStatusGrupoList: null,
			jornadaStatusGrupoById: null,

			usuarioId: "",
			nome: "",
			nomeCompleto: "",
			email: "",
			matricula: "",
			senha: "",
			confirmaSenha: "",
			ativo: true,
			papelId: null,
			dataNascimento: null,
			cpf: "",
			telefoneCelular: "",
			whatsapp: "",
			dataContratacao: null,
			cargoId: null,
			contratoId: null,
			departamentoId: null,
			jornadaStatusGrupoId: null,

			showSenha: false,

			saving: false,
			savingFotoPerfil: false,
			deletingFotoPerfil: false,
			calling: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getUsuarioFromApi = this.getUsuarioFromApi.bind(this);
		this.getPapelListFromApi = this.getPapelListFromApi.bind(this);
		this.getCargoListFromApi = this.getCargoListFromApi.bind(this);
		this.getContratoListFromApi = this.getContratoListFromApi.bind(this);
		this.getDepartamentoListFromApi = this.getDepartamentoListFromApi.bind(this);
		this.getEquipeListFromApi = this.getEquipeListFromApi.bind(this);
		this.getJornadaStatusGrupoListFromApi = this.getJornadaStatusGrupoListFromApi.bind(this);

		this.saveUsuario = this.saveUsuario.bind(this);
		this.patchUsuario = this.patchUsuario.bind(this);
		this.postUsuario = this.postUsuario.bind(this);
		this.setUsuarioIdFromParams = this.setUsuarioIdFromParams.bind(this);
		this.deleteUsuarioFotoPerfil = this.deleteUsuarioFotoPerfil.bind(this);
		this.handleUsuarioFotoChange = this.handleUsuarioFotoChange.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setUsuarioIdFromParams();
		this.getPapelListFromApi();
		this.getCargoListFromApi();
		this.getContratoListFromApi();
		this.getDepartamentoListFromApi();
		this.getEquipeListFromApi();
		this.getJornadaStatusGrupoListFromApi();
		if (this.props.searchParams.get("novo") !== null) {
			this.openAlert("success", 'Usuário criado com sucesso!');
		}
	}

	setUsuarioIdFromParams() {
		let paramsUsuarioId = parseInt(this.props.params.usuarioId);
		if (!isNaN(paramsUsuarioId))
			this.setState({createMode: false, usuarioId: paramsUsuarioId}, () => this.getUsuarioFromApi());
		else
			this.setState({createMode: true});
	}


	getUsuarioFromApi() {
		this.setState({calling: true})
		api.get("/usuario/" + this.state.usuarioId)
			.then((response) => {
				let usuario = response.data;
				this.setState({
					usuario: usuario,
					nome: usuario.nome,
					nomeCompleto: usuario.nomeCompleto,
					email: usuario.email,
					matricula: usuario.matricula,
					ativo: usuario.ativo,
					papelId: usuario.papelId,
					errors: {},
					senha: "",
					confirmaSenha: "",
					dataNascimento: usuario.dataNascimento,
					cpf: usuario.cpf !==null ? usuario.cpf : "",
					telefoneCelular: usuario.telefoneCelular !==null ? usuario.telefoneCelular : "",
					whatsapp: usuario.whatsapp !==null ? usuario.whatsapp : "",
					dataContratacao: usuario.dataContratacao,
					cargoId: usuario.cargoId,
					contratoId: usuario.contratoId,
					departamentoId: usuario.departamentoId,
					equipeId: usuario.equipeId,
					jornadaStatusGrupoId: usuario.jornadaStatusGrupoId,
					calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getUsuarioFromApi, 3000);
			});
	}

	getPapelListFromApi() {
		api.get("/usuario/me/papel-list")
			.then((response) => {
				let papelList = response.data;
				let papelByPapelId = {};
				papelList.forEach((papel) => papelByPapelId[papel.papelId] = papel);
				this.setState({papelList: papelList, papelByPapelId: papelByPapelId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getPapelListFromApi, 3000);
			});
	}

	getCargoListFromApi() {
		api.get("/empresa/me/cargo")
			.then((response) => {
				let cargoList = response.data;
				let cargoByCargoId = {};
				cargoList.forEach((cargo) => cargoByCargoId[cargo.cargoId] = cargo);
				this.setState({cargoList: cargoList, cargoByCargoId: cargoByCargoId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getCargoListFromApi, 3000);
			});
	}

	getContratoListFromApi() {
		api.get("/empresa/me/contrato")
			.then((response) => {
				let contratoList = response.data;
				let contratoByContratoId = {};
				contratoList.forEach((contrato) => contratoByContratoId[contrato.contratoId] = contrato);
				this.setState({contratoList: contratoList, contratoByContratoId: contratoByContratoId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getContratoListFromApi, 3000);
			});
	}

	getDepartamentoListFromApi() {
		api.get("/empresa/me/departamento")
			.then((response) => {
				let departamentoList = response.data;
				let departamentoByDepartamentoId = {};
				departamentoList.forEach((departamento) => departamentoByDepartamentoId[departamento.departamentoId] = departamento);
				this.setState({departamentoList: departamentoList, departamentoByDepartamentoId: departamentoByDepartamentoId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getDepartamentoListFromApi, 3000);
			});
	}

	getEquipeListFromApi() {
		api.get("/usuario/me/minha-equipe")
			.then((response) => {
				let equipeList = response.data;
				let equipeByEquipeId = {};
				equipeList.forEach((equipe) => equipeByEquipeId[equipe.equipeId] = equipe);
				this.setState({equipeList: equipeList, equipeByEquipeId: equipeByEquipeId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getEquipeListFromApi, 3000);
			});
	}

	getJornadaStatusGrupoListFromApi() {
		api.get("/empresa/me/jornada-status-grupo")
			.then((response) => {
				let jornadaStatusGrupoList = response.data;
				let jornadaStatusGrupoById = {};
				jornadaStatusGrupoList.forEach((jornadaStatusGrupo) => jornadaStatusGrupoById[jornadaStatusGrupo.jornadaStatusGrupoId] = jornadaStatusGrupo);
				this.setState({jornadaStatusGrupoList: jornadaStatusGrupoList, jornadaStatusGrupoById: jornadaStatusGrupoById});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getJornadaStatusGrupoListFromApi, 3000);
			});
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	postUsuario(data) {
		this.setState({calling: true, saving: true});
		api.post(`/usuario/`, data)
			.then((response) => {
				this.props.navigate("/usuarios/" + response.data.usuarioId + "?novo");
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao criar usuário!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	patchUsuario(data) {
		this.setState({calling: true, saving: true});
		api.patch(`/usuario/${this.state.usuarioId}`, data)
			.then((response) => {
				this.openAlert("success", `Usuário salvo com sucesso!`);
				this.getUsuarioFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar usuário!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	saveUsuario() {

		let data = {
			nome: this.state.nome,
			nomeCompleto: this.state.nomeCompleto,
			email: this.state.email,
			matricula: this.state.matricula,
			ativo: this.state.ativo,
			papelId: this.state.papelId,
			dataNascimento: this.state.dataNascimento,
			cpf: this.state.cpf != "" ? this.state.cpf.replace(/\D/g, "") : null,
			telefoneCelular:  this.state.telefoneCelular != "" ? this.state.telefoneCelular.replace(/\D/g, "") : null,
			whatsapp:  this.state.whatsapp != "" ? this.state.whatsapp.replace(/\D/g, "") : null,
			dataContratacao: this.state.dataContratacao,
			cargoId: this.state.cargoId,
			contratoId: this.state.contratoId,
			departamentoId: this.state.departamentoId,
			equipeId: this.state.equipeId,
			jornadaStatusGrupoId: this.state.jornadaStatusGrupoId,
		};

		if (this.state.senha != "") {
			if (this.state.senha == this.state.confirmaSenha)
				data["senha"] = this.state.senha;
			else {
				this.setState({errors: {"senha": "as senhas não conferem", "confirmaSenha": ""}});
				return;
			}
		}

		if (this.state.createMode)
			this.postUsuario(data);
		else
			this.patchUsuario(data);
	}

	deleteUsuarioFotoPerfil() {
		this.setState({calling: true, deletingUsuarioFotoPerfil: true});
		api.delete(`/usuario/${this.state.usuario.usuarioId}/foto-perfil`)
			.then((response) => {
				this.openAlert("success", "Foto deletada com sucesso!");
				this.getUsuarioFromApi();
				this.setState({calling: false, deletingUsuarioFotoPerfil: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deletar foto!");
				this.setState({calling: false, deletingUsuarioFotoPerfil: false, errors: {}});
			})
	}

	handleUsuarioFotoChange(event) {
		this.setState({calling: true, savingFotoPerfil: true});
		let formData = new FormData();
		formData.append('file', event.target.files[0]);
		let config = {
			headers: {
			'content-type': 'multipart/form-data',
			},
		};

		api.post(`/usuario/${this.state.usuario.usuarioId}/foto-perfil`, formData, config)
			.then((response) => {
				this.openAlert("success", "Foto salva com sucesso!");
				this.getUsuarioFromApi();
				this.setState({calling: false, savingFotoPerfil: false, errors: {}});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao salvar foto!");
				this.setState({calling: false, savingFotoPerfil: false, errors: {}});
			})

		event.target.value = "";
	}

	render() {
		console.log("CreateEditUsuarioModule was rendered at", new Date().toLocaleTimeString());
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Novo Usuário" : "Editar Usuário"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
							<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveUsuario}>Salvar</LoadingButton>
					</ButtonGroup>
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 3}}>
						{((!this.state.createMode && this.state.usuario == null) ||
							this.state.papelList == null ||
							this.state.cargoList == null ||
							this.state.contratoList == null ||
							this.state.departamentoList == null ||
							this.state.equipeList == null ||
							this.state.jornadaStatusGrupoList == null
							) ? <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box> :
						<Grid container spacing={3} sx={{margin: 0}} maxWidth="xl">
							<Grid item xs>
								<Stack gap={1} justifyContent="center" alignItems="center">
									{!this.state.createMode ? <React.Fragment>
										<UsuarioAvatar variant="square" sx={{ width: "128px", height: "128px"}} usuario={this.state.usuario} />
										<LoadingButton component="label" variant="contained" sx={{width: "128px"}} startIcon={<CloudUploadIcon />} loadingPosition="start" loading={this.state.savingFotoPerfil} disabled={this.state.calling}>
										Upload
										<input type="file" accept="image/jpeg" id="foto-perfil" hidden onChange={this.handleUsuarioFotoChange}/>
										</LoadingButton>
										{this.state.usuario.fotoPerfil ? <LoadingButton variant="contained" sx={{width: "128px"}} startIcon={<DeleteIcon />} color="error" loadingPosition="start" loading={this.state.deletingFotoPerfil} onClick={this.deleteUsuarioFotoPerfil}>Remover</LoadingButton> : ""}
									</React.Fragment> : <Avatar variant="square" sx={{ width: "128px", height: "128px"}} >{this.state.nome.charAt(0)}</Avatar>}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Divider><Chip icon={<PersonIcon />} label="Informações Pessoais" /></Divider>
							</Grid>
							<Grid item xs={12}>
								<form onSubmit={(e) => e.preventDefault()} disabled={this.state.createMode && this.state.usuario == null}>
									<Grid container spacing={3}>
										<Grid item xs={4}>
											<TextField
												id="nome"
												value={this.state.nome}
												onChange={(e) => this.setState({nome: e.target.value})}
												fullWidth
												label="Nome"
												required
												InputProps={{
													maxLength: 200,
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"nome" in this.state.errors}
												helperText={"nome" in this.state.errors ? this.state.errors["nome"] : ""}
											/>
										</Grid>
										<Grid item xs={8}>
											<TextField
												id="nome-completo"
												value={this.state.nomeCompleto}
												onChange={(e) => this.setState({nomeCompleto: e.target.value})}
												fullWidth
												label="Nome Completo"
												required
												InputProps={{
													maxLength: 200,
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"nomeCompleto" in this.state.errors}
												helperText={"nomeCompleto" in this.state.errors ? this.state.errors["nomeCompleto"] : ""}
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
												InputProps={{
													maxLength: 256,
													startAdornment: (
														<InputAdornment position="start">
															<EmailIcon />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"email" in this.state.errors}
												helperText={"email" in this.state.errors ? this.state.errors["email"] : ""}
											/>
										</Grid>
										<Grid item xs={6}>
											<Autocomplete
												id="papel"
												options={Object.keys(this.state.papelByPapelId).map(key => parseInt(key))}
												getOptionLabel={(option) => this.state.papelByPapelId[option].nome}
												value={this.state.papelId}
												onChange={(event, value) => this.setState({papelId: value})}
												renderInput={(params) => (
													<TextField
													error={"papelId" in this.state.errors}
													helperText={this.state.errors?.papelId}
														{...params}
												variant="outlined"
												label="Papel"
												/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												id="matricula"
												value={this.state.matricula}
												onChange={(e) => this.setState({matricula: e.target.value})}
												fullWidth
												label="Matrícula"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<NumbersIcon />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"matricula" in this.state.errors}
												helperText={"matricula" in this.state.errors ? this.state.errors["matricula"] : ""}
												type="number"
											/>
										</Grid>
										<Grid item xs={4}>
											<CPFInput
												id="cpf"
												value={this.state.cpf}
												onChange={(e) => this.setState({cpf: e.target.value})}
												fullWidth
												label="CPF"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"cpf" in this.state.errors}
												helperText={"cpf" in this.state.errors ? this.state.errors["cpf"] : ""}
											/>
										</Grid>
										<Grid item xs={4}>
											<PhoneInput
												id="telefone-celular"
												value={this.state.telefoneCelular}
												onChange={(e) => this.setState({telefoneCelular: e.target.value})}
												fullWidth
												label="Telefone Celular"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<SmartphoneIcon />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"telefoneCelular" in this.state.errors}
												helperText={"telefoneCelular" in this.state.errors ? this.state.errors["telefoneCelular"] : ""}
											/>
										</Grid>
										<Grid item xs={4}>
											<PhoneInput
												id="whatsapp"
												value={this.state.whatsapp}
												onChange={(e) => this.setState({whatsapp: e.target.value})}
												fullWidth
												label="Whatsapp"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<WhatsAppIcon />
														</InputAdornment>
													)
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"whatsapp" in this.state.errors}
												helperText={"whatsapp" in this.state.errors ? this.state.errors["whatsapp"] : ""}
											/>
										</Grid>
										<Grid item xs={6}>
											<DatePicker
												id="data-nascimento"
												value={this.state.dataNascimento !== null ? dayjs(this.state.dataNascimento) : null}
												onChange={(newValue) => this.setState({dataNascimento: newValue})}
												label="Data de Nascimento"
												slotProps={{
													field: { clearable: true },
													textField: {
														fullWidth: true,
														error: "dataNascimento" in this.state.errors,
														helperText: "dataNascimento" in this.state.errors ? this.state.errors["dataNascimento"] : ""
													},
												}}
												disableFuture
												variant="outlined"
												disabled={this.state.calling}
											/>
										</Grid>
										<Grid item xs={6}>
											<DatePicker
												id="data-contratacao"
												value={this.state.dataContratacao !== null ? dayjs(this.state.dataContratacao) : null}
												onChange={(newValue) => this.setState({dataContratacao: newValue})}
												label="Data Contratação"
												slotProps={{
													field: { clearable: true },
													textField: {
														fullWidth: true,
														error: "dataContratacao" in this.state.errors,
														helperText: "dataContratacao" in this.state.errors ? this.state.errors["dataContratacao"] : ""
													},
												}}
												disableFuture
												variant="outlined"
												disabled={this.state.calling}
											/>
										</Grid>
										<Grid item xs={4}>
											<FormControl fullWidth>
												<InputLabel>Departamento</InputLabel>
												<Select
													id="departamento"
													value={this.state.departamentoId}
													label="Departamento"
													onChange={(e) => this.setState({departamentoId: e.target.value})}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{this.state.departamentoList.map((departamento) => <MenuItem key={departamento.departamentoId} value={departamento.departamentoId}>{departamento.nome}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={4}>
											<FormControl fullWidth>
												<InputLabel>Cargo</InputLabel>
												<Select
													id="cargo"
													value={this.state.cargoId}
													label="Cargo"
													onChange={(e) => this.setState({cargoId: e.target.value})}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{this.state.cargoList.map((cargo) => <MenuItem key={cargo.cargoId} value={cargo.cargoId}>{cargo.nome}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={4}>
											<FormControl fullWidth>
												<InputLabel>Equipe</InputLabel>
												<Select
													id="equipe"
													value={this.state.equipeId}
													label="Departamento"
													onChange={(e) => this.setState({equipeId: e.target.value})}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{this.state.equipeList.map((equipe) => <MenuItem key={equipe.equipeId} value={equipe.equipeId}>{equipe.nome}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={2}>
											<FormControl fullWidth>
												<InputLabel>Contrato</InputLabel>
												<Select
													id="contrato"
													value={this.state.contratoId}
													label="Contrato"
													onChange={(e) => this.setState({contratoId: e.target.value})}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{this.state.contratoList.map((contrato) => <MenuItem key={contrato.contratoId} value={contrato.contratoId}>{contrato.nome}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12}>
											<Divider><Chip icon={<CalendarMonthIcon />} label="Folha de Ponto" /></Divider>
										</Grid>
										<Grid item xs={12}>
											<FormControl fullWidth>
												<InputLabel>Grupo de Status</InputLabel>
												<Select
													id="jornada-status-grupo"
													value={this.state.jornadaStatusGrupoId}
													label="Grupo de Status"
													onChange={(e) => this.setState({jornadaStatusGrupoId: e.target.value})}
													>
													<MenuItem key={"nenhum"} value={null}>Nenhum</MenuItem>
													{this.state.jornadaStatusGrupoList.map((jornadaStatusGrupo) => <MenuItem key={jornadaStatusGrupo.jornadaStatusGrupoId} value={jornadaStatusGrupo.jornadaStatusGrupoId}>{jornadaStatusGrupo.nome}</MenuItem>)}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12}>
											<Divider><Chip icon={<KeyIcon />} label="Acesso" /></Divider>
										</Grid>
										<Grid item xs={4}>
											<TextField
												id="senha"
												value={this.state.senha}
												type={this.state.showSenha ? 'text' : 'password'}
												onChange={(e) => this.setState({senha: e.target.value})}
												fullWidth
												label="Senha"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<KeyIcon />
														</InputAdornment>
													),
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																aria-label="toggle password visibility"
																onClick={() => this.setState({showSenha: !this.state.showSenha})}
																edge="end"
															>
																{this.state.showSenha ? <VisibilityOff /> : <Visibility />}
															</IconButton>
														</InputAdornment>
													),
													autoComplete: 'new-password'
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"senha" in this.state.errors}
												helperText={"senha" in this.state.errors ? this.state.errors["senha"] : ""}
											/>
										</Grid>
										<Grid item xs={4}>
											<TextField
												id="confirma-senha"
												value={this.state.confirmaSenha}
												type={this.state.showSenha ? 'text' : 'password'}
												onChange={(e) => this.setState({confirmaSenha: e.target.value})}
												fullWidth
												label="Confirmar Senha"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<KeyIcon />
														</InputAdornment>
													),
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																aria-label="toggle password visibility"
																onClick={() => this.setState({showSenha: !this.state.showSenha})}
																edge="end"
															>
																{this.state.showSenha ? <VisibilityOff /> : <Visibility />}
															</IconButton>
														</InputAdornment>
													),
													autoComplete: 'new-password'
												}}
												variant="outlined"
												disabled={this.state.calling}
												error={"confirmaSenha" in this.state.errors}
												helperText={"confirmaSenha" in this.state.errors ? this.state.errors["confirmaSenha"] : ""}
											/>
										</Grid>
										<Grid item xs={4}>
											<FormControl component="fieldset" variant="standard">
												<FormLabel component="legend">Ativo</FormLabel>
												<FormGroup>
			      									<FormControlLabel control={<Switch checked={this.state.ativo} onChange={(e) => this.setState({ativo: e.target.checked})}/>} />
			      								</FormGroup>
			      							</FormControl>
										</Grid>
									</Grid>
								</form>
							</Grid>
						</Grid>}
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
	return <CreateEditUsuarioModule params={params} location={location} navigate={navigate} searchParams={searchParams} {...props}/>
}