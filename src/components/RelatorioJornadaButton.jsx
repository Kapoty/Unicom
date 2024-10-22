import React from "react";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import DescriptionIcon from '@mui/icons-material/Description';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import api from "../services/api";

import {DurationInput, durationToSeconds, secondsToDuration} from "./DurationInput";

import RelatorioJornadaBox from "./RelatorioJornadaBox";

export default class RelatorioJornadaButton extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			numeroCorrecoesNaoAprovadas: 0,
		}

		this.getNumeroCorrecoesNaoAprovadas = this.getNumeroCorrecoesNaoAprovadas.bind(this);

	}

	componentDidMount() {
		this.getNumeroCorrecoesNaoAprovadas();
	}

	getNumeroCorrecoesNaoAprovadas() {
		api.get("/registro-jornada/" + this.props.usuarioId + "/numero-correcoes-nao-aprovadas", {redirect403: false})
			.then((response) => {
				this.setState({numeroCorrecoesNaoAprovadas: response.data});
			})
			.catch((err) => {
				if (err?.response?.status != 400 && err?.response?.status != 403)
					setTimeout(this.getNumeroCorrecoesNaoAprovadas, 3000);
			});
	}

	render() {
	
		return (
			<React.Fragment>
				{this.props.me ?
				<MenuItem onClick={() => this.setState({dialogOpen: true})}>
					<ListItemIcon>
						<Badge color="warning" badgeContent={this.state.numeroCorrecoesNaoAprovadas}>
							<EventNoteIcon fontSize="small"/>
						</Badge>
					</ListItemIcon>
						Folha de Ponto
		        </MenuItem> : !this.props.iconButton ?
				<Badge color="warning" badgeContent={this.state.numeroCorrecoesNaoAprovadas} sx={{width: 1}}>
					<Button variant="contained" startIcon={<EventNoteIcon />} onClick={() => this.setState({dialogOpen: true})} fullWidth>
						Folha de Ponto
					</Button>
				</Badge>	:
				<Tooltip title="Folha de Ponto" onClick={() => this.setState({dialogOpen: true})}>
					<IconButton color="success">
						<Badge color="warning" badgeContent={this.state.numeroCorrecoesNaoAprovadas}>
							<EventNoteIcon />
						</Badge>
					</IconButton>
				</Tooltip>
				}
				{this.state.dialogOpen ? 
					<Dialog
						fullWidth={true}
	        			maxWidth={"xl"}
						onClose={() => this.setState({dialogOpen: false})}
						open={this.state.dialogOpen}
						sx={{
							"& .MuiDialog-paper": {
								height: "100%"
							}
						}}
					>
	      				<DialogTitle>Folha de Ponto</DialogTitle>
	      				<IconButton
							onClick={() => this.setState({dialogOpen: false})}
							sx={{
								position: 'absolute',
									right: 8,
								top: 8,
								color: (theme) => theme.palette.grey[500],
							}}
						>
						<CloseIcon />
						</IconButton>
	      				<DialogContent dividers>
	      					<RelatorioJornadaBox usuario={this.props.usuario} usuarioId={this.props.usuarioId} me={this.props.me}/>
						</DialogContent>
					</Dialog> : ""}
		    </React.Fragment>
		  );
	}

}