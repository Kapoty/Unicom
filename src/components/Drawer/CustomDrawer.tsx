import { AddCard, CreditCard, Logout, ManageAccounts, Leaderboard, AdminPanelSettings, Receipt, FindInPage, Apartment } from "@mui/icons-material";
import { alpha, Box, CircularProgress, Collapse, Divider, Drawer, Fade, Grow, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, useTheme } from "@mui/material";
import useAppStore from "../../state/useAppStore";
import { useRef, useState } from "react";
import { useUsuarioLogadoQuery } from "../../queries/useUsuarioQueries";
import { Routes, Route } from "react-router-dom";
import { usePerfilAtualQuery } from "../../queries/usePerfilQueries";
import { TransitionGroup } from "react-transition-group";
import DrawerMenu from "./DrawerMenu";

const CustomDrawer = () => {

	const drawerOpen = useAppStore(s => s.drawerOpen);
	//const setDrawerOpen = useAppStore(s => s.setDrawerOpen);
	//const isMobile = useAppStore(s => s.isMobile);

	return <Drawer
		variant="permanent" //{isMobile && false ? "temporary" : "permanent"}
		anchor="left"
		open={true}
		sx={{
			width: "56px",
			display: drawerOpen ? 'block' : 'none',
		}}
		PaperProps={{
			sx: {
				position: "relative",
				overflow: "hidden",
			},
		}}
		//onClose={() => setDrawerOpen(false)}
	>
		<DrawerMenu/>
	</Drawer>
};

export default CustomDrawer;