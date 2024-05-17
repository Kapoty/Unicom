import React from 'react';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default class MoneyInput extends React.Component {
	render() {
		return <TextField
			{...this.props}
			type="number"
			InputProps={{
				startAdornment: <InputAdornment position="start">R$</InputAdornment>,
			}}
		/>
	}
}