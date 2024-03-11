import React from "react";
import ReactDOM from "react-dom";

import '../assets/css/general.css';

import Config from "../config/Config";

import Box from '@mui/material/Box';

import CustomAppBar from "../components/CustomAppBar"
import CustomNavigation from "../components/CustomNavigation"
import CustomIframe from "../components/CustomIframe"
import IframeContextMenu from '../components/iframeContextMenu'

import { grey } from '@mui/material/colors';

import Typography from '@mui/material/Typography';

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

class MainRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			iframe: -1,
			iframes: null,
			iframeByIndex: {},
			iframeByPath: {},
			fullscreen: false,
			menuOpen: true,
			extra: "",
			iframeContextMenuOpened: false,
			iframeContextMenuIframe: null,
			iframeContextMenuX: 0,
			iframeContextMenuY: 0,
		};

		this.iframeBoxRef = React.createRef();

		this.setIframe = this.setIframe.bind(this);
		this.getIframes = this.getIframes.bind(this);
		this.toggleFullscreen = this.toggleFullscreen.bind(this);
		this.fullScreenChanged = this.fullScreenChanged.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.iframesRecursive = this.iframesRecursive.bind(this);
		this.toggleIframeSub = this.toggleIframeSub.bind(this);
		this.renderIframes = this.renderIframes.bind(this);
		this.closeIframe = this.closeIframe.bind(this);
		this.printIframe = this.printIframe.bind(this);
		this.openIframe = this.openIframe.bind(this);
		this.refreshIframe = this.refreshIframe.bind(this);
		this.openIframeByIndex = this.openIframeByIndex.bind(this);
		this.setIframeByLocation = this.setIframeByLocation.bind(this);
		this.openIframeRecursive = this.openIframeRecursive.bind(this);
		this.hiddenIframeRecursive = this.hiddenIframeRecursive.bind(this);
		this.openIframeContextMenu = this.openIframeContextMenu.bind(this);
		this.closeIframeContextMenu = this.closeIframeContextMenu.bind(this);
	}

	setIframe(iframe) {
		//this.state.iframeByIndex[iframe].opened = true
		//this.setState({iframe: iframe});
		this.props.navigate(this.state.iframeByIndex[iframe]['path'])
	}

	componentDidMount() {
		this.getIframes();
		document.body.onfullscreenchange = this.fullScreenChanged;
		window.onbeforeunload = s => "";
		this.disableDefaultContextMenu();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location !== prevProps.location) {
			this.setIframeByLocation()
		}
	}

	setIframeByLocation() {
		let path = this.props.location.pathname;
		let _extra = this.props.searchParams.get("extra")
		if (_extra == null)
			_extra = ""
		this.state.extra = decodeURI(_extra)
		if (path in this.state.iframeByPath) {
			//this.state.iframeByUri[uri].opened = true]
			this.openIframeRecursive(this.state.iframes, this.state.iframeByPath[path]['index'])
			this.setState({iframe: this.state.iframeByPath[path]["index"]})
		} else 
			this.setState({iframe: -1})
	}

	openIframeRecursive(sub, index) {
		let ret = false
		sub.forEach(iframe => {
			if (iframe['index'] == index) {
				iframe['opened'] = true
				iframe['current_hidden'] = false
				ret = true
			}
			if ("sub" in iframe) {
				let _open = this.openIframeRecursive(iframe["sub"], index)
				if (_open) {
					iframe['opened'] = true
					iframe['current_hidden'] = false
					ret = true
				}
			}
		})
		return ret
	}

	hiddenIframeRecursive(sub, index) {
		let ret = false
		sub.forEach(iframe => {
			if (iframe['index'] == index) {
				if (iframe['hidden']) {
					iframe['current_hidden'] = true
				}
				ret = true
			}
			if ("sub" in iframe) {
				let _open = this.hiddenIframeRecursive(iframe["sub"], index)
				if (_open) {
					if (iframe['hidden'])
						iframe['current_hidden'] = true
					ret = true
				}
			}
		})
		return ret
	}

	iframesRecursive(sub, index, path) {
		sub.forEach(iframe => {
			if (!iframe.active)
				return
			this.state.iframeByIndex[index] = iframe;
			iframe.index = index;
			if ("uri" in iframe) {
				iframe['path'] = path + "/" + iframe['uri']
			} else
				iframe['path'] = path + "/" + iframe['index']
			this.state.iframeByPath[iframe['path']] = iframe;
			index += 1;
			iframe.opened = false;
			iframe.current_hidden = false;
			if (iframe.hidden)
				iframe.current_hidden = true;
			if ("sub" in iframe) {
				index = this.iframesRecursive(iframe["sub"], index, iframe['path'])
			}
		})
		return index;
	}

	getIframes() {
		fetch(Config.assetsURL + "json/reports.json", {
			method: "GET",
			cache: "no-store"
		})
		.then((resp) => {
			if (resp.status != 200)
				setTimeout(this.getIframes, 5000);
			else resp.json().then((data) => {
				let iframes = data['reports'];
				this.iframesRecursive(iframes, 0, "");
				console.log(this.state.iframeByPath);
				this.state.iframes = iframes
				this.setState({iframes: iframes});
				this.setIframeByLocation();
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
			this.iframeBoxRef.current.requestFullscreen({navigationUI: "hide"});
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
				r.push(<CustomIframe iframe={iframe.iframe} opened={iframe.opened} display={this.state.iframe == iframe.index} key={iframe.index} extra={this.state.extra}></CustomIframe>)
				if ("sub" in iframe) {
					r.push(this.renderIframes(iframe["sub"]))
				}
			})
		return r;
	}

	closeIframe(iframe) {
		this.state.iframeByIndex[iframe].opened = false;
		if (this.state.iframeByIndex[iframe].hidden)
			this.hiddenIframeRecursive(this.state.iframes, iframe)
		if (this.state.iframe == iframe)
			this.state.iframe = -1
		this.setState({ìframes: this.state.iframes});
		this.props.navigate("/")
	}

	printIframe() {
		window.print();
	}

	openIframe() {
		window.open(this.state.iframeByIndex[this.state.iframe].iframe + this.state.extra, '_blank');
	}

	refreshIframe() {
		//window.print();
		document.querySelector(".currentIframe").src += ""
	}

	openIframeByIndex(index) {
		window.open(this.state.iframeByIndex[index].iframe, '_blank');
	}

	openIframeByIframe(iframe) {
		window.open(iframe.iframe, '_blank');
	}

	disableDefaultContextMenu() {
		if (document.addEventListener) {
			document.addEventListener('contextmenu', function(e) {
				e.preventDefault();
			}, false);
		} else {
			document.attachEvent('oncontextmenu', function() {
				window.event.returnValue = false;
			});
		}
	}

	openIframeContextMenu(iframe, x, y) {
		this.setState({iframeContextMenuIframe: iframe, iframeContextMenuOpened: true, iframeContextMenuX: x, iframeContextMenuY: y})
	}

	closeIframeContextMenu() {
		this.setState({iframeContextMenuOpened: false})
	}

	render() {
	
		return <React.Fragment>
		<Box sx={{display: "flex", flexDirection: "column", width: "100dvw", height: "100dvh"}}>
			<CustomAppBar menuOpen={this.state.menuOpen} display={1} toggleMenu={this.toggleMenu} fullscreen={this.state.fullscreen} toggleFullscreen={this.toggleFullscreen} printIframe={this.printIframe} iframeSelected={this.state.iframe != -1} openIframe={this.openIframe} refreshIframe={this.refreshIframe}></CustomAppBar>
			<Box sx={{display: "flex", flexGrow: 1, flexDirection: "row", height: "100dvh", overflow: "hidden"}}>
				<CustomNavigation menuOpen={this.state.menuOpen}
				toggleMenu={this.toggleMenu}
				closeIframe={this.closeIframe}
				toggleIframeSub={this.toggleIframeSub}
				setIframe={this.setIframe}
				iframes={this.state.iframes}
				currentIframe={this.state.iframe}
				openIframeByIndex={this.openIframeByIndex}
				openIframeContextMenu={this.openIframeContextMenu}
				></CustomNavigation>
				<Box id="iframeBox" ref={this.iframeBoxRef} sx={{flexGrow: 1}}>
					{this.renderIframes(this.state.iframes)}
					{this.state.iframe == -2 ? <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "100%", background: "transparent"}}>
		           		<Typography variant="h5" color="white"><b>Visualizar relatório</b></Typography>
		           		<Typography variant="body1" color={grey[300]}>Selecione um relatório no <b style={{color: "white"}}>menu lateral</b></Typography>
		           		<img style={{width: "240px", marginTop: "10px"}} src='/assets/image/ViewReport.png'/>
		           	</Box> : ""}
				</Box>
				<IframeContextMenu open={this.state.iframeContextMenuOpened} iframe={this.state.iframeContextMenuIframe} x={this.state.iframeContextMenuX} y={this.state.iframeContextMenuY} closeIframeContextMenu={this.closeIframeContextMenu} openIframeByIframe={this.openIframeByIframe}/>
			</Box>
		</Box>
		</React.Fragment>
	}

}

export default () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	return <MainRoute navigate={navigate} location={location} searchParams={searchParams}/>
}