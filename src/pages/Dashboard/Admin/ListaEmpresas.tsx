import { GridActionsCellItem, GridColDef, GridColumnGroupingModel, GridEventListener, GridRowModel, useGridApiEventHandler, useGridApiRef } from "@mui/x-data-grid-premium"
import DashboardContent from "../../../components/Dashboard/DashboardContent"
import CustomDataGrid from "../../../components/DataGrid/CustomDataGrid"
import { Empresa } from "../../../models/Empresa"
import { Add, Edit, FileCopy, Refresh, Search, Security } from "@mui/icons-material"
import { useEmpresasQuery } from "../../../queries/useEmpresasQueries"
import { flatten } from "flat"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Box, Button, Fab } from "@mui/material"
import browserHistory from "../../../utils/browserHistory"
import useDataGridStore from "../../../state/useDataGridStore"

const columns: GridColDef<Empresa>[] = [
	{ field: 'empresaId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 150, editable: true },
	{ field: 'cnpj', headerName: 'CNPJ', width: 150, editable: true },
	{ field: 'grupo.grupoId', headerName: 'ID', type: 'number', width: 100, editable: true },
	{ field: 'grupo.nome', headerName: 'Nome', width: 150 },
	{ field: 'aparencia.cor', headerName: 'Cor', width: 150, editable: true },
	{ field: 'aparencia.icone', headerName: 'Ícone', width: 150, editable: true },
	{
		field: 'actions', headerName: "Ações", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/admin/empresas/` + params.row.empresaId)}
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
		children: [{field: 'empresaId'}, {field: 'nome'}, {field: 'cnpj'}],
		freeReordering: true,
	},
	{
		groupId: 'grupo',
		headerName: "Grupo",
		children: [{field: 'grupo.grupoId'}, {field: 'grupo.nome'}],
		freeReordering: true,
	},
	{
		groupId: 'aparencia',
		headerName: "Aparência",
		children: [{field: 'aparencia.cor'}, {field: 'aparencia.icone'}],
		freeReordering: true,
	},
	{
		groupId: 'actions',
		headerName: "Ações",
		children: [{field: 'actions'}],
		freeReordering: true,
	},
]

const ListaEmpresas = () => {

	const { data: empresas, isFetching: isFetching, error: error, refetch: refetch } = useEmpresasQuery(false);

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return empresas?.map(empresa => {
			return {
				...Object.assign({}, flatten(empresa)),
				id: empresa.empresaId
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
				}
			}}
			loading={isFetching}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
		/>

	</DashboardContent>
}

export default ListaEmpresas;