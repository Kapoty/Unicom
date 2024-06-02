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
import CustomDataGridPremium from "../components/CustomDataGridPremium";

const AlterarJornadaButton = React.lazy(() => import('../components/AlterarJornadaButton'));
const RelatorioJornadaButton = React.lazy(() => import('../components/RelatorioJornadaButton'));

import api from "../services/api";

import dayjs from 'dayjs';

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
			{ field: 'usuario', headerName: 'Nome', valueGetter: (value, row) => value?.nome, minWidth: 200, flex: 1, renderCell: (params) => <UsuarioDisplayStack usuario={params.row.usuario}/>},
			{ field: 'nomeCompleto', headerName: 'Nome Completo', minWidth: 200, flex: 1 },
			{ field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
			{ field: 'papel', headerName: 'Papel', valueGetter: (value, row) => value.nome, minWidth: 200, flex: 1, renderCell: (params) => 
				<Chip label={params.row.papel.nome} variant="outlined" />
			},
			{ field: 'matricula', headerName: 'Matrícula', minWidth: 100, flex: 1 },
			{ field: 'departamento', headerName: 'Departamento', minWidth: 200, flex: 1 },
			{ field: 'cargo', headerName: 'Cargo', minWidth: 200, flex: 1 },
			{ field: 'equipe', headerName: 'Equipe', valueGetter: (value, row) => value?.nome, minWidth: 200, flex: 1 },
			{ field: 'contrato', headerName: 'Contrato', valueGetter: (value, row) => value?.nome, minWidth: 200, flex: 1 },
			{ field: 'cpf', headerName: 'CPF', minWidth: 200, flex: 1 },
			{ field: 'telefoneCelular', headerName: 'Telefone Celular', minWidth: 200, flex: 1 },
			{ field: 'whatsapp', headerName: 'Whatsapp', minWidth: 200, flex: 1 },
			{ field: 'dataNascimento', headerName: 'Data de Nascimento', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L') : "" },
			{ field: 'dataContratacao', headerName: 'Data Contratação', minWidth: 200, flex: 1, type: 'date', renderCell: (params) => params.value !== null ? dayjs(params.value).format('L') : "" },
			{ field: 'jornadaStatusGrupo', headerName: 'Grupo de Status', valueGetter: (value, row) => value?.nome, minWidth: 200, flex: 1 },
			{ field: 'ativo', headerName: 'Status', valueGetter: (value, row) => value ? "Ativo" : "Inativo", width: 100, renderCell: (params) =>
				<Chip label={params.value} color={params.row.ativo ? "success" : "error"} /> },
			{ field: "actions", headerName: "Ações", width: 250, type: "actions", renderCell: (params) => <Stack direction="row" spacing={1}>
				<Tooltip title="Editar" onClick={() => this.props.navigate("/usuarios/" + params.row.usuarioId)}>
					<IconButton color="warning">
						<EditIcon />
					</IconButton>
				</Tooltip>
				<AlterarJornadaButton usuario={this.props.usuario} usuarioId={params.row.usuarioId} iconButton/>
				<RelatorioJornadaButton usuario={this.props.usuario} usuarioId={params.row.usuarioId} me={false} iconButton/>
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
					nomeCompleto: usuario.nomeCompleto,
					email: usuario.email,
					papel: usuario.papel,
					matricula: usuario.matricula,
					departamento: usuario.departamento?.nome,
					cargo: usuario.cargo?.nome,
					equipe: usuario.equipe,
					contrato: usuario.contrato,
					cpf: usuario.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
					telefoneCelular: usuario.telefoneCelular?.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4"),
					whatsapp: usuario.whatsapp?.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4"),
					dataNascimento: usuario.dataNascimento !== null ? new Date(usuario.dataNascimento) : null,
					dataContratacao: usuario.dataContratacao !== null ? new Date(usuario.dataContratacao) : null,
					jornadaStatusGrupo: usuario.jornadaStatusGrupo,
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
				<Paper elevation={0} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Typography variant="h3" gutterBottom>
					Usuários
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="contained" size="large" startIcon={<PersonAddIcon />} onClick={() => this.props.navigate("/usuarios/novo")}>Novo Usuário</Button>
					</ButtonGroup>
					<Box sx={{ flexGrow: 1 }}>
						<CustomDataGridPremium
							rows={this.state.usuarioRows}
							columns={this.columns}
							initialState={{
							    pagination: { paginationModel: { pageSize: 50 } },
							    columns: {
							    	/*columnVisibilityModel: {
							    		contrato: false,
							    		cpf: false,
							    		telefoneCelular: false,
							    		telefoneWhatsapp: false,
							    		dataContratacao: false,
							    		dataNascimento: false,
							    		jornadaStatusGrupo: false,
							    	}*/
								},
								pinnedColumns: { left: ['usuario'], right: ['actions'] }
							  }}
							pageSizeOptions={[10, 30, 50, 100]}
							onRowSelectionModelChange={this.handleUsuarioSelected}
							loading={this.state.usuarioList == null || this.state.calling}
							sx={{marginBottom: 3, height: 1000}}
							pagination
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