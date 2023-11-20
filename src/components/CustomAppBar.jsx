import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Icon from '@mui/material/Icon';

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
		        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
		        	<Box>
		        		<IconButton
		        		style={{display: !this.props.menuOpen ? "block" : "none"}}
			            size="large"
			            edge="start"
			            color="inherit"
			            aria-label="menu"
			            sx={{ mr: 2 }}
			            onClick={() => this.props.toggleMenu()}
			          >
			            <MenuIcon />
			         </IconButton>
		        	</Box>
		           	<Box sx={{display: "flex", flexGrow: 1, justifyContent: "left", alignItems: "center", gap: "10px", "&:hover": {cursor: "pointer"}}} onClick={() => window.location.reload()}>
		           		<img style={{width: "auto", height: "24px"}} src='./assets/image/UniSystem_Logo.png'/>
		           	</Box>
		           	<IconButton sx={{color: "#FFFFFF"}} onClick={() => this.props.toggleFullscreen()}>
			        	<Icon>{this.props.fullscreen ? "fullscreen_exit" : "fullscreen"}</Icon>
		      		</IconButton>
		        </Toolbar>
		      </AppBar>
		    </Box>
		  );
	}

}