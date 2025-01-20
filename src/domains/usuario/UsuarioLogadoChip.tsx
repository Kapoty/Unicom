import { useState, useRef } from "react";
import { Avatar, CircularProgress, Divider, ListItem, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { Logout, ManageAccounts } from "@mui/icons-material";
import useAppStore from "../../shared/state/useAppStore";
import useAuthStore from "../auth/useAuthStore";
import { usePapelAtualQuery } from "../papel/PapelQueries";
import PerfilChip from "../perfil/PerfilChip";
import { usePerfilAtualQuery } from "../perfil/PerfilQueries";
import { useUsuarioLogadoQuery } from "./UsuarioQueries";
import { getArquivoUrl } from "../perfil/PerfilService";
import browserHistory from "../../shared/utils/browserHistory";

const UsuarioLogadoChip = () => {

	const isMobile = useAppStore(s => s.isMobile);
	
	const logout = useAuthStore(s => s.logout);

	const {data: usuarioLogado} = useUsuarioLogadoQuery();

	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const { data: perfil, isLoading: isPerfilLoading, error: perfilError } = usePerfilAtualQuery();
	const { data: papel, isLoading: isPapelLoading, error: papelError} = usePapelAtualQuery();

	const handleMeuUsuario = () => {
		browserHistory.push(`/e/${usuarioLogado?.empresaPrincipalId}/usuarios/me`);
		setMenuOpen(false);
	}

	return <>
		<PerfilChip
			perfil={perfil}
			isLoading={isPerfilLoading}
			error={!!perfilError}
			avatarOnly={isMobile}
			ref={menuRef}
			onClick={() => setMenuOpen(!menuOpen)}
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
						src={perfil?.foto ? getArquivoUrl(perfil.perfilId, perfil.foto) : ''}
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
			<MenuItem onClick={() => handleMeuUsuario()}>
				<ListItemIcon>
					<ManageAccounts/>
				</ListItemIcon>
				Meu Usuário
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