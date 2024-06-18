import React from 'react';
import Stack from '@mui/material/Stack';
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import UsuarioAvatar from "./UsuarioAvatar"

export default class UsuarioDisplayChip extends React.Component {
	render() {
		let {usuario, forwardedRef, ...rest} = this.props;
		return <Chip
					sx={{overflow: "hidden", minWidth: "100px"}}
		      		avatar={<UsuarioAvatar usuario={usuario}/>}
		      		label={
		      			<Stack direction="row" gap={1} alignItems="center">
		      				<Typography variant="body2">{usuario?.nome ?? ""}</Typography>
		      				{usuario?.matricula && <Chip sx={{overflow: "hidden", minWidth: "20px"}} color="default" variant={this.props.color == "primary" ? "filled" : "outlined"} size="small" label={`#${usuario?.matricula}`} />}
		      			</Stack>
		      		}
		      		ref={forwardedRef}
		      		{...rest}
		      	/>
	}
}