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

	const [vendasOpen, setVendasOpen] = useState(false);

	const { data: usuarioLogado } = useUsuarioLogadoQuery();

	const drawerOpen = useAppStore(s => s.drawerOpen);

	const {data: perfil} = usePerfilAtualQuery();

	const menuRef = useRef<HTMLLIElement | null>(null);

	const theme = useTheme();

	return <Drawer
		variant="persistent"
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
	>
		<DrawerMenu/>

		{/*<Routes>
			<Route path="/e/:empresaId/*" element={<>
				{perfil && <>
				<Stack gap={1} p={1}>
					<Tooltip title='Vendas' arrow placement="right">
						<Box ref={menuRef} >
							<IconButton onClick={() => setVendasOpen(!vendasOpen)} sx={{ bgcolor: alpha(theme.palette.action.hover, theme.palette.action.hoverOpacity) }}>
								<CreditCard color="primary" />
							</IconButton>
						</Box>
					</Tooltip>
					<Tooltip title='Relatórios' arrow placement="right">
						<IconButton onClick={() => setVendasOpen(!vendasOpen)}>
							<Leaderboard />
						</IconButton>
					</Tooltip>
					{usuarioLogado?.isAdmin && <>
						<Divider>
							<AdminPanelSettings fontSize="small" color="error" />
						</Divider>
						<Tooltip title='Contrato' arrow placement="right">
							<IconButton onClick={() => setVendasOpen(!vendasOpen)}>
								<Receipt />
							</IconButton>
						</Tooltip>
					</>}
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
					{usuarioLogado?.isAdmin && <Box>
						<Divider>
							<AdminPanelSettings fontSize="small" color="error" />
						</Divider>
						<MenuItem>
							<ListItemIcon>
								<FindInPage />
							</ListItemIcon>
							Depurar Venda
						</MenuItem>
					</Box>}
				</Menu>
			</>}
			</>} />
			{usuarioLogado?.isAdmin && <Route path="admin/*" element={<>

				<Stack gap={1} p={1}>
					<Tooltip title='Empresas' arrow placement="right">
						<IconButton onClick={() => {} }>
							<Apartment color="primary" />
						</IconButton>
					</Tooltip>
				</Stack>

			</>} />}
		</Routes>*/}

	</Drawer>
};

export default CustomDrawer;