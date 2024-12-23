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
import EmpresaChip from "../empresa/EmpresaChip"
import { IRelatorio, IRelatorioAdmin } from "./Relatorio"
import { useRelatoriosByEmpresaIdQuery } from "./RelatorioQueries"
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam"

const columns: GridColDef<IRelatorioAdmin>[] = [
	{ field: 'relatorioId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'titulo', headerName: 'Título', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastrar-relatorios/${params.row.relatorioId}`)}
	/> },
	{ field: 'uri', headerName: 'URI', width: 100 },
	{ field: 'link', headerName: 'Link', width: 200 },
	{ field: 'linkMobile', headerName: 'Link Mobile', width: 200 },
	{ field: 'icone', headerName: 'Ícone', width: 100, renderCell: (parmas) => <Icon>{parmas?.value ?? 'leaderboard'}</Icon> },
	{ field: 'novaGuia', headerName: 'Nova Guia', type: 'boolean', width: 100 },
	{ field: 'ativo', headerName: 'Ativo', type: 'boolean', width: 100 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastrar-relatorios/${params.row.relatorioId}`)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'relatorio',
		headerName: "Relatório",
		children: [{ field: 'relatorioId' }, { field: 'titulo' }, { field: 'uri' }, { field: 'link' }, { field: 'linkMobile' }, { field: 'icone' }, { field: 'novaGuia' }, { field: 'ativo' }],
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

const ListaRelatoriosPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useRelatoriosByEmpresaIdQuery(empresaId);
	const [relatorios, setRelatorios] = useState< IRelatorio[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return relatorios?.map(relatorio => {
			return {
				...Object.assign({}, flatten(relatorio)),
				id: relatorio.relatorioId,
				relatorio: relatorio,
			}
		}
		) ?? []
	}, [relatorios]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setRelatorios(result.data);
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
		titulo="Relatórios"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Relatório'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/cadastrar-relatorios/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["relatorios", empresaId]}
			visao={{
				datagrid: "relatorios",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaRelatoriosPage;