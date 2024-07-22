import React from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';

import UsuarioDisplayChip from "../components/UsuarioDisplayChip";
import CustomDataGridPremium from "../components/CustomDataGridPremium";
import UploadImage from '../components/UploadImage';

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class EquipesModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			equipeList: null,

			equipeRows: [],

			calling: false,

			alertOpen: false,
			alert: null
		}

		this.columns = [
			{ field: 'nome', headerName: 'Nome', minWidth: 200},
			{ field: 'supervisor', headerName: 'Supervisor', valueGetter: (value, row) => value?.nome, minWidth: 200, renderCell: (params) => <UsuarioDisplayChip usuario={params.row.supervisor}/>},
			{ field: 'gerente', headerName: 'Gerente', valueGetter: (value, row) => value?.nome, minWidth: 200, renderCell: (params) => <UsuarioDisplayChip usuario={params.row.gerente}/>},
			{ field: 'icon', headerName: 'Ícone (MUI)', minWidth: 150, renderCell: (params) => <Icon>{params.value}</Icon>},
			{ field: 'iconFilename', headerName: 'Ícone (Upload)', minWidth: 150, renderCell: (params) => params.value ? <UploadImage filename={params.value} style={{width: 24, height: 24}}/> : ""},
			{ field: "actions", headerName: "Ações", minWidth: 100, renderHeaderFilter: () => "", renderCell: (params) => <Stack direction="row" spacing={1}>
				<Tooltip title="Editar" onClick={() => this.props.navigate("/equipes/" + params.row.equipeId)}>
					<IconButton color="warning">
						<EditIcon />
					</IconButton>
				</Tooltip>
			</Stack>}
		];

		this.getEquipeListFromApi = this.getEquipeListFromApi.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getEquipeListFromApi();
	}

	getEquipeListFromApi() {
		this.setState({calling: true})
		api.get("/empresa/me/equipe")
			.then((response) => {
				let equipeRows = response.data.map((equipe) => {return {
					id: equipe.equipeId,
					equipeId: equipe.equipeId,
					nome: equipe.nome,
					supervisor: equipe.supervisor,
					gerente: equipe.gerente,
					icon: equipe.icon,
					iconFilename: equipe.iconFilename,
				}})
				this.setState({equipeList: response.data, equipeRows: equipeRows, calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getEquipeListFromApi, 3000);
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
				<Paper elevation={0} sx={{flexGrow: 1, padding: 2, minHeight: "100%", minWidth: "800px", boxSizing: "border-box", display: "flex", flexDirection: "column", aligmItems: "center", justifyContent: "start"}} className="modulePaper">
					<Stack direction="row" gap={3} alignItems="center">
						<Typography variant="h3" gutterBottom>
						Equipes
						</Typography>
						<ButtonGroup sx={{marginBottom: 3}}>
								<Button variant="contained" size="large" startIcon={<GroupAddIcon />} onClick={() => this.props.navigate("/equipes/novo")}>Nova Equipe</Button>
						</ButtonGroup>
					</Stack>
					<Box sx={{ flexGrow: 1, height: "1px", minHeight: "400px" }}>
						<CustomDataGridPremium
							rows={this.state.equipeRows}
							columns={this.columns}
							disableRowSelectionOnClick
							initialState={{
							    pagination: { paginationModel: { pageSize: 10 } },
							  }}
							pageSizeOptions={[10, 30, 50, 100]}
							loading={this.state.equipeList == null || this.state.calling}
							sx={{marginBottom: 1}}
							pagination
							headerFilters
							disableAggregation
							slots={{
								headerFilterMenu: null,
							}}
							disableColumnFilter
							pinnedColumns={{ left: ['nome'], right: ['actions'] }}
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
	return <EquipesModule params={params} location={location} navigate={navigate} {...props}/>
}