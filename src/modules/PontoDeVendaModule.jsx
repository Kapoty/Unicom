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
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';

import CustomDataGridPremium from "../components/CustomDataGridPremium";

import api from "../services/api";

import { useParams, useLocation, useNavigate } from 'react-router-dom';

class PontoDeVendaModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pontoDeVendaList: null,

			pontoDeVendaRows: [],

			calling: false,

			alertOpen: false,
			alert: null
		}

		this.columns = [
			{ field: 'nome', headerName: 'Nome', minWidth: 200 },
			{ field: "actions", headerName: "Ações", minWidth: 100, renderHeaderFilter: () => "", renderCell: (params) => <Stack direction="row" spacing={1}>
				<Tooltip title="Editar" onClick={() => this.props.navigate("/empresa/ponto-de-venda/" + params.row.pontoDeVendaId)}>
					<IconButton color="warning">
						<EditIcon />
					</IconButton>
				</Tooltip>
			</Stack>}
		];

		this.getPontoDeVendaListFromApi = this.getPontoDeVendaListFromApi.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		this.getPontoDeVendaListFromApi();
	}

	getPontoDeVendaListFromApi() {
		this.setState({calling: true})
		api.get("/empresa/me/ponto-de-venda")
			.then((response) => {
				let pontoDeVendaRows = response.data.map((pontoDeVenda) => {return {
					id: pontoDeVenda.pontoDeVendaId,
					pontoDeVendaId: pontoDeVenda.pontoDeVendaId,
					nome: pontoDeVenda.nome,
				}})
				this.setState({pontoDeVendaList: response.data, pontoDeVendaRows: pontoDeVendaRows, calling: false});
			})
			.catch((err) => {
				console.log(err);
				setTimeout(this.getPontoDeVendaListFromApi, 3000);
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
						Ponto de Venda
						</Typography>
						<ButtonGroup sx={{marginBottom: 3}}>
								<Button variant="contained" size="large" startIcon={<NoteAddIcon />} onClick={() => this.props.navigate("/empresa/ponto-de-venda/novo")}>Novo Ponto de Venda</Button>
						</ButtonGroup>
					</Stack>
					<Box sx={{ flexGrow: 1, height: "1px", minHeight: "400px" }}>
						<CustomDataGridPremium
							rows={this.state.pontoDeVendaRows}
							columns={this.columns}
							disableRowSelectionOnClick
							initialState={{
							    pagination: { paginationModel: { pageSize: 50 } },
							    sorting: {
									sortModel: [{ field: 'nome', sort: 'asc' }],
								}
							  }}
							pageSizeOptions={[10, 30, 50, 100]}
							loading={this.state.pontoDeVendaList == null || this.state.calling}
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
	return <PontoDeVendaModule params={params} location={location} navigate={navigate} {...props}/>
}