import { GridActionsCellItem, GridColDef, GridColumnGroupingModel, GridColumnVisibilityModel, useGridApiRef } from "@mui/x-data-grid-premium"
import { Add, Edit, FileCopy, Refresh, Search } from "@mui/icons-material"
import { flatten } from "flat"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Fab, Tooltip } from "@mui/material"
import DashboardContent from "../../shared/components/Dashboard/DashboardContent"
import CustomDataGrid from "../../shared/components/DataGrid/CustomDataGrid"
import browserHistory from "../../shared/utils/browserHistory"
import { IDatagridVisao } from "../datagridVisao/DatagridVisao"
import { useEmpresasAdminQuery } from "./EmpresaQueries"
import { IEmpresaAdmin } from "./Empresa"
import EmpresaChip from "./EmpresaChip"
import { useSnackbar } from "notistack"
import CustomFab from "../../shared/components/Fab/CustomFab"

const columns: GridColDef<IEmpresaAdmin>[] = [
	{ field: 'empresaId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 150, renderCell: (params) =>
		<EmpresaChip
			empresa={(params.row as any).empresa}
			onClick={() => browserHistory.push(`/admin/empresas/` + params.row.empresaId)}
		/> },
	{ field: 'cnpj', headerName: 'CNPJ', width: 150 },
	{ field: 'grupo.grupoId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'grupo.nome', headerName: 'Nome', width: 150 },
	{ field: 'aparencia.cor', headerName: 'Cor', width: 150 },
	{ field: 'aparencia.icone', headerName: 'Ícone', width: 150 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/admin/empresas/` + params.row.empresaId)}
				showInMenu
			/>,
			<GridActionsCellItem
				icon={<FileCopy />}
				label="Duplicar"
				showInMenu
			/>,
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'empresa',
		headerName: "Empresa",
		children: [{ field: 'empresaId' }, { field: 'nome' }, { field: 'cnpj' }],
		freeReordering: true,
	},
	{
		groupId: 'grupo',
		headerName: "Grupo",
		children: [{ field: 'grupo.grupoId' }, { field: 'grupo.nome' }],
		freeReordering: true,
	},
	{
		groupId: 'aparencia',
		headerName: "Aparência",
		children: [{ field: 'aparencia.cor' }, { field: 'aparencia.icone' }],
		freeReordering: true,
	},
	{
		groupId: 'actions',
		headerName: "",
		children: [{ field: 'actions' }],
		freeReordering: true,
	},
];

const visoesPadrao: IDatagridVisao[] = [
	{
		nome: 'Padrão',
		tipo: 'PADRAO',
		state: {
			columns: {
				columnVisibilityModel: {
					'empresaId': true,
					'nome': true,
					'cnpj': true,
					'grupo.grupoId': true,
					'grupo.nome': true,
					'aparencia.cor': true,
					'aparencia.icone': true,
				}
			}
		},
	},
	{
		nome: 'Esconder Aparência',
		tipo: 'PADRAO',
		state: {
			columns: {
				columnVisibilityModel: {
					'empresaId': true,
					'nome': true,
					'cnpj': true,
					'grupo.grupoId': true,
					'grupo.nome': true,
					'aparencia.cor': false,
					'aparencia.icone': false,
				}
			}
		}
	}
]

const ListaEmpresasPage = () => {

	const [empresas, setEmpresas] = useState< IEmpresaAdmin[] | undefined>();
	const [isUpdating, setIsUpdating] = useState(false);
	
	const { data, isFetching, error, refetch } = useEmpresasAdminQuery(false);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return empresas?.map(empresa => {
			return {
				...Object.assign({}, flatten(empresa)),
				id: empresa.empresaId,
				empresa: empresa,
			}
		}
		) ?? []
	}, [empresas]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setEmpresas(result.data);
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
		titulo="Empresas"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Nova Empresa'}} key={1} onClick={() => browserHistory.push("/admin/empresas/add")} color="primary"><Add /></CustomFab>,
			//<Fab><Search /></Fab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			initialState={{
				pinnedColumns: {
					//right: ['actions']
				},
			}}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["empresas"]}
			visao={{
				datagrid: "empresas",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaEmpresasPage;