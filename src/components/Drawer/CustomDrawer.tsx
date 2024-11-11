import { AddCard, CreditCard, Logout, ManageAccounts, Leaderboard } from "@mui/icons-material";
import { alpha, Box, Collapse, Divider, Drawer, Grow, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, useTheme } from "@mui/material";
import useAppStore from "../../state/useAppStore";
import { useRef, useState } from "react";

const CustomDrawer = () => {

	const [vendasOpen, setVendasOpen] = useState(false);
	const [vendasSelected, setVendasSeletected] = useState(false);

	const drawerOpen = useAppStore(s => s.drawerOpen);

	const menuRef = useRef<HTMLLIElement | null>(null);

	const theme = useTheme();

	return <Drawer
		variant="persistent"
		anchor="left"
		open={true}
		sx={{
			width: "auto",
			display: drawerOpen ? 'block' : 'none',
		}}
		PaperProps={{
			sx: {
				position: "relative",
				overflow: "hidden",
			},
		}}
	>
		<Stack gap={1} p={1}>
			<Tooltip title='Vendas' arrow placement="right">
				<Box ref={menuRef} >
					<IconButton onClick={() => setVendasOpen(!vendasOpen)} sx={{bgcolor: alpha(theme.palette.action.hover, theme.palette.action.hoverOpacity)}}>
						<CreditCard color="primary" />
					</IconButton>
				</Box>
			</Tooltip>
			<Tooltip title='Relatórios' arrow placement="right">
				<IconButton onClick={() => setVendasOpen(!vendasOpen)}>
					<Leaderboard/>
				</IconButton>
			</Tooltip>
		</Stack>
		<Menu
			anchorEl={menuRef.current}
			open={vendasOpen}
			onClose={() => setVendasOpen(false)}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
		>
			<MenuItem selected>
				<ListItemIcon>
					<CreditCard />
				</ListItemIcon>
				Vendas
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<AddCard />
				</ListItemIcon>
				Nova Venda
			</MenuItem>
		</Menu>
	</Drawer>
};

export default CustomDrawer;