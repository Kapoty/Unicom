import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { green, yellow, blue, red } from '@mui/material/colors';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Tooltip from '@mui/material/Tooltip';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import BadgeIcon from '@mui/icons-material/Badge';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import UsuarioAvatar from "../components/UsuarioAvatar";
import MinhaEquipeInfoPaper from "../components/MinhaEquipeInfoPaper";
import MinhaEquipeUsuarioPaper from "../components/MinhaEquipeUsuarioPaper";
import MinhaEquipeAdicionarButton from "../components/MinhaEquipeAdicionarButton";
import UsuarioDisplayChip from "../components/UsuarioDisplayChip";

import {isAuth, getToken, setToken, removeToken} from "../utils/pontoAuth"

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class MinhaEquipeModule extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			equipeId: null,
			equipe: null,

			usuarioList: null,
			usuarioByUsuarioId: {},

			calling: false,
			refreshing: false,
			adding: false,
			removing: false,

			addUsuarioId: null,
			addUsuarioDialogOpen: false,

			alertOpen: false,
			alert: null
		}

		this.getEquipeFromApi = this.getEquipeFromApi.bind(this);
		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.removeFromEquipe = this.removeFromEquipe.bind(this);
		this.addToEquipe = this.addToEquipe.bind(this);

		this.openAddUsuarioDialog = this.openAddUsuarioDialog.bind(this);
		this.closeAddUsuarioDialog = this.closeAddUsuarioDialog.bind(this);

		this.setEquipeIdFromParams = this.setEquipeIdFromParams.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.setEquipeIdFromParams();
	}

	setEquipeIdFromParams() {
		let paramsEquipeId = parseInt(this.props.params.equipeId);
		if (!isNaN(paramsEquipeId))
			this.setState({equipeId: paramsEquipeId}, () => this.getEquipeFromApi());
		else
			this.props.navigate("/");
	}


	getEquipeFromApi() {
		this.setState({calling: true, refreshing: true})
		api.get("/minha-equipe/" + this.state.equipeId)
			.then((response) => {
				this.setState({equipe: response.data, calling: false, refreshing: false});
			})
			.catch((err) => {
				console.log(err);
				if (err?.response?.status == 404)
					this.props.navigate("/")
				else {
					this.openAlert("error", "Falha ao obter equipe!");
					this.setState({calling: false, refreshing: false});
				}
			});
	}

	getUsuarioListFromApi() {
		api.get("/usuario/me/usuario-list")
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

	removeFromEquipe(usuarioId) {
		this.setState({calling: true, removing: true});
		api.post(`/usuario/${usuarioId}/update-equipe`, {equipeId: null}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", `Usuário removido da equipe com sucesso!`);
				this.getEquipeFromApi();
				this.setState({calling: false, removing: false});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao remover usuário da equipe!");
				this.setState({calling: false, removing: false});
			})
	}

	addToEquipe(usuarioId) {
		this.setState({calling: true, adding: true});
		api.post(`/usuario/${usuarioId}/update-equipe`, {equipeId: this.state.equipe.equipeId}, {redirect403: false})
			.then((response) => {
				this.openAlert("success", `Usuário adicionado à equipe com sucesso!`);
				this.closeAddUsuarioDialog();
				this.setState({calling: false, adding: false});
			})
			.catch((err) => {
				this.openAlert("error", "Falha ao adicionar usuário à equipe!");
				this.setState({calling: false, adding: false});
			})
	}


	openAddUsuarioDialog() {
		this.getUsuarioListFromApi();
		this.setState({
			addUsuarioId: null,
			usuarioList: null,
			usuarioByUsuarioId: {},
			addUsuarioDialogOpen: true,
		});
	}

	closeAddUsuarioDialog() {
		this.getEquipeFromApi();
		this.setState({addUsuarioDialogOpen: false});
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start", gap: 3}} className="modulePaper">
					{this.state.refreshing && <Box width="100%" display="flex" justifyContent="center" mt={3} mb={3}><CircularProgress/></Box>}
					{this.state.equipe && <React.Fragment>
						<Typography variant="h3">
							{this.state.equipe.nome}
						</Typography>
						<Box sx={{ flexWrap: "wrap", gap: 3, flexDirection: "row", display: "flex"}}>
							<MinhaEquipeInfoPaper equipe={this.state.equipe}/>
							{this.state.equipe.usuarioList.map(usuarioEquipe => <MinhaEquipeUsuarioPaper key={usuarioEquipe.usuarioId} usuario={this.props.usuario} usuarioEquipe={usuarioEquipe} onRemove={() => this.removeFromEquipe(usuarioEquipe.usuarioId)}/>
							)}
							<MinhaEquipeAdicionarButton onClick={this.openAddUsuarioDialog}/>
						</Box>
					</React.Fragment>}
				</Paper>
				<Dialog onClose={this.closeAddUsuarioDialog} open={this.state.addUsuarioDialogOpen}>
					<DialogTitle>Adicionar Usuário à Equipe</DialogTitle>
					<DialogContent dividers>
						<Box>
							<Autocomplete
								id="usuario"
								options={Object.keys(this.state.usuarioByUsuarioId).filter(key => this.state.usuarioByUsuarioId[key].equipeId == null).map(key => parseInt(key))}
								getOptionLabel={(option) => this.state.usuarioByUsuarioId[option].nome}
								renderOption={(props, option) => <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option}>
											<UsuarioDisplayChip usuario={this.state.usuarioByUsuarioId?.[option]}/>
										</Box>}
								value={this.state.addUsuarioId}
								onChange={(event, value) => this.setState({addUsuarioId: value})}
								renderInput={(params) => (
									<TextField
									{...params}
								variant="outlined"
								label="Usuário"
								/>
								)}
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button type="button" onClick={this.closeAddUsuarioDialog}>
							Cancelar
						</Button>
						<Button disabled={this.state.calling || !this.state.addUsuarioId} onClick={() => this.addToEquipe(this.state.addUsuarioId)}>
							Adicionar
						</Button>
					</DialogActions>
				</Dialog>
				<Snackbar open={this.state.alertOpen} onClose={(e, reason) => (reason !== "clickaway") ? this.closeAlert() : ""} anchorOrigin={{vertical: "bottom", horizontal: "right"}} autoHideDuration={2000}>
					<div>{this.state.alert}</div>
				</Snackbar>
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	return <MinhaEquipeModule params={params} location={location} navigate={navigate} {...props}/>
}