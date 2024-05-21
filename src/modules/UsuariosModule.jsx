import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium, GridToolbar } from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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
import Avatar from '@mui/material/Avatar';

import UsuarioDisplayStack from "../components/UsuarioDisplayStack";

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class UsuariosModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuarioList: null,

			usuarioRows: [],
			usuarioSelected: null,

			calling: false,

			alertOpen: false,
			alert: null
		}

		this.columns = [
			//{ field: 'usuarioId', headerName: 'ID', minWidth: 100, flex: 1},
			{ field: 'usuario', headerName: 'Nome', valueGetter: (value, row) => value?.nome, minWidth: 100, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={params.row.usuario}/>},
			{ field: 'matricula', headerName: 'Matrícula', minWidth: 100, flex: 1 },
			{ field: 'email', headerName: 'Email', minWidth: 100, flex: 1 },
			{ field: 'equipe', headerName: 'Equipe', valueGetter: (value, row) => value?.nome, minWidth: 200, flex: 1 },
			{ field: 'departamento', headerName: 'Departamento', minWidth: 100, flex: 1 },
			{ field: 'cargo', headerName: 'Cargo', minWidth: 100, flex: 1 },
			{ field: 'papel', headerName: 'Papel', valueGetter: (value, row) => value.nome, minWidth: 200, flex: 1, renderCell: (params) => 
				<Chip label={params.row.papel.nome} variant="outlined" />
			},
			{ field: 'ativo', headerName: 'Status', valueGetter: (value, row) => value ? "Ativo" : "Inativo", width: 100, renderCell: (params) =>
				<Chip label={params.value} color={params.row.ativo ? "success" : "error"} /> },
			{ field: "actions", headerName: "Ações", width: 300, renderHeaderFilter: () => "", renderCell: (params) => <Stack direction="row" spacing={1}>
				<Tooltip title="Editar" onClick={() => this.props.navigate("/usuarios/" + params.row.usuarioId)}>
					<IconButton color="warning">
						<EditIcon />
					</IconButton>
				</Tooltip>
				
				{params.row.ativo ?
					<Tooltip title="Desativar">
						<span>
							<IconButton color="error" onClick={() => this.setUsuarioAtivo(params.row.usuarioId, !params.row.ativo)} disabled={params.row.usuarioId == this.props.usuario.usuarioId}>
								<PersonOffIcon />
							</IconButton>
						</span>
					</Tooltip> :
					<Tooltip title="Ativar" onClick={() => this.setUsuarioAtivo(params.row.usuarioId, !params.row.ativo)}>
						<IconButton color="success">
							<PersonIcon />
						</IconButton>
					</Tooltip>
				}
			</Stack>}
		];

		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.handleUsuarioSelected = this.handleUsuarioSelected.bind(this);
		this.setUsuarioAtivo = this.setUsuarioAtivo.bind(this);
		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getUsuarioListFromApi();
	}

	getUsuarioListFromApi() {
		this.setState({calling: true})
		api.get("/usuario/me/usuario-list")
			.then((response) => {
				let usuarioRows = response.data.map((usuario) => {return {
					id: usuario.usuarioId,
					usuario: usuario,
					usuarioId: usuario.usuarioId,
					matricula: usuario.matricula,
					email: usuario.email,
					papel: usuario.papel,
					departamento: usuario.departamento !== null ? usuario.departamento.nome : "",
					cargo: usuario.cargo !== null ? usuario.cargo.nome : "",
					equipe: usuario.equipe,
					ativo: usuario.ativo
				}})
				this.setState({usuarioList: response.data, usuarioRows: usuarioRows, calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getUsuarioListFromApi, 3000);
			});
	}

	handleUsuarioSelected(row) {
		let usuarioSelected = null;
		if (row.length > 0) 
			usuarioSelected = this.state.usuarioList.filter((usuario) => usuario.usuarioId == row[0])[0];
		this.setState({usuarioSelected: usuarioSelected})
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	setUsuarioAtivo(usuarioId, ativo) {
		api.patch(`/usuario/${usuarioId}`, {ativo: ativo})
			.then((response) => {
				this.openAlert("success", `Usuário ${usuarioId} ${ativo ? "ativado" : "desativado"} com sucesso!`);
				this.getUsuarioListFromApi();
			})
			.catch((err) => {
				this.openAlert("error", `Falha ao ${ativo ? "ativar" : "desativar"} usuário!`);
			})
			.finally(() => {
				this.setState({calling: false});
			});
	}

	render() {
		return (
			<React.Fragment>
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					Usuários
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="contained" size="large" startIcon={<PersonAddIcon />} onClick={() => this.props.navigate("/usuarios/novo")}>Novo Usuário</Button>
					</ButtonGroup>
					<Box sx={{ flexGrow: 1 }}>
						<DataGridPremium
							rows={this.state.usuarioRows}
							columns={this.columns}
							disableRowSelectionOnClick
							autoHeight
							initialState={{
							    pagination: { paginationModel: { pageSize: 10 } },
							  }}
							pageSizeOptions={[10, 30, 50, 100]}
							onRowSelectionModelChange={this.handleUsuarioSelected}
							loading={this.state.usuarioList == null || this.state.calling}
							sx={{marginBottom: 3}}
							headerFilters
							disableAggregation
							slots={{
								toolbar: GridToolbar,
								headerFilterMenu: null,
							}}
							disableColumnFilter
						/>
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
	return <UsuariosModule params={params} location={location} navigate={navigate} {...props}/>
}