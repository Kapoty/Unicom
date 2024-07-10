import React from "react";
import ReactDOM from "react-dom";

import Config from "../config/Config";

import api from "../services/api";
import {isPontoAuth, getPontoToken, setPontoToken} from "../utils/pontoAuth"

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

class PontoFacialRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuario: null,
			calling: false,
			recording: false,

			alertOpen: false,
			alert: null,
		};

		this.handleUsuarioFotoChange = this.handleUsuarioFotoChange.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.takePicture = this.takePicture.bind(this);
		this.handlePicture = this.handlePicture.bind(this);

		this.openAlert = this.openAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}

	componentDidMount() {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		let constraints = {audio: false, video: true};
		let video = document.querySelector("video");

		function successCallback(stream) {
			video.srcObject = stream;
		}

		function errorCallback(error){
			console.log("navigator.getUserMedia error: ", error);
		}

		navigator.getUserMedia(constraints, successCallback, errorCallback);

		setInterval(this.takePicture, 1000);
	}

	async handleUsuarioFotoChange(event) {
		let data = {
			token: getPontoToken(),
			img: await toBase64(event.target.files[0])
		}

		this.setState({calling: true});

		api.post(`registro-ponto/registrar-face`, data)
			.then((response) => {
				this.openAlert("success", "Usuário identificado com sucesso");
				this.setState({usuario: response.data, calling: false});
			})
			.catch((err) => {
				console.log(err.data)
				this.openAlert("error", "Usuário não identificado");
				this.setState({usuario: null, calling: false});
			})

		event.target.value = "";
	}

	async handlePicture(picture) {
		let data = {
			token: getPontoToken(),
			img: picture
		}

		this.setState({calling: true});

		api.post(`registro-ponto/registrar-face`, data)
			.then((response) => {
				this.openAlert("success", "Usuário identificado com sucesso");
				this.setState({usuario: response.data, calling: false});
			})
			.catch((err) => {
				console.log(err.data)
				this.openAlert("error", "Usuário não identificado");
				this.setState({usuario: null, calling: false});
			})

	}


	startRecording() {
		this.setState({recording: true});
	}

	stopRecording() {
		this.setState({recording: false});
	}

	takePicture() {
		if (this.state.recording && !this.state.calling) {
			let video = document.getElementById('video');
			let canvas = document.getElementById('canvas');
			const context = canvas.getContext("2d");
			canvas.width = 200;
			canvas.height = video.videoHeight/video.videoWidth*200;
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			const data = canvas.toDataURL("image/png");
			this.handlePicture(data);
		}
	}

	openAlert(severity, message) {
		this.setState({alert: <Alert severity={severity} onClose={this.closeAlert}>{message}</Alert>, alertOpen: true});
	}

	closeAlert() {
		this.setState({alertOpen: false});
	}

	render() {
	
		return <React.Fragment>
			<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			flexDirection="column"
			height="100dvh"
			>
				<Box></Box>
				<Paper elevation={3} sx={{minWidth: "300px", padding: 5}}>
					<Stack justifyContent="center" alignItems="center" gap={3}>
						<Typography variant="h3"> Ponto Facial </Typography>
						<video id="video" style={{width: 150}} autoPlay></video>
						<canvas id="canvas" style={{display: "none"}}> </canvas>
						<Button onMouseDown={this.startRecording}  onMouseUp={this.stopRecording} onTouchStart={this.startRecording} onTouchEnd={this.stopRecording} color={this.state.recording ? "error" : "primary"}><FingerprintIcon sx={{fontSize: 120}} /></Button>
						<input type="file" accept="image/jpeg" id="foto-perfil" hidden onChange={this.handleUsuarioFotoChange} disabled={this.state.calling}/>
						<Avatar sx={{width: 100, height: 100}} src={this.state.usuario !== null ? api.defaults.baseURL + "/usuario/" + this.state.usuario.usuarioId + "/foto-perfil?versao=" + this.state.usuario.fotoPerfilVersao : ""}>{this.state.usuario !== null ? this.state.usuario.nome.charAt(0) : "?"}</Avatar>
						<Typography variant="body">{this.state.usuario !== null ? this.state.usuario.nome : ""}</Typography>
					</Stack>
				</Paper>
				<Collapse in={this.state.alertOpen}>
						{this.state.alert}
					</Collapse>
			</Box>
			
		</React.Fragment>
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	return <PontoFacialRoute navigate={navigate} location={location} searchParams={searchParams} {...props}/>
}