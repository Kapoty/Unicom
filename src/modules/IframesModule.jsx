import React from "react";

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { useParams, useLocation } from 'react-router-dom';

class IframesModule extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<React.Fragment>
				{this.props.iframeCategoryList !== null ? this.props.iframeCategoryList.map((iframeCategory) => iframeCategory.iframeList.map((iframe) =>
					<div key={iframe.iframeId} style={{display: this.props.location.pathname == `/i/${iframeCategory.uri}/${iframe.uri}` ? "Flex" : "None", width: "100%", height: "100%"}}>
						{iframe.open ? <iframe style={{width: "100%", height: "100%"}} src={iframe.iframe} className={this.props.location.pathname == `/i/${iframeCategory.uri}/${iframe.uri}` ? "currentIframe" : ""}></iframe> : ""}
					</div>
					)) : ""}
		    </React.Fragment>
		  );
	}

}

export default (props) => {
	const params = useParams();
	const location = useLocation()
	return <IframesModule params={params} location={location} {...props}/>
}