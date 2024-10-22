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
import FormHelperText from '@mui/material/FormHelperText';
import { TimePicker } from '@mui/x-date-pickers';
import Icon from '@mui/material/Icon';

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

class CreateEditPontoDeVendaModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,
			pontoDeVendaId: null,

			pontoDeVenda: null,

			nome: "",

			saving: false,
			deletando: false,
			calling: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getPontoDeVendaFromApi = this.getPontoDeVendaFromApi.bind(this);

		this.savePontoDeVenda = this.savePontoDeVenda.bind(this);
		this.patchPontoDeVenda = this.patchPontoDeVenda.bind(this);
		this.postPontoDeVenda = this.postPontoDeVenda.bind(this);
		this.deletePontoDeVenda = this.deletePontoDeVenda.bind(this);
		this.setPontoDeVendaIdFromParams = this.setPontoDeVendaIdFromParams.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setPontoDeVendaIdFromParams();
		if (this.props.searchParams.get("novo") !== null) {
			this.openAlert("success", 'Ponto de Venda criado com sucesso!');
		}
	}

	setPontoDeVendaIdFromParams() {
		let paramsPontoDeVendaId = parseInt(this.props.params.pontoDeVendaId);
		if (!isNaN(paramsPontoDeVendaId))
			this.setState({createMode: false, pontoDeVendaId: paramsPontoDeVendaId}, () => this.getPontoDeVendaFromApi());
		else
			this.setState({createMode: true});
	}


	getPontoDeVendaFromApi() {
		this.setState({calling: true})
		api.get("/ponto-de-venda/" + this.state.pontoDeVendaId)
			.then((response) => {
				let pontoDeVenda = response.data;
				this.setState({
					pontoDeVenda: pontoDeVenda,
					nome: pontoDeVenda.nome,
					icon: pontoDeVenda.icon,
					categoria: pontoDeVenda.categoria,
					cor: pontoDeVenda.cor,
					ordem: pontoDeVenda.ordem,
					calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getPontoDeVendaFromApi, 3000);
			});
	}


	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	postPontoDeVenda(data) {
		this.setState({calling: true, saving: true});
		api.post(`/ponto-de-venda/`, data)
			.then((response) => {
				this.props.navigate("/empresa/ponto-de-venda/" + response.data.pontoDeVendaId + "?novo");
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao criar Ponto de Venda!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	patchPontoDeVenda(data) {
		this.setState({calling: true, saving: true});
		api.patch(`/ponto-de-venda/${this.state.pontoDeVendaId}`, data)
			.then((response) => {
				this.openAlert("success", `Ponto de Venda salvo com sucesso!`);
				this.getPontoDeVendaFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar Ponto de Venda!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	savePontoDeVenda() {

		let data = {
			nome: this.state.nome,
		};

		if (this.state.createMode)
			this.postPontoDeVenda(data);
		else
			this.patchPontoDeVenda(data);
	}

	deletePontoDeVenda() {
		this.setState({calling: true, deletando: true});
		api.delete(`/ponto-de-venda/${this.state.pontoDeVendaId}`)
			.then((response) => {
				this.props.navigate("/empresa/ponto-de-venda/");
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deletar Ponto de Venda!");
				this.setState({calling: false, deletando: false});
			})
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Novo Ponto de Venda" : "Editar Ponto de Venda"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
							<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.savePontoDeVenda}>Salvar</LoadingButton>
							{!this.state.createMode ? <LoadingButton variant="contained" color="error" size="large" startIcon={<DeleteIcon />} loadingPosition="start" loading={this.state.deletando} disabled={this.state.calling} onClick={this.deletePontoDeVenda}>Deletar</LoadingButton> : ""}
					</ButtonGroup>
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 3}}>
						{((!this.state.createMode && this.state.pontoDeVenda == null)
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
												helperText={this.state.errors?.nome ?? ""}
												inputProps={{
													maxLength: 100,
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
	return <CreateEditPontoDeVendaModule params={params} location={location} navigate={navigate} searchParams={searchParams} {...props}/>
}