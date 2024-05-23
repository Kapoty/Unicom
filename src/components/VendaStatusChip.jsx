import React from 'react';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { getContrastRatio } from '@mui/material/styles';

export default class VendaStatusChip extends React.Component {

	render() {
		let vendaStatus = this.props.vendaStatus;

		if (vendaStatus == null)
			return "";

		let cor = "#" + (vendaStatus?.cor ?? "000");
		
		return  <Chip
				{...this.props}
				color="primary"
				style={{backgroundColor: cor, color: '#fff', fontWeight: "bold"}}
				variant="contained"
				label={vendaStatus?.nome}
				icon={<Icon>{vendaStatus?.icon}</Icon>}
			/>
	}
}