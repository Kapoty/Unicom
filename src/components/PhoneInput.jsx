import React from 'react';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';

export default class PhoneInput extends React.Component {
	render() {
		return <InputMask {...this.props} mask="(99) 9 9999-9999" maskChar="_"
			formatChars = {{
				"9": "[0-9]",
			}}
		>
			{(inputProps) => <TextField {...inputProps} disabled={this.props.disabled}/>}
		</InputMask>
	}
}