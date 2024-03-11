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
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';

import api from "../services/api";

import { useParams, useLocation } from 'react-router-dom';

class UsuariosModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuarioList: null,
			usuarioRows: [],
			usuarioSelected: null,
			calling: false,
		}

		this.columns = [
			{ field: 'usuarioId', headerName: 'ID', minWidth: 100, flex: 1 },
			{ field: 'nome', headerName: 'Nome', minWidth: 200, flex: 1 },
			{ field: 'matricula', headerName: 'Matrícula', minWidth: 200, flex: 1 },
			{ field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
			{ field: 'papelList', headerName: 'Cargos', minWidth: 300, flex: 1, renderCell: (params) => 
				<Stack direction="row" spacing={1}>
					{params.value.map(papel=> <Chip key={papel} label={papel} variant="outlined" />)}
				</Stack>
			},
			{ field: 'ativo', headerName: 'Status', width: 100, renderCell: (params) =>
				<Chip label={params.value ? "Ativo" : "Inativo"} color={params.value ? "success" : "error"} /> },
			{ field: "actions", headerName: "Ações", width: 300, renderCell: (params) => <Stack direction="row" spacing={1}>
				<Tooltip title="Editar">
					<IconButton color="warning">
						<EditIcon />
					</IconButton>
				</Tooltip>
				
				{params.row.ativo ?
					<Tooltip title="Desativar">
						<IconButton color="error">
							<PersonOffIcon />
						</IconButton>
					</Tooltip> :
					<Tooltip title="Ativar">
						<IconButton color="success">
							<PersonIcon />
						</IconButton>
					</Tooltip>
				}
			</Stack>}
		];

		this.getUsuarioListFromApi = this.getUsuarioListFromApi.bind(this);
		this.handleUsuarioSelected = this.handleUsuarioSelected.bind(this);
	}

	componentDidMount() {
		this.getUsuarioListFromApi();
	}

	getUsuarioListFromApi() {
		api.get("/empresa/me/usuario")
			.then((response) => {
				let usuarioRows = response.data.map((usuario) => {return {
					id: usuario.usuarioId,
					usuarioId: usuario.usuarioId,
					nome: usuario.nome,
					matricula: usuario.matricula,
					email: usuario.email,
					papelList: usuario.papelList.map(papel => papel.nome),
					ativo: usuario.ativo
				}})
				this.setState({usuarioList: response.data, usuarioRows: usuarioRows});
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

	render() {
		return (
			<React.Fragment>
				<Paper elevation={3} sx={{flexGrow: 1, padding: 5, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}}>
					<Typography variant="h3" gutterBottom>
					Usuários
					</Typography>
					<ButtonGroup sx={{marginBottom: 3}}>
							<Button variant="contained" size="large" startIcon={<PersonAddIcon />}>Adicionar Novo Usuário</Button>
					</ButtonGroup>
					<Box>
						<DataGrid
							rows={this.state.usuarioRows}
							columns={this.columns}
							disableColumnFilter
							disableColumnMenu
							disableColumnSelector
							editMode="row"
							autoHeight
							onRowSelectionModelChange={this.handleUsuarioSelected}
							loading={this.state.usuarioList == null || this.state.usuarioSelected !== null}
							sx={{marginBottom: 3}}
						/>
					</Box>
					{/*this.state.usuarioSelected !== null ? <ButtonGroup variant="outlined">
						<Button>Editar</Button>
						{this.state.usuarioSelected.usuarioId != this.props.usuario.usuarioId ? <LoadingButton
				          endIcon={<CheckBoxIcon />}
				          loading={true}
				          loadingPosition="end"
				          variant="outlined"
				        >Desativar</LoadingButton>: ""}
					</ButtonGroup> : ""*/}
				</Paper>
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const params = useParams();
	const location = useLocation()
	return <UsuariosModule params={params} location={location} {...props}/>
}