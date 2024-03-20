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
					setTimeout(this.getUsuarioFromApi, 3000);
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
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "900px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Box sx={{ flexGrow: 1 }}>
						{JSON.stringify(this.state.equipe)}
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
	return <MinhaEquipeModule params={params} location={location} navigate={navigate} {...props}/>
}