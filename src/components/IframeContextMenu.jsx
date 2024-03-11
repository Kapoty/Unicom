import React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList'
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Icon from '@mui/material/Icon';

export default class IframeContextMenu extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
	
		return (
			<div>
		      <Menu
		        anchorReference="anchorPosition"
		        anchorPosition={{
			    	top: this.props.y,
			    	left: this.props.x   
			    }}
		        open={this.props.open}
		        onClose={this.props.closeIframeContextMenu}
		      >
		      	{(this.props.iframe) ? <MenuList dense>
		      		<MenuItem onClick={() => {window.open(this.props.iframe.iframe, "_blank"); this.props.closeIframeContextMenu()}}>
		      			<ListItemIcon><Icon>open_in_new</Icon></ListItemIcon>
		      			<ListItemText>Abrir em nova aba</ListItemText>
		      		</MenuItem>

		      		</MenuList>: ""}
		        
		      </Menu>
		   </div>	
		);
	}

}