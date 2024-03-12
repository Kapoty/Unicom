import React from "react";

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import PeopleIcon from '@mui/icons-material/People';

import IframeContextMenu from '../components/iframeContextMenu'

import { useNavigate, useLocation } from "react-router-dom";

class CustomNavigation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			iframeListOpen: false,
			iframeContextMenuOpen: false,
			iframeContextMenuIframe: null,
			iframeContextMenuX: 0,
			iframeContextMenuY: 0,

			usuarioModuleOpen: false,
		}

		this.handleIframeContextMenu = this.handleIframeContextMenu.bind(this);
		this.closeIframeContextMenu = this.closeIframeContextMenu.bind(this);
	}

	componentDidMount() {
	}

	handleIframeContextMenu(iframe, event) {
		event.preventDefault();
		this.setState({iframeContextMenuIframe: iframe, iframeContextMenuOpen: true, iframeContextMenuX: event.clientX, iframeContextMenuY: event.clientY})
	}

	closeIframeContextMenu() {
		this.setState({iframeContextMenuOpen: false})
	}

	render() {
		return (
			<React.Fragment>
				<Drawer
					variant="persistent"
					anchor="left"
		            open={this.props.menuOpen}
		            sx={
		            	{
		            		width: this.props.menuOpen ? "350px" : "0px",
		            		transition: "width 0.25s",
		            		"& .MuiDivider-fullWidth": {
		            			display: "none"
		            		},
		            	}
		            }
		            PaperProps={{
			          sx: {
			            position: "relative",
			            backgroundColor: "rgba(0, 0, 0, 0.75)",
			            border: "none"
			          },
			        }}
		          >
		             <Box
				      sx={
				      	{
				      		minWidth: 325,
				      	}
				      }
				      role="presentation"
				    >
				     <List>
					      <ListItem disablePadding>
								<ListItemButton onClick={() => {this.props.navigate(`/`)}}
									selected={this.props.location.pathname == "/"}
									>
									<ListItemIcon>
										<Icon>home</Icon>
									</ListItemIcon>
									<ListItemText primary={"Início"}/>
								</ListItemButton>
							</ListItem>
						{this.props.usuario !== null ?
							<React.Fragment>
						      	{this.props.usuario.permissaoList.includes("Iframe.Read.All") ?
						      	<React.Fragment>
								 	<ListItemButton onClick={() => this.setState({iframeListOpen: !this.state.iframeListOpen})}>
										<ListItemIcon>
											<Icon>web</Icon>
										</ListItemIcon>
										<ListItemText primary={"Relatórios"} sx={{wordBreak: "break-all"}}/>
										{this.state.iframeListOpen ? <ExpandLess /> : <ExpandMore />}
									</ListItemButton>
									<Collapse in={this.state.iframeListOpen} timeout="auto" unmountOnExit>
										<List component="div" disablePadding>
											{this.props.iframeCategoryList !== null ?
											this.props.iframeCategoryList.map((iframeCategory) => <List key={iframeCategory.iframeCategoryId} disablePadding>
												<ListItemButton onClick={() => this.props.toggleIframeCategory(iframeCategory)} sx={{ pl: 3 }}>
													<ListItemIcon>
														<Icon>{iframeCategory.icon}</Icon>
													</ListItemIcon>
													<ListItemText primary={iframeCategory.titulo} sx={{wordBreak: "break-all"}}/>
													{iframeCategory.open ? <ExpandLess /> : <ExpandMore />}
												</ListItemButton>
												<Collapse in={iframeCategory.open} timeout="auto" unmountOnExit>
													<List disablePadding>
														{iframeCategory.iframeList.map((iframe) =>
															!iframe.novaGuia ?
																<ListItem
																	key={iframe.iframeId}
																	disablePadding
																	onContextMenu={(event) => {this.handleIframeContextMenu(iframe, event)}}
																	secondaryAction={iframe.open ? <Tooltip title="Fechar"><IconButton edge="end" aria-label="fechar" onClick={() => this.props.closeIframe(iframe, this.props.location.pathname == `/i/${iframeCategory.uri}/${iframe.uri}`)}>
																		<CloseIcon />
																	</IconButton></Tooltip> : ""}>
																	<ListItemButton onClick={() => {this.props.navigate(`i/${iframeCategory.uri}/${iframe.uri}`)}}
																		sx={{ pl: 4 }}
																		selected={this.props.location.pathname == `/i/${iframeCategory.uri}/${iframe.uri}`}
																		>
																		<ListItemIcon>
																			<Icon sx={{ color: "red"}}>{iframe.icon}</Icon>
																		</ListItemIcon>
																		<ListItemText primary={iframe.titulo} sx={{wordBreak: "break-all"}}/>
																	</ListItemButton>
																</ListItem> : 
																<ListItem key={iframe.iframeId} disablePadding>
																	<ListItemButton onClick={() => window.open(iframe.iframe, "_blank")} sx={{ pl: 4}}>
																		<ListItemIcon>
																			<Icon sx={{ color: "red"}}>{iframe.icon}</Icon>
																		</ListItemIcon>
																		<ListItemText primary={iframe.titulo} sx={{wordBreak: "break-all"}}/>
																		<Icon>open_in_new</Icon>
																	</ListItemButton>
																</ListItem>
														)}
													</List>
												</Collapse>
											</List>) : <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box>}
										</List>
									</Collapse>
								</React.Fragment> : ""}
								{this.props.usuario.permissaoList.includes("Usuario.Read.All") ?
								<React.Fragment>
									<ListItemButton onClick={() => this.setState({usuarioModuleOpen: !this.state.usuarioModuleOpen})}>
										<ListItemIcon>
											<Icon>person</Icon>
										</ListItemIcon>
										<ListItemText primary={"Usuários"} sx={{wordBreak: "break-all"}}/>
										{this.state.usuarioModuleOpen ? <ExpandLess /> : <ExpandMore />}
									</ListItemButton>
									<Collapse in={this.state.usuarioModuleOpen}>
										<List component="div" disablePadding>
											<ListItem disablePadding>
												<ListItemButton onClick={() => {this.props.navigate(`usuarios`)}} sx={{ pl: 3 }}
													selected={this.props.location.pathname == `/usuarios`}
													>
													<ListItemIcon>
														<Icon>people</Icon>
													</ListItemIcon>
													<ListItemText primary={"Usuários"}/>
												</ListItemButton>
											</ListItem>
											<ListItem disablePadding>
												<ListItemButton onClick={() => {this.props.navigate(`usuarios/novo`)}} sx={{ pl: 3 }}
													selected={/^\/usuarios\/(\d|(novo))+$/.test(this.props.location.pathname)}
													>
													<ListItemIcon>
														<Icon>person_add</Icon>
													</ListItemIcon>
													<ListItemText primary={"Novo Usuário"}/>
												</ListItemButton>
											</ListItem>
										</List>
									</Collapse>
								</React.Fragment> : ""}
							</React.Fragment> : <Box width="100%" display="flex" justifyContent="center" m={3}><CircularProgress/></Box>}
				      </List> 
				    </Box>
		          </Drawer>
		          <IframeContextMenu open={this.state.iframeContextMenuOpen} iframe={this.state.iframeContextMenuIframe} x={this.state.iframeContextMenuX} y={this.state.iframeContextMenuY} closeIframeContextMenu={this.closeIframeContextMenu}/>
	          </React.Fragment>
			);
	}

}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	return <CustomNavigation navigate={navigate} location={location} {...props}/>
}