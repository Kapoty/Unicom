import React from 'react';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export class DurationInput extends React.Component {
	render() {
		return <InputMask {...this.props} mask="a9\hb9\m" maskChar="0"
			formatChars = {{
				"a": "[0-2]",
				"b": "[0-5]",
				"9": "[0-9]",
			}}
		>
			{(inputProps) => <TextField {...inputProps}/>}
		</InputMask>
	}
}

export function secondsToDuration(seconds) {
	let hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
	let minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
	return `${hours}h${minutes}m`;
}

export function durationToSeconds(duration) {
	let seconds = 0;
	try {
		let match = duration.match(/(\d\d)\h(\d\d)\m/);
		seconds = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60;
	} catch (e) {
	}
	return seconds;
}