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
import { Chip, Icon } from "@mui/material"
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam"
import { IEquipe, IEquipeAdmin } from "./Equipe"
import PerfilChip from "../perfil/PerfilChip"
import { useEquipesByEmpresaIdQuery } from "./EquipeQueries"

const columns: GridColDef<IEquipeAdmin>[] = [
	{ field: 'equipeId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/equipes/${params.row.equipeId}`)}
	/> },
	{ field: 'icone', headerName: 'Ícone', width: 100, renderCell: (parmas) => <Icon>{parmas?.value ?? 'groups'}</Icon> },
	{ field: 'supervisorId', headerName: 'Supervisor', width: 200, renderCell: (params) => <PerfilChip perfilId={params.value}/> },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/equipes/${params.row.equipeId}`)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'equipe',
		headerName: "Equipe",
		children: [{ field: 'equipeId' }, { field: 'nome' }, { field: 'icone' }, { field: 'supervisorId' }],
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

const ListaEquipesPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useEquipesByEmpresaIdQuery(empresaId);
	const [equipes, setEquipes] = useState< IEquipeAdmin[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return equipes?.map(equipe => {
			return {
				...Object.assign({}, flatten(equipe)),
				id: equipe.equipeId,
				equipe: equipe,
			}
		}
		) ?? []
	}, [equipes]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setEquipes(result.data);
		} catch (error) {
			enqueueSnackbar('Falha ao atualizar!', {variant: 'error'});
		} finally {
			setIsUpdating(false);
		}
	}, []);

	useEffect(() => {
		update();
	}, []);

	return <DashboardContent
		titulo="Equipes"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Nova Equipe'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/equipes/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["equipes", empresaId]}
			visao={{
				datagrid: "equipes",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaEquipesPage;