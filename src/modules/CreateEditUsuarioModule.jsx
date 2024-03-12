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

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

class CreateEditUsuarioModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,

			usuario: null,
			papelList: null,
			papelListByPapelId: null,

			usuarioId: "",
			nome: "",
			email: "",
			matricula: "",
			senha: "",
			confirmaSenha: "",
			ativo: true,
			papelIdList: [],

			showSenha: false,

			saving: false,
			calling: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getUsuarioFromApi = this.getUsuarioFromApi.bind(this);
		this.getPapelListFromApi = this.getPapelListFromApi.bind(this);

		this.saveUsuario = this.saveUsuario.bind(this);
		this.patchUsuario = this.patchUsuario.bind(this);
		this.postUsuario = this.postUsuario.bind(this);
		this.setUsuarioIdFromParams = this.setUsuarioIdFromParams.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setUsuarioIdFromParams();
		this.getPapelListFromApi();
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
					email: usuario.email,
					matricula: usuario.matricula,
					ativo: usuario.ativo,
					papelIdList: usuario.papelList.map(papel => papel.papelId),
					errors: {},
					senha: "",
					confirmaSenha: "",
					calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getUsuarioFromApi, 3000);
			});
	}

	getPapelListFromApi() {
		api.get("/empresa/me/papel")
			.then((response) => {
				let papelList = response.data;
				let papelListByPapelId = {};
				papelList.forEach((papel) => papelListByPapelId[papel.papelId] = papel);
				this.setState({papelList: papelList, papelListByPapelId: papelListByPapelId});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getPapelListFromApi, 3000);
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
			email: this.state.email,
			matricula: this.state.matricula,
			ativo: this.state.ativo,
			papelIdList: this.state.papelIdList,
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

	render() {
		return (
			<React.Fragment>
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}}>
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Novo Usuário" : "Editar Usuário"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
							<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} onClick={this.saveUsuario}>Salvar</LoadingButton>
					</ButtonGroup>
					<Box sx={{ flexGrow: 1 }}>
						{((!this.state.createMode && this.state.usuario == null) || this.state.papelList == null) ? <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box> :
						<form onSubmit={(e) => e.preventDefault()} disabled={this.state.createMode && this.state.usuario == null}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<TextField
										id="nome"
										value={this.state.nome}
										onChange={(e) => this.setState({nome: e.target.value})}
										fullWidth
										label="Nome"
										InputProps={{
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
								<Grid item xs={6}>
									<TextField
										id="email"
										value={this.state.email}
										onChange={(e) => this.setState({email: e.target.value})}
										fullWidth
										label="Email"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<AccountCircle />
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
									{this.state.papelList != null ? <Autocomplete
										multiple
										id="papel-list"
										options={Object.keys(this.state.papelListByPapelId).map(key => parseInt(key))}
										getOptionLabel={(option) => this.state.papelListByPapelId[option].nome}
										value={this.state.papelIdList}
										onChange={(event, value) => this.setState({papelIdList: value})}
										renderInput={(params) => (
											<TextField
											{...params}
										variant="standard"
										label="Cargos"
										/>
										)}
									/> : null}
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
													<AccountCircle />
												</InputAdornment>
											)
										}}
										variant="outlined"
										disabled={this.state.calling}
										error={"matricula" in this.state.errors}
										helperText={"matricula" in this.state.errors ? this.state.errors["matricula"] : ""}
									/>
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
						</form>}
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