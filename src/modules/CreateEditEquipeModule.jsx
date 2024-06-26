import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
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
import Icon from '@mui/material/Icon';

import UsuarioDisplayChip from "../components/UsuarioDisplayChip";
import UploadImage from '../components/UploadImage';

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

class CreateEditEquipeModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,
			equipeId: null,

			equipe: null,
			usuarioList: null,
			usuarioByUsuarioId: null,

			nome: "",
			supervisorId: null,
			gerenteId: null,
			icon: "",
			iconFilename: "",
			iconFilenameDelayed: "",

			saving: false,
			deletando: false,
			calling: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.updateIconFilenameDelayedTimeout = null;

		this.getEquipeFromApi = this.getEquipeFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);

		this.saveEquipe = this.saveEquipe.bind(this);
		this.patchEquipe = this.patchEquipe.bind(this);
		this.postEquipe = this.postEquipe.bind(this);
		this.deleteEquipe = this.deleteEquipe.bind(this);
		this.setEquipeIdFromParams = this.setEquipeIdFromParams.bind(this);

		this.updateIconFilename = this.updateIconFilename.bind(this);
		this.updateIconFilenameDelayed = this.updateIconFilenameDelayed.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setEquipeIdFromParams();
		this.getUsuarioListFromApi();
		if (this.props.searchParams.get("novo") !== null) {
			this.openAlert("success", 'Equipe criada com sucesso!');
		}
	}

	setEquipeIdFromParams() {
		let paramsEquipeId = parseInt(this.props.params.equipeId);
		if (!isNaN(paramsEquipeId))
			this.setState({createMode: false, equipeId: paramsEquipeId}, () => this.getEquipeFromApi());
		else
			this.setState({createMode: true});
	}


	getEquipeFromApi() {
		this.setState({calling: true})
		api.get("/equipe/" + this.state.equipeId)
			.then((response) => {
				let equipe = response.data;
				this.setState({
					equipe: equipe,
					nome: equipe.nome,
					supervisorId: equipe.supervisorId,
					gerenteId: equipe.gerenteId,
					icon: equipe.icon,
					iconFilename: equipe.iconFilename,
					iconFilenameDelayed: equipe.iconFilename,
					calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getEquipeFromApi, 3000);
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

	postEquipe(data) {
		this.setState({calling: true, saving: true});
		api.post(`/equipe/`, data)
			.then((response) => {
				this.props.navigate("/equipes/" + response.data.equipeId + "?novo");
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao criar equipe!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	patchEquipe(data) {
		this.setState({calling: true, saving: true});
		api.patch(`/equipe/${this.state.equipeId}`, data)
			.then((response) => {
				this.openAlert("success", `Equipe salva com sucesso!`);
				this.getEquipeFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar equipe!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	saveEquipe() {

		let data = {
			nome: this.state.nome,
			supervisorId: this.state.supervisorId,
			gerenteId: this.state.gerenteId,
			icon: this.state.icon !== "" ? this.state.icon : null,
			iconFilename: this.state.iconFilename !== "" ? this.state.iconFilename : null,
		};

		if (this.state.createMode)
			this.postEquipe(data);
		else
			this.patchEquipe(data);
	}

	deleteEquipe() {
		this.setState({calling: true, deletando: true});
		api.delete(`/equipe/${this.state.equipeId}`)
			.then((response) => {
				this.props.navigate("/equipes/");
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deletar equipe!");
				this.setState({calling: false, deletando: false});
			})
	}

	updateIconFilename = (e) => {
		this.setState({iconFilename: e.target.value}, () => {
			if (this.updateIconFilenameDelayedTimeout)
				clearTimeout(this.updateIconFilenameDelayedTimeout);
			this.updateIconFilenameDelayedTimeout = setTimeout(this.updateIconFilenameDelayed, 500);
		});
	}

	updateIconFilenameDelayed = () => {
		this.setState({iconFilenameDelayed: this.state.iconFilename});
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Nova Equipe" : "Editar Equipe"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
							<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveEquipe}>Salvar</LoadingButton>
							{!this.state.createMode ? <LoadingButton variant="contained" color="error" size="large" startIcon={<DeleteIcon />} loadingPosition="start" loading={this.state.deletando} disabled={this.state.calling} onClick={this.deleteEquipe}>Deletar</LoadingButton> : ""}
					</ButtonGroup>
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 3}}>
						{((!this.state.createMode && this.state.equipe == null) ||
							this.state.usuarioList == null
							) ? <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box> :
									<Grid container spacing={3} maxWidth="xl">
										<Grid item xs={4}>
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
										<Grid item xs={4}>
											 <Autocomplete
												id="supervisor"
												options={Object.keys(this.state.usuarioByUsuarioId).map(key => parseInt(key))}
												getOptionLabel={(option) => this.state.usuarioByUsuarioId[option].nome}
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
											/>
										</Grid>
										<Grid item xs={4}>
											 <Autocomplete
												id="gerente"
												options={Object.keys(this.state.usuarioByUsuarioId).map(key => parseInt(key))}
												getOptionLabel={(option) => this.state.usuarioByUsuarioId[option].nome}
												renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
															<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
														</Box>}
												value={this.state.gerenteId}
												onChange={(event, value) => this.setState({gerenteId: value})}
												renderInput={(params) => (
													<TextField
													{...params}
												variant="outlined"
												label="Gerente"
												/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												id="icon"
												value={this.state.icon}
												onChange={(e) => this.setState({icon: e.target.value})}
												fullWidth
												label="Ícone (MUI)"
												variant="outlined"
												disabled={this.state.calling}
												error={"icon" in this.state.errors}
												helperText={"icon" in this.state.errors ? this.state.errors["icon"] : ""}
												InputProps={{
													endAdornment: <InputAdornment position="end"><Icon>{this.state.icon}</Icon></InputAdornment>,
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												id="icon-filename"
												value={this.state.iconFilename}
												onChange={this.updateIconFilename}
												fullWidth
												label="Ícone (Upload)"
												variant="outlined"
												disabled={this.state.calling}
												error={"iconFilename" in this.state.errors}
												helperText={"iconFilename" in this.state.errors ? this.state.errors["iconFilename"] : ""}
												InputProps={{
													endAdornment: <InputAdornment position="end"><Icon>{this.state.iconFilenameDelayed !== "" ? <UploadImage filename={this.state.iconFilenameDelayed} style={{width: 24, height: 24}}/> : ""}</Icon></InputAdornment>,
												}}
											/>
										</Grid>
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
	return <CreateEditEquipeModule params={params} location={location} navigate={navigate} searchParams={searchParams} {...props}/>
}