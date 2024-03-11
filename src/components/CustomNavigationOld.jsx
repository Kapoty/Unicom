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

export default class CustomNavigation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			"value": 0
		}
	}

	componentDidMount() {
	}

	handleContextMenu(iframe, event) {
		this.props.openIframeContextMenu(iframe, event.clientX, event.clientY)
	}

	renderIframes(sub, depth) {
		let r = []

		if (sub != null)
			sub.forEach(iframe => {
				if (!iframe.active || iframe.current_hidden)
					return
				if ("iframe" in iframe) {
					if (!("new_tab" in iframe) || ("new_tab" in iframe && !iframe["new_tab"]))
						r.push(<ListItem key={iframe.index} disablePadding secondaryAction={iframe.opened ? <Tooltip title="Fechar"><IconButton edge="end" aria-label="fechar" onClick={() => this.props.closeIframe(iframe.index)}>
		                      <CloseIcon />
		                    </IconButton></Tooltip>
		                  : ""} onContextMenu={(event) => {this.handleContextMenu(iframe, event)}}>
			            <ListItemButton selected={this.props.currentIframe == iframe.index} onClick={() => this.props.setIframe(iframe.index)}>
			              <ListItemIcon sx={{ pl: depth}}>
			              	{"customIcon" in iframe ? <img className="customIcon" src={'/assets/image/custom_icons/' + iframe.customIcon}/> :
			                <Icon>{iframe.icon}</Icon>}
			              </ListItemIcon>
			              <ListItemText primary={iframe.title} sx={{wordBreak: "break-all"}}/>
			            </ListItemButton>		            
			          </ListItem>)
					else
						r.push(<ListItem key={iframe.index} disablePadding>
				            <ListItemButton onClick={() => this.props.openIframeByIndex(iframe.index)}>
				              <ListItemIcon sx={{ pl: depth}}>
				              	{"customIcon" in iframe ? <img className="customIcon" src={'/assets/image/custom_icons/' + iframe.customIcon}/> :
				                <Icon>{iframe.icon}</Icon>}
				              </ListItemIcon>
				              <ListItemText primary={iframe.title} sx={{wordBreak: "break-all"}}/>
				              <Icon>open_in_new</Icon>
				            </ListItemButton>
			          </ListItem>)
				}
				if ("sub" in iframe) {
					 r.push(
					 	<Box key={iframe.index}>
						 	<ListItemButton onClick={() => this.props.toggleIframeSub(iframe.index)}>
					        <ListItemIcon sx={{ pl: depth}}>
					          {"customIcon" in iframe ? <img className="customIcon" src={'/assets/image/custom_icons/' + iframe.customIcon}/> :
		                		<Icon>{iframe.icon}</Icon>}
					        </ListItemIcon>
					        <ListItemText primary={iframe.title} sx={{wordBreak: "break-all"}}/>
					        {iframe.opened ? <ExpandLess /> : <ExpandMore />}
					      </ListItemButton>
						 	<Collapse in={iframe.opened} timeout="auto" unmountOnExit><List component="div" disablePadding>{this.renderIframes(iframe["sub"], depth+1)}</List></Collapse>
						 </Box>
					 	)
				}
			})

      	return r;
	}

	render() {
		return (
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
			    	{/*<Box sx={{display: "flex", justifyContent: "flex-end", padding: "10px"}}>
			          <IconButton onClick={this.props.toggleMenu}>
			             <ChevronLeftIcon />
			          </IconButton>
			        </Box>*/}
			      <List>
			      {this.renderIframes(this.props.iframes, 0)}
			      </List>
			    </Box>
	          </Drawer>
			);


		/*return (
		    <Box>
		      <BottomNavigation
		      	sx={{position: "relative"}}
		        showLabels
		        value={this.state.value}
		        onChange={(event, newValue) => {
		          this.setState({"value": newValue})
		          this.props.setIframe(newValue)
		        }}
		      >
		      {this.props.iframes == null ? "" :
		      this.props.iframes.map((iframe, i) => iframe.active ? <BottomNavigationAction key={i} label={iframe.title} icon={<Icon>{iframe.icon}</Icon>} /> : "")}
		      </BottomNavigation>
		    </Box>
		  );*/
	}

}