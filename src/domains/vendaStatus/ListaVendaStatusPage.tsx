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
import { IVendaStatusAdmin } from "./VendaStatus"
import { useVendaStatusAdminByEmpresaIdQuery } from "./VendaStatusQueries"
import VendaStatusChip from "./VendaStatusChip"
import { useUsuarioLogadoQuery } from "../usuario/UsuarioQueries"

interface IRow extends IVendaStatusAdmin {
	vendaStatus: IVendaStatusAdmin;
	podeEditar: boolean;
}

const columns: GridColDef<IRow>[] = [
	{ field: 'vendaStatusId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 250 , renderCell: (params) =>
		<VendaStatusChip
			vendaStatus={params.row.vendaStatus}
			onClick={params.row.podeEditar ? () => browserHistory.push(`/e/${params.row.empresaId}/cadastros/venda-status/${params.row.vendaStatusId}`) : () => {}}
	/> },
	{ field: 'global', headerName: 'Global', width: 150, type: 'boolean' },
	{ field: 'icone', headerName: 'Ícone', width: 200 },
	{ field: 'categoria', headerName: 'Categoria', width: 200 },
	{ field: 'cor', headerName: 'Cor', width: 200 },
	{ field: 'ordem', headerName: 'Ordem', type: 'number', width: 100 },
	{ field: 'tipoProduto', headerName: 'Tipo Produto', width: 200, valueGetter: (value) => value ?? 'AMBOS'},
	{ field: 'tipo', headerName: 'Tipo', width: 200 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => params.row.podeEditar ? [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/venda-status/${params.row.vendaStatusId}`)}
				showInMenu
			/>
		] : [],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'vendaStatus',
		headerName: "Venda Status",
		children: [{ field: 'vendaStatusId' }, { field: 'nome' }, { field: 'global'}, { field: 'icone' }, { field: 'categoria' }, { field: 'cor' }, { field: 'ordem' }, { field: 'tipoProduto' }, { field: 'tipo' },],
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
			},
			filter: {
				filterModel: {
					items: []
				}
			}
		},
	},
	{
		nome: 'Locais',
		tipo: 'PADRAO',
		state: {
			columns: {
				columnVisibilityModel: {
					...allColumnsVisibilityModel
				},
			},
			filter: {
				filterModel: {
					items: [{ field: 'global', operator: 'is', value: 'false' }],
				  },
			}
		},
	},
	{
		nome: 'Globais',
		tipo: 'PADRAO',
		state: {
			columns: {
				columnVisibilityModel: {
					...allColumnsVisibilityModel
				},
			},
			filter: {
				filterModel: {
					items: [{ field: 'global', operator: 'is', value: 'true' }],
				  },
			}
		},
	}
]

const ListaVendaStatusPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useVendaStatusAdminByEmpresaIdQuery(empresaId);
	const [vendaStatus, setVendaStatus] = useState< IVendaStatusAdmin[] | undefined>(data);

	const {data: usuarioLogado} = useUsuarioLogadoQuery();
	const isAdmin = usuarioLogado?.isAdmin;

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return vendaStatus?.map(vendaStatus => {
			return {
				...Object.assign({}, flatten(vendaStatus)),
				id: vendaStatus.vendaStatusId,
				vendaStatus: vendaStatus,
				global: vendaStatus.empresaId == null,
				podeEditar: vendaStatus.empresaId !== null || isAdmin,
				empresaId: empresaId,
			}
		}
		) ?? []
	}, [vendaStatus]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setVendaStatus(result.data);
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
		titulo="Venda Status"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Venda Status'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/venda-status/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["venda-status", empresaId]}
			visao={{
				datagrid: "venda-status",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaVendaStatusPage;