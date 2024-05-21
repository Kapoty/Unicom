import React from 'react';
import Avatar from '@mui/material/Avatar';

import api from "../services/api";

export default class UsuarioAvatar extends React.Component {
	render() {
		let usuario = this.props.usuario;
		return <Avatar {...this.props} src={usuario?.fotoPerfil ? api.defaults.baseURL + "/usuario/" + usuario?.usuarioId + "/foto-perfil?versao=" + usuario?.fotoPerfilVersao : ""}>{(usuario?.nome ?? "").charAt(0)}</Avatar>
	}
}