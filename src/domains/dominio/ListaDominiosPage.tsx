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
import { Chip } from "@mui/material"
import { IDominio } from "./Dominio"
import EmpresaChip from "../empresa/EmpresaChip"
import { useDominiosQuery } from "./DominioQueries"

const columns: GridColDef<IDominio>[] = [
	{ field: 'dominioId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'dominio', headerName: 'Domínio', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/admin/dominios/` + params.row.dominioId)}
	/> },
	{ field: 'empresaId', headerName: 'Empresa', type: 'number', width: 150 , renderCell: (params) =>
		<EmpresaChip empresaId={params.value}/> },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/admin/dominios/` + params.row.dominioId)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'dominio',
		headerName: "Domínio",
		children: [{ field: 'dominioId' }, { field: 'empresaId' }, { field: 'dominio' }],
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

const ListaDominiosPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);
	
	const { data, refetch } = useDominiosQuery();
	const [dominios, setDominios] = useState< IDominio[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return dominios?.map(dominio => {
			return {
				...Object.assign({}, flatten(dominio)),
				id: dominio.dominioId,
				_dominio: dominio,
			}
		}
		) ?? []
	}, [dominios]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setDominios(result.data);
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
		titulo="Domínios"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Domínio'}} key={1} onClick={() => browserHistory.push("/admin/dominios/add")} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["dominios"]}
			visao={{
				datagrid: "dominios",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaDominiosPage;