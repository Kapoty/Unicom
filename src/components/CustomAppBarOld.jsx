import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';

export default class CustomAppBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			
		};

	}

	componentDidMount() {
	}

	render() {
	
		return (
		    <Box sx={{display: this.props.display ? "flex" : "None"}}>
		      <AppBar position="static" sx={{background: "black"}}>
		        <Toolbar sx={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
		        		<IconButton
		        		style={{display: !this.props.menuOpen ? "flex" : "flex"}}
			            size="large"
			            edge="start"
			            color="inherit"
			            aria-label="menu"
			            sx={{ mr: 2 }}
			            onClick={() => this.props.toggleMenu()}
			          >
			            <MenuIcon />
			         </IconButton>
		           	<Box sx={{display: "flex", flexGrow: 1, justifyContent: "left", alignItems: "center", gap: "10px", "&:hover": {cursor: "pointer"}}} onClick={() => {}}>
		           		<img style={{width: "auto", height: "24px"}} src='/assets/image/UniSystem_Logo.png'/>
		           	</Box>
		           	<Tooltip title="Recarregar">
			           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.refreshIframe()} disabled={!this.props.iframeSelected}>
				        	<Icon>refresh</Icon>
			      		</IconButton></span>
		      		</Tooltip>
		      		<Tooltip title="Abrir em nova aba">
			      		<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.openIframe()} disabled={!this.props.iframeSelected}>
				        	<Icon>open_in_new</Icon>
			      		</IconButton></span>
			      	</Tooltip>
			      	<Tooltip title="Imprimir">
			           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.printIframe()} disabled={!this.props.iframeSelected}>
				        	<Icon>printer</Icon>
			      		</IconButton></span>
		      		</Tooltip>
			      	<Tooltip title="Tela cheia">
			           	<span><IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.toggleFullscreen()} disabled={!this.props.iframeSelected}>
				        	<Icon>{this.props.fullscreen ? "fullscreen_exit" : "fullscreen"}</Icon>
			      		</IconButton></span>
			      	</Tooltip>
		        </Toolbar>
		      </AppBar>
		    </Box>
		  );
	}

}