import React from 'react';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { getContrastRatio } from '@mui/material/styles';

export default class VendaStatusChip extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.vendaStatus !== this.props.vendaStatus;
	}

	render() {
		let {vendaStatus, sx, ...rest} = this.props; 

		if (vendaStatus == null)
			return "";

		let cor = "#" + (vendaStatus?.cor ?? "000");
		
		return  <Chip
				{...rest}
				color="primary"
				style={{backgroundColor: cor, color: '#fff', fontWeight: "bold"}}
				variant="contained"
				label={vendaStatus?.nome}
				icon={<Icon>{vendaStatus?.icon}</Icon>}
				sx={{
		      			...sx,
		      			overflow: "hidden"
		      		}}
			/>
	}
}