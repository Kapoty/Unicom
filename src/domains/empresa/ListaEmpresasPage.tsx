import { GridActionsCellItem, GridColDef, GridColumnGroupingModel, GridColumnVisibilityModel, useGridApiRef } from "@mui/x-data-grid-premium"
import { Add, Edit, FileCopy, Refresh, Search } from "@mui/icons-material"
import { flatten } from "flat"
import { useEffect, useMemo } from "react"
import { Fab } from "@mui/material"
import DashboardContent from "../../shared/components/Dashboard/DashboardContent"
import CustomDataGrid from "../../shared/components/DataGrid/CustomDataGrid"
import browserHistory from "../../shared/utils/browserHistory"
import { IDatagridVisao } from "../datagridVisao/DatagridVisao"
import { useEmpresasAdminQuery } from "./EmpresaQueries"
import { IEmpresa, IEmpresaAdmin } from "./Empresa"
import EmpresaChip from "./EmpresaChip"

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

	const { data: empresas, isFetching: isFetching, error: error, refetch: refetch } = useEmpresasAdminQuery(false);

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

	useEffect(() => {
		if (!empresas)
			refetch();
	}, []);

	return <DashboardContent
		titulo="Empresas"
		fabs={[
			<Fab onClick={() => browserHistory.push("/admin/empresas/add")}><Add /></Fab>,
			<Fab onClick={() => refetch()} disabled={isFetching}><Refresh /></Fab>,
			<Fab><Search /></Fab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			initialState={{
				pinnedColumns: {
					//right: ['actions']
				},
			}}
			loading={isFetching}
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