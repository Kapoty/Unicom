import { Chip, Avatar, Badge, Skeleton } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useUsuarioPublicByUsuarioIdQuery } from "./UsuarioQueries";
import { getArquivoUrl } from "../perfil/PerfilService";
import { IUsuarioPublic } from "./Usuario";

export interface UsuarioChipProps {
	usuarioId?: number,
	usuario?: IUsuarioPublic,
	isLoading?: boolean,
	error?: boolean,
	onClick?: (() => void),
}

const UsuarioChip = ({ usuarioId, usuario, isLoading, error, onClick }: UsuarioChipProps) => {

	const { data, isLoading: isDataLoading, error: dataError } = useUsuarioPublicByUsuarioIdQuery(usuarioId);

	const usuarioData = usuario || data;
	const usuarioLoading = isLoading || isDataLoading;
	const usuarioError = (error || dataError) && !usuarioLoading;

	if (usuarioData)
		return <Chip
			onClick={onClick}
			avatar={
				<Avatar
					src={usuarioData?.perfilPrincipal?.foto ? getArquivoUrl(usuarioData?.perfilPrincipal?.perfilId, usuarioData?.perfilPrincipal?.foto) : ''}
				>
					{usuarioData?.perfilPrincipal?.nome.charAt(0)}
				</Avatar>
			}
			label={usuarioData?.perfilPrincipal?.nome}
		/>
	
	if (usuarioError)
		return <Chip color="error" avatar={<Avatar><ErrorIcon color="error" /></Avatar>} label="Usuário não identificado!" />
	
	return <Chip avatar={<Avatar><Skeleton variant="circular"/></Avatar>} label={<Skeleton variant="text" width={50}/>} />
}

export default UsuarioChip;