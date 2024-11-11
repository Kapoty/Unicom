import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import useAppStore from "../../state/useAppStore";
import EmpresaSelect from "./EmpresaSelect";
import UsuarioLogadoChip from "./UsuarioLogadoChip";
import {Fullscreen, FullscreenExit, Menu as MenuIcon, MenuOpen as MenuOpenIcon, Notifications} from "@mui/icons-material";


const CustomAppBar = () => {

	const isMobile = useAppStore(s => s.isMobile);
	
	const drawerOpen = useAppStore(s => s.drawerOpen);
	const setDrawerOpen = useAppStore(s => s.setDrawerOpen);
	const fullscreen = useAppStore(s => s.fullscreen);
	const setFullscreen = useAppStore(s => s.setFullscreen);

	return (
		<AppBar position="static" elevation={0}>
			<Toolbar sx={{ overflow: "auto" }} /*variant="dense"*/ disableGutters>
				<Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} width={1} p={1}>
					<Tooltip arrow title = {`${drawerOpen ? 'Esconder' : 'Exibir'} Menu`}>
						<IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
							{drawerOpen ? <MenuOpenIcon/> : <MenuIcon/>}
						</IconButton>
					</Tooltip>

					<Link to="/" style={{height: 24}}>
						{!isMobile ? <img style={{ width: "auto", height: "24px" }} src='/assets/image/logo.png' /> :
							<img style={{ width: "auto", height: "24px" }} src='/assets/image/icon.png' />
						}
					</Link>

					<Divider orientation="vertical" variant="middle" flexItem />

					<EmpresaSelect/>

					<Box flexGrow={1}></Box>

					<Tooltip arrow title="Notificações">
						<IconButton onClick={() => {}}>
							<Notifications/>
						</IconButton>
					</Tooltip>

					<Tooltip arrow title = {!fullscreen ? 'Entrar em Tela Cheia' : 'Sair da Tela Cheia'}>
						<IconButton onClick={() => setFullscreen(!fullscreen)}>
							{fullscreen ? <FullscreenExit color="primary"/> : <Fullscreen/>}
						</IconButton>
					</Tooltip>

					<UsuarioLogadoChip/>

				</Stack>
			</Toolbar>
			<Divider />
		</AppBar>
	)
}

export default CustomAppBar;