import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from "@mui/material/Paper";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import MinhaEquipePaper from "./MinhaEquipePaper";
import JornadaChip from "./JornadaChip";
import AlterarJornadaButton from "./AlterarJornadaButton";
import RelatorioJornadaButton from "./RelatorioJornadaButton";
import UsuarioDisplayChip from "./UsuarioDisplayChip";
import UploadImage from "./UploadImage";
import UsuarioAvatar from "./UsuarioAvatar";

import { useNavigate } from 'react-router-dom';

class MinhaEquipeUsuarioPaper extends React.Component {

	render() {

		let usuario = this.props.usuario;
		let usuarioEquipe = this.props.usuarioEquipe;

		return <MinhaEquipePaper>
			<Stack gap={2} alignItems="center">
				<Stack width={1} direction="row" gap={1} alignItems="center">
					<Typography sx={{ flexGrow: 1 }}>{usuarioEquipe.matricula ? "#" + usuarioEquipe.matricula : ""}</Typography>
					<Tooltip title="Editar">
						<IconButton onClick={() => this.props.navigate("/usuarios/" + usuarioEquipe.usuarioId)}>
							<EditIcon/>
						</IconButton>
					</Tooltip>
					<Tooltip title="Remover da Equipe">
						<IconButton onClick={this.props.onRemove}>
							<DeleteIcon/>
						</IconButton>
					</Tooltip>
				</Stack>
				<Divider flexItem/>
				<UsuarioAvatar variant="square" sx={{ width: "128px", height: "128px"}} usuario={usuarioEquipe}/>
				<Typography variant="h4" align="center">
					{usuarioEquipe.nome}
				</Typography>
				<JornadaChip usuario={usuario} me={false} usuarioId={usuarioEquipe.usuarioId}/>
				<AlterarJornadaButton usuario={usuario} usuarioId={usuarioEquipe.usuarioId}/>
				<RelatorioJornadaButton usuario={usuario} usuarioId={usuarioEquipe.usuarioId} me={false}/>
			</Stack>
		</MinhaEquipePaper>
	}
}

export default (props) => {
	const navigate = useNavigate();
	return <MinhaEquipeUsuarioPaper navigate={navigate} {...props}/>
}