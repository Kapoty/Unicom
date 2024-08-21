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
import Stack from '@mui/material/Stack';

import api from "../services/api";

import IframeContextMenu from '../components/iframeContextMenu';
import UploadImage from '../components/UploadImage';

import { useNavigate, useLocation } from "react-router-dom";

const StyledList = (props) => {

	return <List
				component="div"
				disablePadding
			>
				{props.children.map((e, i) => e ? React.cloneElement(e, {depth: props?.depth ?? 0, key: i}) : null)}
			</List>
}

const StyledListItem = (props) => {

	return <React.Fragment>
				<ListItem
					disablePadding
					onContextMenu={props.onContextMenu}
					secondaryAction={props.secondaryAction}
					sx={{
						"& .MuiListItemSecondaryAction-root": {
							pr: "4px"
						}
					}}
				>
					<ListItemButton
						onClick={props.onClick}
						selected={props.selected}
						sx={{
							pl: (theme) => parseInt(theme.spacing(2).replace("px", "")) + 32 * props.depth + "px",
							position: "relative",
							"&::before": (props.depth > 0 && !props.category) ? {
								display: "block",
								content: "''",
								width: "1px",
								height: "100%",
								backgroundColor: props.selected ? "primary.main" : "divider",
								position: "absolute",
								left: (theme) => parseInt(theme.spacing(2).replace("px", "")) + 32 * props.depth - 21 + "px",
							} : {},
						}}
					>
						{props.category && (props.categoryOpen ?
							<ExpandMore
								sx={{
									pr: 1,
									color: "primary.main",
									transform: "rotate(0deg)",
									transformOrigin: "12px 12px",
									transition: "transform 0.25s",
								}}
							/>
							:
							<ExpandMore
								sx={{
									pr: 1,
									color: "divider",
									transform: "rotate(-90deg)",
									transformOrigin: "12px 12px",
									transition: "transform 0.25s",
								}}
							/>
						)}
						<ListItemIcon sx={{minWidth: 24, pr: 1}}>
							{props.iconFilename ? <UploadImage filename={props.iconFilename} style={{width: 24, height: 24}}/> : <Icon color="primary">{props.icon}</Icon>}
						</ListItemIcon>
						<ListItemText primary={props.primary} sx={{wordBreak: "break-all", pr: 1}}/>
						{props.secondaryIcon && <Icon color="primary">{props.secondaryIcon}</Icon>}
					</ListItemButton>
				</ListItem>
				{props.category && <Collapse in={props.categoryOpen}>
						<StyledList depth={props.depth + 1}>
							{props.children}
						</StyledList>
					</Collapse>}
			</React.Fragment>

}

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
			minhaEquipeModuleOpen: false,
			equipeModuleOpen: false,
			vendaModuleOpen: false,
			automacoesModuleOpen: false,
		}

		this.handleIframeContextMenu = this.handleIframeContextMenu.bind(this);
		this.closeIframeContextMenu = this.closeIframeContextMenu.bind(this);

		this.openModulesByLocation = this.openModulesByLocation.bind(this);
	}

	componentDidMount() {
		this.openModulesByLocation();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location !== prevProps.location) {
			this.openModulesByLocation();
		}
	}

	openModulesByLocation() {
		if (this.props.location.pathname.startsWith("/i"))
			this.setState({iframeListOpen: true});
		if (this.props.location.pathname.startsWith("/usuarios"))
			this.setState({usuarioModuleOpen: true});
		if (this.props.location.pathname.startsWith("/minha-equipe"))
			this.setState({minhaEquipeModuleOpen: true});
		if (this.props.location.pathname.startsWith("/equipes"))
			this.setState({equipeModuleOpen: true});
		if (this.props.location.pathname.startsWith("/vendas"))
			this.setState({vendaModuleOpen: true});
		if (this.props.location.pathname.startsWith("/automacoes"))
			this.setState({automacoesModuleOpen: true});
	}

	handleIframeContextMenu(iframe, event) {
		event.preventDefault();
		this.setState({iframeContextMenuIframe: iframe, iframeContextMenuOpen: true, iframeContextMenuX: event.clientX, iframeContextMenuY: event.clientY})
	}

	closeIframeContextMenu() {
		this.setState({iframeContextMenuOpen: false})
	}

	render() {
		return <React.Fragment>
			<Drawer
				variant="persistent"
				anchor="left"
				open={this.props.menuOpen}
				sx={{
					width: this.props.menuOpen ? "350px" : "0px"
				}}
				PaperProps={{
					sx: {
						position: "relative",
					},
				}}
			>
				<Box sx={{ minWidth: 325}}>
					<StyledList>

						<StyledListItem
							onClick={() => {this.props.navigate(`/`)}}
							selected={this.props.location.pathname == "/"}
							icon="home"
							primary="Início"
						/>

						{this.props.usuario?.permissaoList?.includes("CADASTRAR_VENDAS") &&
							<StyledListItem
								onClick={() => this.setState({vendaModuleOpen: !this.state.vendaModuleOpen})}
								icon="credit_card"
								primary="Vendas"
								category
								categoryOpen={this.state.vendaModuleOpen}
							>
								<StyledListItem
									onClick={(() => {this.props.navigate(`vendas`)})}
									icon="credit_card"
									primary="Vendas"
									selected={this.props.location.pathname == `/vendas`}
								/>
								<StyledListItem
									onClick={(() => {this.props.navigate(`vendas/novo`)})}
									icon="add_card"
									primary="Nova Venda"
									selected={/^\/vendas\/(\d|(novo))+$/.test(this.props.location.pathname)}
								/>
							</StyledListItem>
						}

						{this.props.usuario.permissaoList.includes("VER_MODULO_IFRAME") &&
							<StyledListItem
								onClick={() => this.setState({iframeListOpen: !this.state.iframeListOpen})}
								icon="leaderboard"
								primary="Relatórios"
								category
								categoryOpen={this.state.iframeListOpen}
							>
								{(this.props.iframeCategoryList ?? []).map((iframeCategory) =>
									<StyledListItem key={iframeCategory.iframeCategoryId}
										onClick={() => this.props.toggleIframeCategory(iframeCategory)}
										icon={iframeCategory.icon}
										iconFilename={iframeCategory.iconFilename}
										primary={iframeCategory.titulo}
										category
										categoryOpen={iframeCategory.open}
										key={iframeCategory.iframeCategoryId}
									>
										{iframeCategory.iframeList.map((iframe) =>
											!iframe.novaGuia ?
												<StyledListItem
													key={iframe.iframeId}
													onClick={() => {this.props.navigate(`i/${iframeCategory.uri}/${iframe.uri}`)}}
													onContextMenu={(event) => {this.handleIframeContextMenu(iframe, event)}}
													secondaryAction={
														iframe.open && <Tooltip title="Fechar">
																			<IconButton edge="end" aria-label="fechar" onClick={() => this.props.closeIframe(iframe, this.props.location.pathname == `/i/${iframeCategory.uri}/${iframe.uri}`)}>
																				<CloseIcon color="primary"/>
																			</IconButton>
																		</Tooltip>
													}
													icon={iframe.icon}
													iconFilename={iframe.iconFilename}
													primary={iframe.titulo}
													selected={this.props.location.pathname == `/i/${iframeCategory.uri}/${iframe.uri}`}
												/> :
												<StyledListItem
													key={iframe.iframeId}
													onClick={() => window.open(iframe.iframe, "_blank")}
													secondaryIcon="open_in_new"
													icon={iframe.icon}
													iconFilename={iframe.iconFilename}
													primary={iframe.titulo}
												/>
										)}
									</StyledListItem>
								)}
							</StyledListItem>
						}

						{this.props.usuario?.permissaoList?.includes("AUTOMACOES") &&
							<StyledListItem
								onClick={() => this.setState({automacoesModuleOpen: !this.state.automacoesModuleOpen})}
								icon="smart_toy"
								primary="Automações"
								category
								categoryOpen={this.state.automacoesModuleOpen}
							>
								<StyledListItem
									onClick={() => {this.props.navigate(`automacoes/faturas`)}}
									icon="request_quote"
									primary="Faturas"
									selected={this.props.location.pathname == `/automacoes/faturas`}
								/>
								<StyledListItem
									onClick={() => {this.props.navigate(`automacoes/status`)}}
									icon="info"
									primary="Status"
									selected={this.props.location.pathname == `/automacoes/status`}
								/>
							</StyledListItem>
						}

						{this.props.usuario?.permissaoList?.includes("VER_MODULO_MINHA_EQUIPE") &&
							<StyledListItem
								onClick={() => this.setState({minhaEquipeModuleOpen: !this.state.minhaEquipeModuleOpen})}
								icon="groups"
								primary="Minhas Equipes"
								category
								categoryOpen={this.state.minhaEquipeModuleOpen}
							>
								{(this.props.minhaEquipeList ?? []).map((equipe) =>
									<StyledListItem
										key={equipe.equipeId}
										onClick={() => {this.props.navigate(`minhas-equipes/${equipe.equipeId}`)}}
										icon={equipe.icon ?? "groups"}
										iconFilename={equipe.iconFilename}
										primary={equipe.nome}
										selected={this.props.location.pathname == `/minhas-equipes/${equipe.equipeId}`}
									/>
								)}
							</StyledListItem>
						}

						{this.props.usuario?.permissaoList?.includes("CADASTRAR_USUARIOS") &&
							<StyledListItem
								onClick={() => this.setState({usuarioModuleOpen: !this.state.usuarioModuleOpen})}
								icon="person"
								primary="Usuários"
								category
								categoryOpen={this.state.usuarioModuleOpen}
							>
								<StyledListItem
									onClick={() => {this.props.navigate(`usuarios`)}}
									icon="person"
									primary="Usuários"
									selected={this.props.location.pathname == `/usuarios`}
								/>
								<StyledListItem
									onClick={() => {this.props.navigate(`usuarios/novo`)}}
									icon="person_add"
									primary="Novo Usuário"
									selected={/^\/usuarios\/(\d|(novo))+$/.test(this.props.location.pathname)}
								/>
							</StyledListItem>
						}

						{this.props.usuario?.permissaoList?.includes("CADASTRAR_EQUIPES") &&
							<StyledListItem
								onClick={() => this.setState({equipeModuleOpen: !this.state.equipeModuleOpen})}
								icon="groups"
								primary="Equipes"
								category
								categoryOpen={this.state.equipeModuleOpen}
							>
								<StyledListItem
									onClick={() => {this.props.navigate(`equipes`)}}
									icon="groups"
									primary="Equipes"
									selected={this.props.location.pathname == `/equipes`}
								/>
								<StyledListItem
									onClick={() => {this.props.navigate(`equipes/novo`)}}
									icon="group_add"
									primary="Nova Equipe"
									selected={/^\/equipes\/(\d|(novo))+$/.test(this.props.location.pathname)}
								/>
							</StyledListItem>
						}

					</StyledList>
				</Box>
			</Drawer>
			<IframeContextMenu open={this.state.iframeContextMenuOpen} iframe={this.state.iframeContextMenuIframe} x={this.state.iframeContextMenuX} y={this.state.iframeContextMenuY} closeIframeContextMenu={this.closeIframeContextMenu}/>
		</React.Fragment>
	}
}

export default (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	return <CustomNavigation navigate={navigate} location={location} {...props}/>
}