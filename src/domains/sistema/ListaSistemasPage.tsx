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
import { ISistemaAdmin } from "./Sistema"
import { useSistemasAdminByEmpresaIdQuery } from "./SistemaQueries"

const columns: GridColDef<ISistemaAdmin>[] = [
	{ field: 'sistemaId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/sistemas/${params.row.sistemaId}`)}
	/> },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/sistemas/${params.row.sistemaId}`)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'sistema',
		headerName: "Sistema",
		children: [{ field: 'sistemaId' }, { field: 'nome' },],
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

const ListaSistemasPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useSistemasAdminByEmpresaIdQuery(empresaId);
	const [sistemas, setSistemas] = useState< ISistemaAdmin[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return sistemas?.map(sistema => {
			return {
				...Object.assign({}, flatten(sistema)),
				id: sistema.sistemaId,
				sistema: sistema,
			}
		}
		) ?? []
	}, [sistemas]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setSistemas(result.data);
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
		titulo="Sistemas"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Sistema'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/sistemas/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["sistemas", empresaId]}
			visao={{
				datagrid: "sistemas",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaSistemasPage;