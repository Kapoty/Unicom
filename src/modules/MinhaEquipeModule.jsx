import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
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

const JornadaChip = React.lazy(() => import('../components/JornadaChip'));
const AlterarJornadaButton = React.lazy(() => import('../components/AlterarJornadaButton'));
const RelatorioJornadaButton = React.lazy(() => import('../components/RelatorioJornadaButton'));

import {isAuth, getToken, setToken, removeToken} from "../utils/pontoAuth"

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class MinhaEquipeModule extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			equipeId: null,
			equipe: null,

			calling: false,

			alertOpen: false,
			alert: null
		}

		this.getEquipeFromApi = this.getEquipeFromApi.bind(this);

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
		this.setState({calling: true})
		api.get("/minha-equipe/" + this.state.equipeId)
			.then((response) => {
				this.setState({equipe: response.data, calling: false});
			})
			.catch((err) => {
				console.log(err);
				if (err.response.status == 404)
					this.props.navigate("/")
				else
					setTimeout(this.getEquipeFromApi, 3000);
			});
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
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					{this.state.equipe !== null ? <React.Fragment>
						<Typography variant="h3" gutterBottom>
							{this.state.equipe.nome}
						</Typography>
						<Box sx={{ flexWrap: "wrap", gap: 3, flexDirection: "row", display: "flex"}}>
							{this.state.equipe.gerente !== null ? <Paper sx={{display: "flex", width: "300px", alignItems: "center", boxSizing: "border-box", flexDirection: "column", padding: 3, gap: 2}}>
								<Avatar variant="square" sx={{ width: "128px", height: "128px"}} src={this.state.equipe.gerente.fotoPerfil ? api.defaults.baseURL + "/usuario/" + this.state.equipe.gerente.usuarioId + "/foto-perfil?versao=" + this.state.equipe.gerente.fotoPerfilVersao : ""}>{this.state.equipe.gerente.nome.charAt(0)}</Avatar>
								<Typography variant="h4">
									{this.state.equipe.gerente.nome}
								</Typography>
								<Chip label="Gerente" color="success" />
							</Paper> : ""}
							{this.state.equipe.supervisor !== null ? <Paper sx={{display: "flex", width: "300px", alignItems: "center", boxSizing: "border-box", flexDirection: "column", padding: 3, gap: 2}}>
								<Avatar variant="square" sx={{ width: "128px", height: "128px"}} src={this.state.equipe.supervisor.fotoPerfil ? api.defaults.baseURL + "/usuario/" + this.state.equipe.supervisor.usuarioId + "/foto-perfil?versao=" + this.state.equipe.supervisor.fotoPerfilVersao : ""}>{this.state.equipe.supervisor.nome.charAt(0)}</Avatar>
								<Typography variant="h4" align="center">
									{this.state.equipe.supervisor.nome}
								</Typography>
								<Chip label="Supervisor" color="success" />
							</Paper> : ""}
							{this.state.equipe.usuarioList.map(usuario =>
								<Paper key={usuario.usuarioId} sx={{display: "flex", width: "300px", alignItems: "center", boxSizing: "border-box", flexDirection: "column", padding: 3, gap: 2}}>
									<Avatar variant="square" sx={{ width: "128px", height: "128px"}} src={usuario.fotoPerfil ? api.defaults.baseURL + "/usuario/" + usuario.usuarioId + "/foto-perfil?versao=" + usuario.fotoPerfilVersao : ""}>{usuario.nome.charAt(0)}</Avatar>
									<Typography variant="h4">
										{usuario.nome}
									</Typography>
									<JornadaChip usuario={this.props.usuario} me={false} usuarioId={usuario.usuarioId}/>
									<AlterarJornadaButton usuario={this.props.usuario} usuarioId={usuario.usuarioId}/>
									<RelatorioJornadaButton usuario={this.props.usuario} usuarioId={usuario.usuarioId} me={false}/>
								</Paper>
							)}
						</Box>
					</React.Fragment> : <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box>}
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
	return <MinhaEquipeModule params={params} location={location} navigate={navigate} {...props}/>
}