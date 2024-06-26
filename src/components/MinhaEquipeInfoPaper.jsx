import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from "@mui/material/Paper";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import MinhaEquipePaper from "./MinhaEquipePaper";
import UsuarioDisplayChip from "./UsuarioDisplayChip";
import UploadImage from "./UploadImage";

export default class MinhaEquipeInfoPaper extends React.Component {


	render() {
		let equipe = this.props.equipe;
		let nMembros = equipe.usuarioList.length;

		return <MinhaEquipePaper>
			<Stack gap={2} alignItems="center">
				{equipe.iconFilename ? <UploadImage filename={equipe.iconFilename} style={{width: 150, height: 150}}/> : <Icon color="primary" style={{ fontSize: 150 }}>{equipe.icon ?? "groups"}</Icon>}
				<Divider flexItem />
				<Grid container spacing={2}>
					<Grid item xs={3}>
						<Stack direction="row" justifyContent="end">
							<Icon>groups</Icon>
						</Stack>
					</Grid>
					<Grid item xs={9}>
						<Typography>{nMembros} membro{nMembros > 1 ? "s" : ""}</Typography>
					</Grid>
					<Grid item xs={3}>
						<Stack direction="row" justifyContent="end">
							<Icon>person_search</Icon>
						</Stack>
					</Grid>
					<Grid item xs={9}>
						<UsuarioDisplayChip usuario={equipe.supervisor}/>
					</Grid>
					<Grid item xs={3}>
						<Stack direction="row" justifyContent="end">
							<Icon>manage_accounts</Icon>
						</Stack>
					</Grid>
					<Grid item xs={9}>
						<UsuarioDisplayChip usuario={equipe.gerente}/>
					</Grid>
				</Grid>
			</Stack>
		</MinhaEquipePaper>
	}
}