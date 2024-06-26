import React from 'react';
import Stack from '@mui/material/Stack';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import Tooltip from "@mui/material/Tooltip";
import ButtonBase from '@mui/material/ButtonBase';

import MinhaEquipePaper from "./MinhaEquipePaper";

export default class MinhaEquipeAdicionarButton extends React.Component {


	render() {
		return <Tooltip title="Adicionar Usuário à Equipe">
				<ButtonBase onClick={this.props.onClick}>
					<MinhaEquipePaper>
						<Stack alignItems="center" justifyContent="center" height={1}>
							<PersonAddAltRoundedIcon sx={{fontSize: 150}}/>
						</Stack>
					</MinhaEquipePaper>
				</ButtonBase>
			</Tooltip>
	}
}