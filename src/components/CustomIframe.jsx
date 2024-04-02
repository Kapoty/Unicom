import React from "react";

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default class CustomIframe extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
	
		return (
			<React.Fragment>
				<div style={{display: this.props.display ? "Flex" : "None", width: "100%", height: "100%"}}>
					{this.props.opened ? <iframe style={{width: "100%", height: "100%"}} src={this.props.iframe + this.props.extra} className={this.props.display ? "currentIframe" : ""}></iframe> : ""}
				</div>
		    </React.Fragment>
		  );
	}

}