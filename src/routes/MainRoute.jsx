import React from "react";
import ReactDOM from "react-dom";

import Config from "../config/Config";

import Box from '@mui/material/Box';

import CustomAppBar from "../components/CustomAppBar"
import CustomNavigation from "../components/CustomNavigation"
import CustomIframe from "../components/CustomIframe"

import { grey } from '@mui/material/colors';

import Typography from '@mui/material/Typography';

export default class MainRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			iframe: -1,
			iframes: null,
			iframeByIndex: {},
			fullscreen: false,
			menuOpen: true,
		};

		this.setIframe = this.setIframe.bind(this);
		this.getIframes = this.getIframes.bind(this);
		this.toggleFullscreen = this.toggleFullscreen.bind(this);
		this.fullScreenChanged = this.fullScreenChanged.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.iframesRecursive = this.iframesRecursive.bind(this);
		this.toggleIframeSub = this.toggleIframeSub.bind(this);
		this.renderIframes = this.renderIframes.bind(this);
		this.closeIframe = this.closeIframe.bind(this);
	}

	setIframe(iframe) {
		this.state.iframeByIndex[iframe].opened = true
		this.setState({iframe: iframe});
	}

	componentDidMount() {
		this.getIframes();
		document.body.onfullscreenchange = this.fullScreenChanged;
	}

	iframesRecursive(sub, index) {
		sub.forEach(iframe => {
			this.state.iframeByIndex[index] = iframe;
			iframe.index = index;
			index += 1;
			iframe.opened = false;
			if ("sub" in iframe) {
				index = this.iframesRecursive(iframe["sub"], index)
			}
		})
		return index;
	}

	getIframes() {
		fetch(Config.assetsURL + "json/reports.json", {
			method: "GET"
		})
		.then((resp) => {
			if (resp.status != 200)
				setTimeout(this.getIframes, 5000);
			else resp.json().then((data) => {
				let iframes = data['reports'];
				this.iframesRecursive(iframes, 0);
				console.log(iframes);
				console.log(this.state.iframeByIndex);
				this.setState({iframes: iframes});
			})
		})
		.catch((e) => {
			setTimeout(this.getIframes, 5000);
			console.log(e);
		});
	}

	toggleFullscreen() {
		if(document.fullscreenElement){ 
			document.exitFullscreen() 
			this.setState({fullscreen: false});
		} else { 
			document.body.requestFullscreen({navigationUI: "hide"});
			this.setState({fullscreen: true});
		} 
		
	}

	fullScreenChanged() {
		this.setState({fullscreen: document.fullscreenElement ? true : false});
	}

	toggleMenu() {
		this.setState({menuOpen: !this.state.menuOpen})
	}

	toggleIframeSub(index) {
		this.state.iframeByIndex[index].opened = !this.state.iframeByIndex[index].opened;
		this.setState({iframes: this.state.iframes})
	}

	renderIframes(sub) {
		let r = []
		if (sub != null)
			sub.forEach(iframe => {
				r.push(<CustomIframe iframe={iframe.iframe} opened={iframe.opened} display={this.state.iframe == iframe.index} key={iframe.index}></CustomIframe>)
				if ("sub" in iframe) {
					r.push(this.renderIframes(iframe["sub"]))
				}
			})
		return r;
	}

	closeIframe(iframe) {
		this.state.iframeByIndex[iframe].opened = false;
		if (this.state.iframe == iframe)
			this.state.iframe = -1
		this.setState({ìframes: this.state.iframes});
	}

	render() {
	
		return <React.Fragment>
		<Box sx={{display: "flex", flexDirection: "row", width: "100dvw", height: "100dvh"}}>
			<CustomNavigation menuOpen={this.state.menuOpen && !this.state.fullscreen} toggleMenu={this.toggleMenu} closeIframe={this.closeIframe} toggleIframeSub={this.toggleIframeSub} setIframe={this.setIframe} iframes={this.state.iframes} currentIframe={this.state.iframe}></CustomNavigation>
			<Box sx={{display: "flex", flexGrow: 1, flexDirection: "column", height: "100dvh"}}>
				<CustomAppBar menuOpen={this.state.menuOpen} display={!this.state.fullscreen} toggleMenu={this.toggleMenu} fullscreen={this.state.fullscreen} toggleFullscreen={this.toggleFullscreen}></CustomAppBar>
				<Box sx={{flexGrow: 1}}>
					{this.renderIframes(this.state.iframes)}
					{this.state.iframe == -1 ? <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "100%", background: "#111215"}}>
		           		<Typography variant="h5" color="white"><b>Visualizar relatório</b></Typography>
		           		<Typography variant="body1" color={grey[300]}>Selecione um relatório no <b style={{color: "white"}}>menu lateral</b></Typography>
		           		<img style={{width: "240px", marginTop: "10px"}} src='./assets/image/ViewReport.png'/>
		           	</Box> : ""}
				</Box>
			</Box>
		</Box>
		</React.Fragment>
	}

}