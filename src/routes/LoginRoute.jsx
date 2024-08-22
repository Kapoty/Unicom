import React from "react";
import ReactDOM from "react-dom";

import Config from "../config/Config";

import api from "../services/api";
import {isAuth, getToken, setToken} from "../utils/auth"

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
import DomainIcon from '@mui/icons-material/Domain';

import dayjs from 'dayjs';

class LoginRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: isAuth(),
			today: dayjs(),
			showDominioInput: false,
			dominio: "",
			login: "",
			senha: "",
			showSenha: false,
			errors: {},
			calling: false,
		};

		this.handleLogin = this.handleLogin.bind(this);

	}

	handleLogin(e) {
		e.preventDefault();
		this.setState({calling: true});
		api.post("auth/login", {
			"login": this.state.login,
			"senha": this.state.senha,
			"dominio": this.state.dominio == "" ? window.location.hostname : this.state.dominio,
		}, {redirect401: false}).then((response) => {
			setToken(response.data.token);
			this.props.navigate("/");
		})
		.catch((error) => {
			if (error.response) {
				if (error.response.status == 400) {
					this.setState({calling: false, errors: error.response.data.errors})
				} else if (error.response.status == 401)
					this.setState({calling: false, errors: {login: "Usuário ou senha incorretos", senha: ""}})
			} else this.setState({calling: false, errors: {login: "Falha ao se conectar ao servidor"}})
		})
	}

	componentDidMount() {
		if (this.state.isAuth)
			 setTimeout(() => this.props.navigate("/")) 
		else {
			this.props.updateThemePrimaryColor("");
			this.updateFavicon("/assets/image/Icon.png");
		}
	}

	setLogin = (e) => {
		let login = e.target.value;
		this.setState({login: login, showDominioInput: login == "dominio" || this.state.showDominioInput});
	}

	updateFavicon(href) {
		document.querySelector("link[rel~='icon']").href = href;
	}

	render() {
	
		return <React.Fragment>
			<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			height="100dvh"
			flexDirection="column"
			>
				<Paper elevation={3} sx={{width: "400px", padding: 5}}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<LockIcon sx={{fontSize: 120, marginBottom: 3}}/>
					</Box>
					<form onSubmit={this.handleLogin} disabled>
						<Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={3}>
							{this.state.showDominioInput && <TextField
								id="dominio"
								value={this.state.dominio}
								onChange={(e) => this.setState({dominio: e.target.value})}
								fullWidth
								label="Domínio"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<DomainIcon />
										</InputAdornment>
									),
								}}
								variant="outlined"
								disabled={this.state.calling}
								error={"dominio" in this.state.errors}
								helperText={"dominio" in this.state.errors ? this.state.errors["dominio"] : ""}
							/>}
							<TextField
								id="login"
								value={this.state.login}
								onChange={this.setLogin}
								fullWidth
								autoComplete="new-password"
								label="Email ou Matrícula"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AccountCircle />
										</InputAdornment>
									),
									autoComplete: 'new-password'
								}}
								variant="outlined"
								disabled={this.state.calling}
								error={"login" in this.state.errors}
								helperText={"login" in this.state.errors ? this.state.errors["login"] : ""}
							/>
							<TextField
								id="senha"
								value={this.state.senha}
								type={this.state.showSenha ? 'text' : 'password'}
								onChange={(e) => this.setState({senha: e.target.value})}
								fullWidth
								label="Senha"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<KeyIcon />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={() => this.setState({showSenha: !this.state.showSenha})}
												edge="end"
											>
												{this.state.showSenha ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
									autoComplete: 'new-password'
								}}
								variant="outlined"
								disabled={this.state.calling}
								error={"senha" in this.state.errors}
								helperText={"senha" in this.state.errors ? this.state.errors["senha"] : ""}
							/>
							<Button type="submit" variant="contained" size="large" endIcon={<LoginIcon />} disabled={this.state.calling}>Acessar</Button>
						</Box>
					</form>
					<Backdrop open={this.state.calling}>
						<CircularProgress color="inherit"/>
					</Backdrop>
				</Paper>
				<Typography variant="subtitle1" component="h6" sx={{color: "white", marginTop: 3}}>
				UniSystem | {this.state.today.format("L")} | {window.location.hostname}
				</Typography>
			</Box>
			
		</React.Fragment>
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	return <LoginRoute navigate={navigate} location={location} searchParams={searchParams} {...props}/>
}