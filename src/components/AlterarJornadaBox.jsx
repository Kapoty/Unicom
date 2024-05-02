import React from "react";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingButton from '@mui/lab/LoadingButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';

import api from "../services/api";

export default class AlterarJornadaBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			jornadaList: null,
			jornadaByJornadaId: {},

			jornadaSelected: null,

			calling: false,

			alertOpen: false,
			alert: null,

			errors: {},
		}

		this.getJornadaListFromApi = this.getJornadaListFromApi.bind(this);

		this.handleJornadaSelected = this.handleJornadaSelected.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getJornadaListFromApi();
	}

	getJornadaListFromApi() {
		this.setState({calling: true});
		api.post(`/jornada/find-all-by-usuario-id`, {
			usuarioId: this.props.usuarioId
		}, {redirect403: false})
			.then((response) => {
				let jornadaList = response.data;
				let jornadaByJornadaId = {};
				jornadaList.forEach((jornada) => jornadaByJornadaId[jornada.jornadaId] = jornada);
				this.setState({jornadaList: jornadaList, jornadaByJornadaId: jornadaByJornadaId});
				this.setState({
					jornadaList: jornadaList,
					jornadaByJornadaId: jornadaByJornadaId,
					errors: {},
					calling: false,
					});
			})
			.catch((err) => {
				if ("response" in err && err.response.status == 403) {
					this.openAlert("error", "Não permitido!");
					this.setState({jornadaList: null, calling: false});
					return;
				}
				this.openAlert("error", "Falha ao obter jornadas!");
				this.setState({calling: false});
			});
	}

	handleJornadaSelected(jornada) {
		this.setState({jornadaSelected: jornada})
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
	
		return (
			<Box sx={{display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", alignItems: "center"}}>
				<ButtonGroup>
						<LoadingButton component="label" variant="outlined" startIcon={<RefreshIcon />} loadingPosition="start" loading={this.state.calling} disabled={this.state.calling} onClick={this.getJornadaListFromApi}>Atualizar</LoadingButton>
						<LoadingButton variant="contained" color="info" size="large" startIcon={<AddIcon />} loadingPosition="start" loading={this.state.saving} disabled={this.state.calling} onClick={this.saveEquipe}>Nova Jornada</LoadingButton>
						{this.props.usuario.permissaoList.includes("VER_TODAS_EQUIPES") ? <LoadingButton variant="contained" color="warning" size="large" startIcon={<AddIcon />} loadingPosition="start" loading={this.state.deletando} disabled={this.state.calling} onClick={this.deleteEquipe}>Nova Jornada Geral</LoadingButton> : ""}
				</ButtonGroup>
				<Paper sx={{width: "100%", maxHeight: "400px", overflow: "auto"}}>
					<List>
						{(this.state?.jornadaList ?? []).map(jornada =>
							<ListItemButton
								key={jornada.jornadaId}
								selected={this.state.jornadaSelected == jornada.jornadaId}
								onClick={() => this.handleJornadaSelected(jornada)}
								divider
							>
								<Stack gap={1} direction="row" justifyContent="start" alignItems="center">
									<Box sx={{width: 100}}>
										{jornada.usuarioId == null ? <Chip label="GERAL" color="warning" /> : <Chip label="PRÓPRIA" color="info" />}
									</Box>
									<Box sx={{width: 200}}>
										<Typography variant="body" align="center">
											{jornada.nome}
										</Typography>
									</Box>
									<Box sx={{width: 200}}>
										{jornada.entrada != null ? <Stack gap={1} direction="row" justifyContent="start" alignItems="center">
											<Typography variant="caption" color={green[400]} align="center">
												{dayjs(jornada.entrada, "HH:mm:ss").format("HH:mm")}
											</Typography>
											<Typography variant="caption" color={yellow[400]} align="center">
												{dayjs(jornada.intervaloInicio, "HH:mm:ss").format("HH:mm")}
											</Typography>
											<Typography variant="caption" color={blue[400]} align="center">
												{dayjs(jornada.intervaloFim, "HH:mm:ss").format("HH:mm")}
											</Typography>
											<Typography variant="caption" color={red[400]} align="center">
												{dayjs(jornada.saida, "HH:mm:ss").format("HH:mm")}
											</Typography>
										</Stack> : <Chip label="NÃO REGISTRA" color="error" size="small" />}
									</Box>
									<Box sx={{width: 400}}>
										<Chip label="SEG" color={jornada.segunda ? "success" : "grey"} size="small" />
										<Chip label="TER" color={jornada.terca ? "success" : "grey"} size="small" />
										<Chip label="QUA" color={jornada.quarta ? "success" : "grey"} size="small" />
										<Chip label="QUI" color={jornada.quinta ? "success" : "grey"} size="small" />
										<Chip label="SEX" color={jornada.sexta ? "success" : "grey"} size="small" />
										<Chip label="SAB" color={jornada.sabado ? "success" : "grey"} size="small" />
										<Chip label="DOM" color={jornada.domingo ? "success" : "grey"} size="small" />
									</Box>
								</Stack>
							</ListItemButton>
						)}
					</List>
				</Paper>
				{this.state.jornadaSelected == null ? <Alert severity="warning">Selecione uma jornada</Alert> :
					JSON.stringify(this.state.jornadaSelected)}
				<Collapse in={this.state.alertOpen}>
					{this.state.alert}
				</Collapse>
			</Box>
		  );
	}

}