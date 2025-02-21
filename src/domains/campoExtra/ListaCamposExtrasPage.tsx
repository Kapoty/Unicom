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
import { ICampoExtraAdmin, ICampoExtraSlot } from "./CampoExtra"
import { useCamposExtrasAdminByEmpresaIdQuery } from "./CampoExtraQueries"

interface IRow extends ICampoExtraAdmin {
	campoExtraSlot: ICampoExtraSlot;
	empresaId: number;
	sugestoes: string[],
}

const columns: GridColDef<IRow>[] = [
	{ field: 'campoExtraSlot', headerName: 'Slot', type: 'number', width: 200 },
	{ field: 'nome', headerName: 'Nome', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/campos-extras/${params.row.campoExtraSlot}`)}
	/> },
	{ field: 'ativo', headerName: 'Ativo', width: 125, type: 'boolean' },
	{ field: 'obrigatorio', headerName: 'Obrigatório', width: 125, type: 'boolean' },
	{ field: 'elevado', headerName: 'Elevado', width: 125, type: 'boolean' },
	{ field: 'sugestoes', headerName: 'Sugestões', width: 125, type: 'number', valueGetter: (value: string[]) => value?.length ?? 0},
	{ field: 'referencia', headerName: 'Referência', width: 125, type: 'boolean' },
	{ field: 'regex', headerName: 'Regex', width: 200 },
	{ field: 'valorPadrao', headerName: 'Valor Padrão', width: 200 },
	{ field: 'tipoProduto', headerName: 'Tipo Produto', width: 200, valueGetter: (value) => value ?? 'AMBOS'},
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/cadastros/campos-extras/${params.row.campoExtraSlot}`)}
				showInMenu
			/>
		],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'campoExtra',
		headerName: "Campo Extra",
		children: [{ field: 'campoExtraSlot' }, { field: 'nome' }, { field: 'ativo' }, { field: 'obrigatorio' }, { field: 'elevado' }, { field: 'sugestoes' }, { field: 'referencia' }, { field: 'regex' }, { field: 'valorPadrao' },  { field: 'tipoProduto' }],
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

const ListaCamposExtrasPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useCamposExtrasAdminByEmpresaIdQuery(empresaId);
	const [camposExtras, setCamposExtras] = useState< ICampoExtraAdmin[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return camposExtras?.map(campoExtra => {
			return {
				...Object.assign({}, flatten(campoExtra)),
				id: campoExtra.campoExtraId.campoExtraSlot,
				campoExtra: campoExtra,
				campoExtraSlot: campoExtra.campoExtraId.campoExtraSlot,
				empresaId: campoExtra.campoExtraId.empresaId,
				sugestoes: campoExtra.sugestoes,
			}
		}
		) ?? []
	}, [camposExtras]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setCamposExtras(result.data);
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
		titulo="Campos Extras"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Campo Extra'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/campos-extras/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["campos-extras", empresaId]}
			visao={{
				datagrid: "campos-extras",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaCamposExtrasPage;