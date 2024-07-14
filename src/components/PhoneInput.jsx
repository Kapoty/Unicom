import React from 'react';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';

export default class PhoneInput extends React.Component {

	render() {

		let mask = "";
		
		if (this.props?.ddd ?? true)
			mask += "(99) ";
		
		if (this.props?.fixoDinamico ?? false) {

			mask += "999999999";

		} else {

			if (!(this.props?.fixo ?? false))
				mask += "9 ";

			mask += "9999-9999";

		}

		return <InputMask {...this.props} mask={mask} maskChar="_"
			formatChars = {{
				"9": "[0-9]",
			}}
			beforeMaskedValueChange={this.beforeMaskedValueChange}
		>
			{(inputProps) => <TextField {...inputProps} disabled={this.props.disabled}/>}
		</InputMask>
	}
}