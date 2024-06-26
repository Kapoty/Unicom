import React from 'react';
import Avatar from '@mui/material/Avatar';

import api from "../services/api";

export default class UploadImage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			imageSrc: ""
		}

		this.loadUploadImageFromApi = this.loadUploadImageFromApi.bind(this);
	}

	componentDidMount() {
		this.loadUploadImageFromApi();
	}

	componentDidUpdate(prevProps) {
	if (this.props.filename !== prevProps.filename) {
			this.loadUploadImageFromApi();
		}
	}

	loadUploadImageFromApi() {
		api.get("/empresa/me/upload/" + this.props.filename, {responseType: "blob"})
		.then((response) => {
			let blob = response.data;
			let reader = new FileReader();
			reader.onload = () => {
				const base64data = reader.result;
				this.setState({imageSrc: base64data});
			}
			reader.readAsDataURL(blob);
		})
		.catch((err) => {
			this.setState({imageSrc: ""})
			console.error(err);
		});
	}

	render() {

		const {filename, ...rest} = this.props;

		return <img src={this.state.imageSrc} {...rest}/>
	}
}