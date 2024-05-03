import React from "react";

import { grey, green, yellow, blue, red } from '@mui/material/colors';

import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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

import AlterarJornadaBox from "./AlterarJornadaBox";

import dayjs from 'dayjs';

import api from "../services/api";

export default class AlterarJornadaButton extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
		}
	}

	componentDidMount() {
	}

	render() {
	
		return (
			<React.Fragment>
				<Button variant="contained" startIcon={<CalendarMonthIcon />} onClick={() => this.setState({dialogOpen: true})} fullWidth>
					Alterar Jornada
				</Button>
				{this.state.dialogOpen ?
					<Dialog
						fullWidth={true}
	        			maxWidth={"xl"}
						onClose={() => this.setState({dialogOpen: false})}
						open={this.state.dialogOpen}
					>
	      				<DialogTitle>Alterar Jornada</DialogTitle>
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
							<AlterarJornadaBox usuario={this.props.usuario} usuarioId={this.props.usuarioId}/>
						</DialogContent>
					</Dialog> : ""}
		    </React.Fragment>
		  );
	}

}