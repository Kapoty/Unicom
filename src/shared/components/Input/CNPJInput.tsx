import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef, ReactElement } from 'react';
import InputMask, { Props } from 'react-input-mask';

export interface CNPJInputProps extends Partial<Props> {
	textField: ReactElement<TextFieldProps>,
}

const CNPJInput = forwardRef<HTMLInputElement, CNPJInputProps>((props, ref) => {

	const { textField, ...rest } = props;
	return <InputMask {...rest} mask="99.999.999/9999-99" maskChar="_">
		{(inputProps) => <TextField {...textField.props} {...inputProps} disabled={props.disabled} />}
	</InputMask>

});

export default CNPJInput;