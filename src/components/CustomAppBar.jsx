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

import api from "../services/api";

import { useNavigate, useLocation } from "react-router-dom";

class CustomAppBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usuarioMenuOpen: false
		};

		this.usuarioMenuRef = React.createRef();

	}

	componentDidMount() {
	}

	render() {
	
		return (
		    <AppBar position="static" sx={{background: "black"}}>
		        <Toolbar sx={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
		        		<IconButton
			            size="large"
			            edge="start"
			            color="inherit"
			            aria-label="menu"
			            sx={{ mr: 2 }}
			            onClick={this.props.toggleMenu}
			          >
			            <MenuIcon />
			         </IconButton>
		           	<Box sx={{display: "flex", flexGrow: 1, justifyContent: "left", alignItems: "center", gap: "10px", "&:hover": {cursor: "pointer"}}} onClick={() => {}}>
	           			<Link to="/">
		           			<img style={{width: "auto", height: "24px"}} src='/assets/image/UniSystem_Logo.png'/>
		           		</Link>
		           	</Box>
		           	{this.props.usuario !== null && this.props.usuario.permissaoList.includes("Iframe.Read.All") && this.props.location.pathname.startsWith("/i/") ? <React.Fragment>
			           	<Tooltip title="Recarregar">
				           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => {document.querySelector(".currentIframe").src += ""}}>
					        	<Icon>refresh</Icon>
				      		</IconButton></span>
			      		</Tooltip>
			      		<Tooltip title="Abrir em nova aba">
				      		<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => {window.open(document.querySelector(".currentIframe").src, "_blank")}}>
					        	<Icon>open_in_new</Icon>
				      		</IconButton></span>
				      	</Tooltip>
			      		<Divider orientation="vertical" variant="middle" flexItem/>
			      	</React.Fragment> : ""}

			      	<Tooltip title="Imprimir">
				           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => {window.print();}}>
					        	<Icon>printer</Icon>
				      		</IconButton></span>
			      		</Tooltip>
		           	<Tooltip title="Tela cheia">
			           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.toggleFullscreen()}>
				        	<Icon>{this.props.fullscreen ? "fullscreen_exit" : "fullscreen"}</Icon>
			      		</IconButton></span>
			      	</Tooltip>
			      	<Chip
			      		clickable
			      		avatar={<Avatar src={this.props.usuario !== null ? api.defaults.baseURL + "/usuario/" + this.props.usuario.usuarioId + "/foto-perfil?versao=" + this.props.usuario.fotoPerfilVersao : ""}>{this.props.usuario !== null ? this.props.usuario.nome.charAt(0) : "?"}</Avatar>}
			      		label={this.props.usuario !== null ? this.props.usuario.nome : "..."}
			      		ref={this.usuarioMenuRef}
			      		onClick={() => this.setState({usuarioMenuOpen: !this.props.usuarioMenuOpen})}
			      	/>
		      		<Menu
				        anchorEl={this.usuarioMenuRef.current}
				        open={this.state.usuarioMenuOpen}
				        onClose={() => this.setState({usuarioMenuOpen: false})}
				        anchorOrigin={{
				          vertical: 'bottom',
				          horizontal: 'left',
				        }}
				        transformOrigin={{
				          vertical: 'top',
				          horizontal: 'left',
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
											<WorkIcon/>
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
											<GroupsIcon/>
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
											<VerifiedUserIcon/>
										</ListItemIcon>
										<ListItemText  primaryTypographyProps={{ style: { whiteSpace: "normal" } }} primary={this.props.usuario.papelList.map(p => <div key={p.papelId}>{p.nome}</div>)} />
									</ListItem>
								</List> : <Box width="100%" display="flex" justifyContent="center"><CircularProgress/></Box>}
					      	</MenuItem> 
				        <Divider />
				        <MenuItem onClick={this.props.logout}>
							<ListItemIcon>
								<Logout fontSize="small" />
							</ListItemIcon>
							Sair
				        </MenuItem>
				      </Menu>
		        </Toolbar>
	     	</AppBar>
		  );
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	return <CustomAppBar navigate={navigate} location={location} {...props}/>
}