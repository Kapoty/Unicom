import React from "react";
import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Chip from '@mui/material/Chip'
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import JornadaChip from './JornadaChip';
import RegistroDeAtividadesIcon from './RegistroDeAtividadesIcon';
import RelatorioJornadaButton from './RelatorioJornadaButton';
import UsuarioDisplayChip from "./UsuarioDisplayChip";
import UsuarioAvatar from "./UsuarioAvatar";
import UploadImage from '../components/UploadImage';

import api from "../services/api";

import { useNavigate, useLocation } from "react-router-dom";

class CustomAppBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuarioMenuOpen: false,
			diaFechamentoFolha: null,
			diasAteFechamentoFolha: null,
			alertFechamentoFolhaOpen: false,
		};

		this.getDiaFechamentoFolha = this.getDiaFechamentoFolha.bind(this);

		this.checkAlertFechamentoFolha = this.checkAlertFechamentoFolha.bind(this);
		this.openAlertFechamentoFolha = this.openAlertFechamentoFolha.bind(this);
		this.closeAlertFechamentoFolha = this.closeAlertFechamentoFolha.bind(this);

		this.usuarioMenuRef = React.createRef();

	}

	componentDidMount() {
		this.getDiaFechamentoFolha();
	}

	getDiaFechamentoFolha() {
		api.get("/registro-jornada/me/dia-fechamento-folha")
			.then((response) => {
				this.setState({diaFechamentoFolha: response.data}, () => this.checkAlertFechamentoFolha());
			})
			.catch((err) => {
				if (err?.response?.status != 400)
					setTimeout(this.getDiaFechamentoFolha, 3000);
			});
	}

	checkAlertFechamentoFolha() {
		let hoje = new Date();
		let diaFechamentoFolha = this.state.diaFechamentoFolha;
		let dataFechamentoFolha;
		let diasAteFechamentoFolha;

		if (hoje.getDate() <= diaFechamentoFolha)
			dataFechamentoFolha = new Date(hoje.getFullYear(), hoje.getMonth(), Math.min(diaFechamentoFolha, new Date(hoje.getFullYear(), hoje.getMonth()+1, 0).getDate()));
		else
			dataFechamentoFolha = new Date(hoje.getFullYear(), hoje.getMonth() + 1, Math.min(diaFechamentoFolha, new Date(hoje.getFullYear(), hoje.getMonth()+2, 0).getDate()));

		diasAteFechamentoFolha =  Math.ceil((dataFechamentoFolha - hoje) / 86400000);

		if (diasAteFechamentoFolha <= 5)
			setTimeout(this.openAlertFechamentoFolha, 3000);

		this.setState({diasAteFechamentoFolha: diasAteFechamentoFolha});
	}

	openAlertFechamentoFolha() {
		this.setState({alertFechamentoFolhaOpen: true});
	}

	closeAlertFechamentoFolha() {
		this.setState({alertFechamentoFolhaOpen: false});
	}

	render() {
	
		return (
		    <AppBar position="static" /*sx={{background: "black"}}*/ elevation={0}>
		        <Toolbar sx={{display: "flex", justifyContent: "space-between", gap: "10px", overflow: "auto"}}>
		        		<IconButton
			            size="large"
			            edge="start"
			            color="inherit"
			            aria-label="menu"
			            sx={{ mr: 2 }}
			            onClick={this.props.toggleMenu}
			          >
			            <MenuIcon color="primary" />
			         </IconButton>
		           	<Box sx={{display: "flex", flexGrow: 1, justifyContent: "left", alignItems: "center", gap: "10px", height: "100%", gap: "10px"}}>
	           			<Link to="/">
           					<Box sx={{ display: { xs: 'none', md: 'block' } }}>
		           				<img style={{width: "auto", height: "24px"}} src='/assets/image/UniSystem_Logo.png'/>
		           			</Box>
		           			<Box sx={{ display: { xs: 'block', md: 'none' } }}>
		           				<img style={{width: "auto", height: "12px"}} src='/assets/image/UniSystem_Logo.png'/>
		           			</Box>
		           		</Link>
		           		<Divider orientation="vertical" variant="middle" flexItem/>
		           		{this.props.usuario.empresa?.iconFilename && <UploadImage filename={this.props.usuario.empresa?.iconFilename} style={{height: 24}}/>}
		           		<Typography color="primary">
		           			{this.props.usuario.empresa.nome}
		           		</Typography>
		           	</Box>
		           	{this.props.usuario !== null && this.props.usuario.permissaoList.includes("VER_MODULO_IFRAME") && this.props.location.pathname.startsWith("/i/") ? <React.Fragment>
			           	<Tooltip title="Recarregar">
				           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => {document.querySelector(".currentIframe").src += ""}}>
					        	<Icon color="primary">refresh</Icon>
				      		</IconButton></span>
			      		</Tooltip>
			      		<Tooltip title="Abrir em nova aba">
				      		<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => {window.open(document.querySelector(".currentIframe").src, "_blank")}}>
					        	<Icon color="primary">open_in_new</Icon>
				      		</IconButton></span>
				      	</Tooltip>
			      		<Divider orientation="vertical" variant="middle" flexItem/>
			      	</React.Fragment> : ""}

			      	{/*<Tooltip title="Imprimir">
				           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => {window.print();}}>
					        	<Icon>printer</Icon>
				      		</IconButton></span>
			      		</Tooltip>*/}
		           	<Tooltip title="Tela cheia">
			           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.toggleFullscreen()}>
				        	<Icon color="primary">{this.props.fullscreen ? "fullscreen_exit" : "fullscreen"}</Icon>
			      		</IconButton></span>
			      	</Tooltip>

			      	{this.props.usuario !==null && <RegistroDeAtividadesIcon usuario={this.props.usuario}/>}

			      	{this.props.usuario !==null && this.props.usuario.permissaoList.includes("REGISTRAR_JORNADA") ? <JornadaChip usuario={this.props.usuario} me showFixButton/> : ""}

			      	<Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
			      		<Collapse in={this.state.alertFechamentoFolhaOpen} orientation="horizontal">
				      		<Alert severity="warning" onClose={this.closeAlertFechamentoFolha}><Box sx={{textWrap: "nowrap"}}>Restam {this.state.diasAteFechamentoFolha} dias para fechamento da folha. Verifique sua folha!</Box></Alert>
				      	</Collapse>
				      	<UsuarioDisplayChip
							color="primary"
							clickable
							usuario={this.props.usuario}
							forwardedRef={this.usuarioMenuRef}
							onClick={() => this.setState({usuarioMenuOpen: !this.props.usuarioMenuOpen})}
						/>
			      	</Stack>

		      		<Menu
				        anchorEl={this.usuarioMenuRef.current}
				        open={this.state.usuarioMenuOpen}
				        onClose={() => this.setState({usuarioMenuOpen: false})}
				        anchorOrigin={{
				          vertical: 'bottom',
				          horizontal: 'right',
				        }}
				        transformOrigin={{
				          vertical: 'top',
				          horizontal: 'right',
				        }}
				         PaperProps={{
				         	sx: {width: "auto"}
				         }}
				      >
				      	<MenuItem sx={{padding: 0}}>
				      		{this.props.usuario !== null ?
					      		<List disablePadding dense>
							      	<ListItem>
							      		<ListItemIcon>
											<ApartmentIcon/>
										</ListItemIcon>
										<ListItemText primary={this.props.usuario.empresa.nome} />
							      	</ListItem>
							      	<ListItem>
							      		<ListItemIcon>
											<PersonIcon/>
										</ListItemIcon>
										<ListItemText primary={this.props.usuario.nome} secondary={this.props.usuario.matricula !== null ? "#" + this.props.usuario.matricula : ""} />
									</ListItem>
									<ListItem>
							      		<ListItemIcon>
											<MailIcon/>
										</ListItemIcon>
										<ListItemText primary={this.props.usuario.email} />
							      	</ListItem>
							      	<ListItem>
							      		<ListItemIcon>
											<WorkIcon/>
										</ListItemIcon>
										<ListItemText primary={this.props.usuario.departamento !== null ? this.props.usuario.departamento.nome : ""} />
							      	</ListItem>
							      	<ListItem>
							      		<ListItemIcon>
											<BadgeIcon/>
										</ListItemIcon>
										<ListItemText primary={this.props.usuario.cargo !== null ? this.props.usuario.cargo.nome : ""} />
							      	</ListItem>
							      	<ListItem>
							      		<ListItemIcon>
											<GroupsIcon/>
										</ListItemIcon>
										<ListItemText primary={this.props.usuario.equipe !== null ? this.props.usuario.equipe.nome : ""} />
							      	</ListItem>
									<ListItem>
							      		<ListItemIcon>
											<VerifiedUserIcon/>
										</ListItemIcon>
										<ListItemText  primaryTypographyProps={{ style: { whiteSpace: "normal" } }} primary={this.props.usuario.papel.nome} />
									</ListItem>
								</List> : <Box width="100%" display="flex" justifyContent="center"><CircularProgress/></Box>}
					      	</MenuItem> 
				        <Divider />
				        <MenuItem onClick={this.props.requestNotificationsPermission} disabled={this.props.notificationsGranted == true}>
							<ListItemIcon>
								{this.props.notificationsGranted == true ? <NotificationsActiveIcon fontSize="small" /> : <NotificationsOffIcon fontSize="small" />}
							</ListItemIcon>
							{this.props.notificationsGranted == true ? "Notificações ativadas" : "Ativar notificações"}
				        </MenuItem>
				        <MenuItem onClick={() => {
				        	let title = 'Interação Requisitada';
				        	let options = {
								body: 'Interaja com o sistema para  confirmar que está presente!',
								vibrate: [300, 100, 400],
								requireInteraction: true
							};

							navigator.serviceWorker.ready.then(function(registration) {
								registration.showNotification(title, options);
							});
				        }}>
							<ListItemIcon>
								<NotificationsActiveIcon fontSize="small" />
							</ListItemIcon>
							Testar notificação
				        </MenuItem>
				        {this.props.usuario !==null && this.props.usuario.permissaoList.includes("REGISTRAR_JORNADA") ? <RelatorioJornadaButton usuario={this.props.usuario} usuarioId={this.props.usuario.usuarioId} me={true}/> : ""}
				        <Divider/>
				        <MenuItem onClick={this.props.logout}>
							<ListItemIcon>
								<Logout fontSize="small" />
							</ListItemIcon>
							Sair
				        </MenuItem>
				      </Menu>
		        </Toolbar>
		        <Divider/>
	     	</AppBar>
	     );
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	return <CustomAppBar navigate={navigate} location={location} {...props}/>
}