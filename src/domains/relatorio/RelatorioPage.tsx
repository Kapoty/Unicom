import { Close, OpenInNew, Refresh } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import CustomFab from "../../shared/components/Fab/CustomFab";
import useAppStore from "../../shared/state/useAppStore";
import { useRelatorioTokenByUsuariolId } from "../relatorioToken/RelatorioTokenQueries";
import { useUsuarioLogadoQuery } from "../usuario/UsuarioQueries";
import { IRelatorio } from "./Relatorio";

export interface RelatorioPageProps {
	relatorio: IRelatorio;
	open?: boolean;
	handleClose: () => void;
}

const RelatorioPage = ({ relatorio, open, handleClose }: RelatorioPageProps) => {

	const isMobile = useAppStore(s => s.isMobile);
	const empresa = useAppStore(s => s.empresa);
	const {data: usuario} = useUsuarioLogadoQuery();
	const {data: relatorioToken} = useRelatorioTokenByUsuariolId(usuario?.usuarioId);

	const [link, setLink] = useState<string | undefined>(undefined);
	const [refreshCount, setRefreshCount] = useState(0);

	const refresh = useCallback(() => {
		setRefreshCount((refreshCount) => refreshCount + 1);
		setLink(undefined);
	}, []);

	useEffect(() => {
		if (empresa && usuario && relatorioToken && !link) {
			let link = !isMobile ? relatorio.link : (relatorio?.linkMobile ?? relatorio.link);
			link = link.replace('{usuarioId}', '2'/*usuario?.usuarioId.toString() ?? ''*/);
			link = link.replace('{token}', 'token7'/*relatorioToken?.token ?? ''*/);
			link = link.replace('{cor}', empresa?.aparencia?.cor ?? '');
			setLink(link);
		}
	}, [link, empresa, usuario, relatorioToken]);

	return open && <DashboardContent
		fabs={[
			<CustomFab tooltip={{ title: 'Recarregar' }} key={0} onClick={refresh} ><Refresh /></CustomFab>,
			<CustomFab tooltip={{ title: 'Abrir em Nova Guia' }} key={1} onClick={() => window.open(link, '_blank')} ><OpenInNew /></CustomFab>,
			<CustomFab tooltip={{ title: 'Fechar' }} color='error' key={2} onClick={handleClose} ><Close /></CustomFab>
		]}
		verticalFabs
		>
		{link && <iframe key={refreshCount} src={link} style={{display: 'flex', flexGrow: 1}} />}
	</DashboardContent>
}

export default RelatorioPage;