import { useCallback, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import useAppStore from "../../shared/state/useAppStore";
import { usePerfilAtualQuery } from "../perfil/PerfilQueries";
import RelatorioPage from "./RelatorioPage";
import { useRelatoriosByPerfilQuery } from "./RelatorioQueries";
import { Stack } from "@mui/material";
import browserHistory from "../../shared/utils/browserHistory";

const RelatoriosPage = () => {

	const empresa = useAppStore(s => s.empresa);
	const { data: perfilAtual } = usePerfilAtualQuery();
	const { data: relatorios } = useRelatoriosByPerfilQuery(perfilAtual?.perfilId);

	const [relatoriosOpened, setRelatoriosOpened] = useState<Set<String>>(new Set());

	const uri = useMatch("/e/:empresaId/relatorios/:uri")?.params?.uri;

	useEffect(() => {
		setRelatoriosOpened(new Set(uri ? [uri] : []));
	}, [empresa?.empresaId]);

	useEffect(() => {
		if (uri) {
			relatoriosOpened.add(uri);
			setRelatoriosOpened(new Set(relatoriosOpened));
		}
	}, [uri]);

	const handleClose = useCallback((uri: string) => {
		relatoriosOpened.delete(uri);
		setRelatoriosOpened(new Set(relatoriosOpened));
		browserHistory.push(`/e/${empresa?.empresaId}`);
	}, [empresa])

	return <>
		{relatorios?.map(relatorio => <Stack key={relatorio.uri} flexGrow={1} display={(uri == relatorio.uri) ? 'flex' : 'none'}>
			<RelatorioPage
				relatorio={relatorio}
				open={relatoriosOpened.has(relatorio.uri)}
				handleClose={() => handleClose(relatorio.uri)}
			/>
		</Stack>)}
	</>
}

export default RelatoriosPage;