import { Add, Edit, Refresh } from "@mui/icons-material"
import { GridActionsCellItem, GridColDef, GridColumnGroupingModel, useGridApiRef } from "@mui/x-data-grid-premium"
import { flatten } from "flat"
import { useSnackbar } from "notistack"
import { useCallback, useEffect, useMemo, useState } from "react"
import DashboardContent from "../../shared/components/Dashboard/DashboardContent"
import CustomDataGrid from "../../shared/components/DataGrid/CustomDataGrid"
import CustomFab from "../../shared/components/Fab/CustomFab"
import browserHistory from "../../shared/utils/browserHistory"
import { IDatagridVisao } from "../datagridVisao/DatagridVisao"
import { Box, Chip, Icon } from "@mui/material"
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam"
import PerfilChip from "./PerfilChip"
import { usePerfisAdminByEmpresaIdQuery } from "./PerfilQueries"
import EmpresaChip from "../empresa/EmpresaChip"
import { useEmpresaLimitesQuery } from "../empresa/EmpresaQueries"
import { IPerfilAdmin } from "./PerfilUsuarioShared"

const columns: GridColDef<IPerfilAdmin>[] = [
	{ field: 'perfilId', headerName: 'ID', type: 'number', width: 100 },
	{
		field: 'nome', headerName: 'Nome', width: 200, renderCell: (params) =>
			<PerfilChip
				perfil={(params.row as any).perfil}
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/perfis/${params.row.perfilId}`)}
			/>
	},
	{ field: 'ativo', headerName: 'Ativo', type: 'boolean', width: 150 },
	{ field: 'usuario.usuarioId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'usuario.nomeCompleto', headerName: 'Nome Completo', width: 200 },
	{
		field: 'usuario.empresaPrincipal.nome', headerName: 'Empresa Principal', width: 150, renderCell: (params) =>
			(params.row as any)?.perfil?.usuario ? <EmpresaChip
				empresa={(params.row as any)?.perfil?.usuario?.empresaPrincipal}
			/> : ''
	},
	{ field: 'aceito', headerName: 'Aceito', type: 'boolean', width: 150 },
	{ field: 'papelNome', headerName: 'Nome', width: 150 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/perfis/${params.row.perfilId}`)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'perfil',
		headerName: "Perfil",
		children: [{ field: 'perfilId' }, { field: 'nome' }, { field: 'ativo' }],
		freeReordering: true,
	},
	{
		groupId: 'usuario',
		headerName: "Usuário",
		children: [{ field: 'usuario.usuarioId' }, { field: 'aceito' }, { field: 'usuario.nomeCompleto' }, { field: 'usuario.empresaPrincipal.nome' }],
		freeReordering: true,
	},
	{
		groupId: 'papel',
		headerName: "Papel",
		children: [{ field: 'papelNome' }],
		freeReordering: true,
	},
	{
		groupId: 'Ações',
		headerName: "Ações",
		children: [{ field: 'actions' }],
		freeReordering: true,
	},
];

const allColumnsVisibilityModel = columns.reduce((acc: any, val: any) => {
	acc[val.field] = true;
	return acc;
}, {} as Record<string, boolean>);

const visoesPadrao: IDatagridVisao[] = [
	{
		nome: 'Padrão',
		tipo: 'PADRAO',
		state: {
			columns: {
				columnVisibilityModel: {
					...allColumnsVisibilityModel
				}
			}
		},
	}
]

const ListaPerfisPage = () => {

	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();

	const { data, refetch } = usePerfisAdminByEmpresaIdQuery(empresaId);
	const [perfis, setPerfis] = useState<IPerfilAdmin[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return perfis?.map(perfil => {
			return {
				...Object.assign({}, flatten(perfil)),
				id: perfil.perfilId,
				perfil: perfil,
			}
		}
		) ?? []
	}, [perfis]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setPerfis(result.data);
		} catch (error) {
			enqueueSnackbar('Falha ao atualizar!', { variant: 'error' });
		} finally {
			setIsUpdating(false);
		}
	}, []);

	useEffect(() => {
		update();
	}, []);

	const {data: limites} = useEmpresaLimitesQuery(empresaId);

	return <DashboardContent
		titulo={`Perfis`}
		subtitulo={`${limites?.usuariosAtivos ?? '?'} de ${limites?.limiteUsuarios ?? '?'} perfis ativos`}
		fabs={[
			<CustomFab tooltip={{ title: 'Atualizar' }} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{ title: 'Novo Perfil' }} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/perfis/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["perfis", empresaId]}
			visao={{
				datagrid: "perfis",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaPerfisPage;