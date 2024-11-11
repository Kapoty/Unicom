import { useState, useRef } from "react";
import { usePerfilAtualQuery } from "../../queries/usePerfilQueries";
import PerfilChip from "../Perfil/PerfilChip";
import useAppStore from "../../state/useAppStore";
import { Avatar, CircularProgress, Divider, ListItem, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { Logout, ManageAccounts } from "@mui/icons-material";
import useAuthStore from "../../state/useAuthStore";
import { getFotoUrl } from "../../services/perfilService";
import { usePapelAtualQuery } from "../../queries/usePapelQueries";

const UsuarioLogadoChip = () => {

	const isMobile = useAppStore(s => s.isMobile);
	
	const logout = useAuthStore(s => s.logout);

	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const { data: perfil, isLoading: isPerfilLoading, error: perfilError } = usePerfilAtualQuery();
	const { data: papel, isLoading: isPapelLoading, error: papelError} = usePapelAtualQuery();

	return <>
		<PerfilChip
			perfil={perfil}
			isLoading={isPerfilLoading}
			error={!!perfilError}
			hideNome={isMobile}
			ref={menuRef}
			onClick={() => setMenuOpen(!menuOpen)}
			disabled={!perfil}
		/>
		<Menu
			anchorEl={menuRef.current}
			open={menuOpen}
			onClose={() => setMenuOpen(false)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
		>
			{perfil ? <ListItem>
				<ListItemIcon>
					<Avatar
						src={perfil?.foto ? getFotoUrl(perfil?.perfilId) : ''}
					>
						{perfil?.nome.charAt(0)}
					</Avatar>
				</ListItemIcon>
				<Stack>
					<Typography>{perfil?.nome}</Typography>
					<Typography variant="body2">{papel ? papel.nome : <CircularProgress/>}</Typography>
				</Stack>
			</ListItem> : <CircularProgress/>}
			<Divider sx={{mb: 1}} />
			<MenuItem>
				<ListItemIcon>
					<ManageAccounts/>
				</ListItemIcon>
				Minha Conta
			</MenuItem>
			<Divider />
			<MenuItem onClick={() => logout()}>
				<ListItemIcon>
					<Logout/>
				</ListItemIcon>
				Sair
			</MenuItem>
		</Menu>
	</>

}

export default UsuarioLogadoChip;