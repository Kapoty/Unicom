import { Alert, CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import useEmpresaIdParam from "../../hooks/useEmpresaIdParam";
import { useUsuarioLogadoQuery } from "../../../domains/usuario/UsuarioQueries";
import browserHistory from "../../utils/browserHistory";
import EmpresaChip from "../../../domains/empresa/EmpresaChip";
import { useEmpresasByUsuarioQuery } from "../../../domains/empresa/EmpresaQueries";

const EmpresaSelect = () => {

	const { data: usuarioLogado } = useUsuarioLogadoQuery();

	const { data: empresas, isLoading: isEmpresasLoading, error: empresasError } = useEmpresasByUsuarioQuery(usuarioLogado?.usuarioId);

	const empresaId = useEmpresaIdParam();

	/*const renderEmpresasItems = useCallback((empresas: EmpresaPublic[]) => {
		let items = [];
		let currentGrupo;
		let empresasSorted = empresas.sort((e1, e2) => e1.grupo.nome.localeCompare(e2.grupo.nome));
		for (let i=0; i < empresasSorted.length; i++) {
			let empresa = empresasSorted[i]
			if (currentGrupo !== empresa.grupo.nome) {
				currentGrupo = empresa.grupo.nome
				items.push(<ListSubheader key={currentGrupo}>{currentGrupo}</ListSubheader>)
			}
			items.push(<MenuItem key={empresa.empresaId} value={empresa.empresaId}><EmpresaChip empresa={empresa}/></MenuItem>)
		}
		return items;
	}, [empresas])*/

	return <FormControl error={!!empresasError}>
		<Select
			value={empresaId ?? ''}
			variant="standard"
			displayEmpty
			autoWidth
			renderValue={(value) => value ? <EmpresaChip empresaId={value}/> : <em>Empresa</em>}
		>
			{empresas ? empresas.map(empresa => <MenuItem
				key={empresa.empresaId}
				value={empresa.empresaId}
				onClick={() => browserHistory.push(`/e/${empresa.empresaId}`)}
			>
				<EmpresaChip empresa={empresa} />
			</MenuItem>) :
				isEmpresasLoading ? <CircularProgress /> :
					<Alert severity="error">Falha ao buscar empresas</Alert>
			}
		</Select>
	</FormControl>

}

export default EmpresaSelect;