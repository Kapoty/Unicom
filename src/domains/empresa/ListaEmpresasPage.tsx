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
import { IEmpresaAdmin } from "./Empresa"
import EmpresaChip from "./EmpresaChip"
import { useEmpresasAdminQuery } from "./EmpresaQueries"

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
	{ field: 'contratoAtual.ativo', headerName: 'Ativo', type: 'boolean', width: 150},
	{ field: 'contratoAtual.limiteUsuarios', headerName: 'Limite de Usuários', width: 150 },
	{ field: 'contratoAtual.valor', headerName: 'Valor', width: 150 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/admin/empresas/` + params.row.empresaId)}
				showInMenu
			/>
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
		groupId: 'contratoAtual',
		headerName: "Contrato Atual",
		children: [{ field: 'contratoAtual.ativo' }, { field: 'contratoAtual.limiteUsuarios' }, { field: 'contratoAtual.valor' }],
		freeReordering: true,
	},
	{
		groupId: 'actions',
		headerName: "",
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

const ListaEmpresasPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);
	
	const { data, error, refetch } = useEmpresasAdminQuery(false);
	const [empresas, setEmpresas] = useState< IEmpresaAdmin[] | undefined>(data);

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
		]}
	>
		<CustomDataGrid
			columns={columns}
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