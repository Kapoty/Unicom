import React from 'react';
import Stack from '@mui/material/Stack';
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

import UsuarioAvatar from "./UsuarioAvatar"

export default class UsuarioDisplayStack extends React.Component {
	render() {
		let usuario = this.props.usuario;
		return <Stack direction="row" spacing={1} alignItems="center" {...this.props}>
					<UsuarioAvatar usuario={usuario}/>
					<div>{usuario?.nome ?? ""}</div>
					{usuario?.matricula ? <Chip size="small" label={`#${usuario?.matricula}`} /> : ""}
				</Stack>
	}
}