import React from 'react';
import Stack from '@mui/material/Stack';
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import UsuarioAvatar from "./UsuarioAvatar"

export default class UsuarioDisplayChip extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.usuario !== this.props.usuario;
	}
	
	render() {
		let {usuario, forwardedRef, sx, ...rest} = this.props;
		return <Chip
		      		avatar={<UsuarioAvatar usuario={usuario}/>}
		      		sx={{
		      			...sx,
		      			overflow: "hidden"
		      		}}
		      		label={
		      			<Stack direction="row" gap={1} alignItems="center">
		      				<Typography variant="body2">{usuario?.nome ?? ""}</Typography>
		      				{usuario?.matricula && <Chip color="default" variant={this.props.color == "primary" ? "filled" : "outlined"} size="small" label={`#${usuario?.matricula}`} />}
		      			</Stack>
		      		}
		      		ref={forwardedRef}
		      		{...rest}
		      	/>
	}
}