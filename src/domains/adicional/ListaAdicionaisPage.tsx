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
import { IAdicionalAdmin } from "./Adicional"
import { useAdicionaisAdminByEmpresaIdQuery } from "./AdicionalQueries"

const columns: GridColDef<IAdicionalAdmin>[] = [
	{ field: 'adicionalId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/adicionais/${params.row.adicionalId}`)}
	/> },
	{ field: 'tipoProduto', headerName: 'Tipo Adicional', width: 200 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/adicionais/${params.row.adicionalId}`)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'adicional',
		headerName: "Adicional",
		children: [{ field: 'adicionalId' }, { field: 'nome' }, { field: 'tipoProduto' }],
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

const ListaAdicionaisPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useAdicionaisAdminByEmpresaIdQuery(empresaId);
	const [adicionais, setAdicionais] = useState< IAdicionalAdmin[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return adicionais?.map(adicional => {
			return {
				...Object.assign({}, flatten(adicional)),
				id: adicional.adicionalId,
				adicional: adicional,
			}
		}
		) ?? []
	}, [adicionais]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setAdicionais(result.data);
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
		titulo="Adicionais"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Adicional'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/adicionais/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["adicionais", empresaId]}
			visao={{
				datagrid: "adicionais",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaAdicionaisPage;