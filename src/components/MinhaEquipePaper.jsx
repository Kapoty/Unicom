import React from 'react';
import Paper from "@mui/material/Paper";

export default class MinhaEquipePaper extends React.Component {

	render() {
		return <Paper sx={{width: 300, height: 300, padding: 3}}>
			{this.props.children}
		</Paper>
	}
}