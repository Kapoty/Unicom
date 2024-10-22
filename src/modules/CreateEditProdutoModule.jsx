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

import VendaTipoProdutoEnum from "../model/VendaTipoProdutoEnum";

import dayjs from 'dayjs';

import api from "../services/api";

import { useParams, useLocation, useNavigate, useHistory, useSearchParams } from 'react-router-dom';

class CreateEditProdutoModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createMode: true,
			produtoId: null,

			produto: null,

			nome: "",
			tipo: "",
			ordem: 1,

			saving: false,
			deletando: false,
			calling: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getProdutoFromApi = this.getProdutoFromApi.bind(this);

		this.saveProduto = this.saveProduto.bind(this);
		this.patchProduto = this.patchProduto.bind(this);
		this.postProduto = this.postProduto.bind(this);
		this.deleteProduto = this.deleteProduto.bind(this);
		this.setProdutoIdFromParams = this.setProdutoIdFromParams.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setProdutoIdFromParams();
		if (this.props.searchParams.get("novo") !== null) {
			this.openAlert("success", 'Produto criado com sucesso!');
		}
	}

	setProdutoIdFromParams() {
		let paramsProdutoId = parseInt(this.props.params.produtoId);
		if (!isNaN(paramsProdutoId))
			this.setState({createMode: false, produtoId: paramsProdutoId}, () => this.getProdutoFromApi());
		else
			this.setState({createMode: true});
	}


	getProdutoFromApi() {
		this.setState({calling: true})
		api.get("/produto/" + this.state.produtoId)
			.then((response) => {
				let produto = response.data;
				this.setState({
					produto: produto,
					nome: produto.nome,
					tipo: produto.tipo,
					ordem: produto.ordem,
					calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getProdutoFromApi, 3000);
			});
	}


	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	postProduto(data) {
		this.setState({calling: true, saving: true});
		api.post(`/produto/`, data)
			.then((response) => {
				this.props.navigate("/empresa/produtos/" + response.data.produtoId + "?novo");
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao criar produto!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	patchProduto(data) {
		this.setState({calling: true, saving: true});
		api.patch(`/produto/${this.state.produtoId}`, data)
			.then((response) => {
				this.openAlert("success", `Produto salvo com sucesso!`);
				this.getProdutoFromApi();
				this.setState({calling: false, saving: false, errors: {}});
			})
			.catch((err) => {
				let errors = {};
				if ("response" in err && "errors" in err.response.data) {
					errors = err.response.data.errors;
					this.openAlert("error", "Falha ao salvar produto!");
				}
				else
					this.openAlert("error", "Erro inesperado");
				this.setState({calling: false, saving: false, errors: errors});
			})
	}

	saveProduto() {

		let data = {
			nome: this.state.nome,
			tipo: this.state.tipo,
			ordem: this.state.ordem,
		};

		if (this.state.createMode)
			this.postProduto(data);
		else
			this.patchProduto(data);
	}

	deleteProduto() {
		this.setState({calling: true, deletando: true});
		api.delete(`/produto/${this.state.produtoId}`)
			.then((response) => {
				this.props.navigate("/empresa/produtos/");
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao deletar produto!");
				this.setState({calling: false, deletando: false});
			})
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					{this.state.createMode ? "Novo Produto" : "Editar Produto"}
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="outlined" size="large" startIcon={<ArrowBackIcon />}  onClick={() => this.props.navigate(-1)}>Voltar</Button>
							<LoadingButton variant="contained" size="large" startIcon={<SaveIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveProduto}>Salvar</LoadingButton>
							{!this.state.createMode ? <LoadingButton variant="contained" color="error" size="large" startIcon={<DeleteIcon />} loadingPosition="start" loading={this.state.deletando} disabled={this.state.calling} onClick={this.deleteProduto}>Deletar</LoadingButton> : ""}
					</ButtonGroup>
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 3}}>
						{((!this.state.createMode && this.state.produto == null)
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
										<Grid item xs={4}>
											<FormControl fullWidth required error={"tipo" in this.state.errors}>
												<InputLabel>Tipo</InputLabel>
												<Select
													value={this.state.tipo}
													label="Tipo"
													onChange={(e) => this.setState({tipo: e.target.value})}
													>
													{Object.keys(VendaTipoProdutoEnum).map((tipo) => <MenuItem key={tipo} value={tipo}>{VendaTipoProdutoEnum[tipo]}</MenuItem>)}
												</Select>
												<FormHelperText error>{this.state.errors?.tipo ?? ""}</FormHelperText>
											</FormControl>
										</Grid>
										<Grid item xs={4}>
											<TextField
												id="ordem"
												value={this.state.ordem}
												onChange={(e) => this.setState({ordem: e.target.value})}
												fullWidth
												label="Ordem"
												required
												variant="outlined"
												disabled={this.state.calling}
												error={"ordem" in this.state.errors}
												helperText={this.state.errors?.ordem ?? ""}
												type="number"
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
	return <CreateEditProdutoModule params={params} location={location} navigate={navigate} searchParams={searchParams} {...props}/>
}