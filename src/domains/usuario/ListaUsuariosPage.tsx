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
import { IUsuarioAdmin } from "./Usuario"
import { useUsuariosAdminByEmpresaIdQuery } from "./UsuarioQueries"

const columns: GridColDef<IUsuarioAdmin>[] = [
	{ field: 'usuarioId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nomeCompleto', headerName: 'Nome Completo', width: 250 , renderCell: (params) =>
		<Chip
			label={params.value}
			onClick={() => browserHistory.push(`/e/${params.row.empresaPrincipalId}/usuarios/${params.row.usuarioId}`)}
	/> },
	{ field: 'email', headerName: 'Email', width: 200 },
	{ field: 'matricula', headerName: 'Matrícula', width: 100 },
	{ field: 'papelSistema', headerName: 'Papel (Sistema)', width: 150 },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaPrincipalId}/usuarios/${params.row.usuarioId}`)}
				showInMenu
			/>
		],
	}
]	

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'usuario',
		headerName: "Usuário",
		children: [{ field: 'usuarioId' }, { field: 'nomeCompleto' }, { field: 'email' }, { field: 'matricula' }, { field: 'papelSistema' }],
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

const ListaUsuariosPage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	
	const { data, refetch } = useUsuariosAdminByEmpresaIdQuery(empresaId);
	const [usuarios, setUsuarios] = useState< IUsuarioAdmin[] | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		return usuarios?.map(usuario => {
			return {
				...Object.assign({}, flatten(usuario)),
				id: usuario.usuarioId,
				usuario: usuario,
			}
		}
		) ?? []
	}, [usuarios]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setUsuarios(result.data);
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
		titulo="Usuários"
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			<CustomFab tooltip={{title: 'Novo Usuário'}} key={1} onClick={() => browserHistory.push(`/e/${empresaId}/usuarios/add`)} color="primary"><Add /></CustomFab>,
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["usuarios", empresaId]}
			visao={{
				datagrid: "usuarios",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
}

export default ListaUsuariosPage;