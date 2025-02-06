import { Add, Edit, PanoramaWideAngleSelect, Refresh, Remove, TroubleshootOutlined } from "@mui/icons-material"
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
import { IEquipe, IEquipeAdmin, IEquipeInfo } from "./Equipe"
import PerfilChip from "../perfil/PerfilChip"
import { useEquipeInfoByEmpresaIdAndEquipeIdQuery, useEquipesByEmpresaIdQuery } from "./EquipeQueries"
import { useParams } from "react-router-dom"
import { IPerfil } from "../perfil/Perfil"
import EquipeAdicionarMembroFormDialog from "./EquipeAdicionarMembroFormDialog"
import { usePerfilAlterarEquipeMutation } from "../perfil/PerfilMutations"
import { useUsuarioLogadoQuery } from "../usuario/UsuarioQueries"
import { usePerfilAtualQuery } from "../perfil/PerfilQueries"
import { usePapelAtualQuery } from "../papel/PapelQueries"

interface IRow extends IPerfil {
	perfil: IPerfil;
	tipo: 'MEMBRO' | "SUPERVISOR";
	removerMembro?: () => {};
	isSupervisor: boolean;
}

const columns: GridColDef<IRow>[] = [
	{ field: 'perfilId', headerName: 'ID', type: 'number', width: 100 },
	{ field: 'nome', headerName: 'Nome', width: 250 , renderCell: (params) =>
		<PerfilChip
			perfil={params.row.perfil}
			onClick={() => browserHistory.push(`/e/${params.row.empresaId}/perfis/${params.row.perfilId}`)}
	/> },
	{ field: 'tipo', headerName: 'Tipo', width: 250, renderCell: (params) => <Chip color={params.value ==  'SUPERVISOR' ? 'success' : 'default'} label={params.value}/> },
	{
		field: 'actions', headerName: "", type: 'actions', getActions: (params) => params.row.isSupervisor ? [
			<GridActionsCellItem
				icon={<Edit />}
				label="Editar"
				onClick={() => browserHistory.push(`/e/${params.row.empresaId}/perfis/${params.row.perfilId}`)}
				color='warning'
			/>,
			...(params.row.tipo == 'MEMBRO' ? [<GridActionsCellItem
				icon={<Remove />}
				label="Remover"
				onClick={() => params.row.removerMembro?.()}
				color='error'
			/>] : [])
		] : [],
	}
]

const columnGroupingModel: GridColumnGroupingModel = [
	{
		groupId: 'perfil',
		headerName: "Perfil",
		children: [{ field: 'perfilId' }, { field: 'nome' }, { field: 'tipo' }],
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

const EquipePage = () => {
	
	const [isUpdating, setIsUpdating] = useState(false);

	const empresaId = useEmpresaIdParam();
	const { equipeId: equipeIdParam } = useParams();
	const equipeId = parseInt(equipeIdParam!);
	
	const { data, refetch } = useEquipeInfoByEmpresaIdAndEquipeIdQuery(empresaId, equipeId);
	const [equipe, setEquipe] = useState< IEquipeInfo | undefined>(data);

	const { enqueueSnackbar } = useSnackbar();

	const {data: usuarioLogado} = useUsuarioLogadoQuery();
	const {data: perfil} = usePerfilAtualQuery();
	const {data: papel} = usePapelAtualQuery();
	const isSupervisor = (usuarioLogado?.isAdmin || papel?.contemPermissao('CADASTRAR_USUARIOS') || equipe?.supervisorId == perfil?.perfilId) ?? false;

	const apiRef = useGridApiRef();

	const rows = useMemo(() => {
		let rows: IRow[] = [];
		if (equipe) {
			rows = [equipe.supervisor, ...equipe.membros]?.map((perfil, i) => {
				return {
					...perfil,
					id: `${i == 0 ? 'm' : 's'}${perfil.perfilId}`,
					perfil: perfil,
					tipo: i == 0 ? 'SUPERVISOR' : 'MEMBRO',
					removerMembro: () => onRemoverMembro(perfil.perfilId),
					isSupervisor: isSupervisor,
				}
			});
		}
		return rows;
	}, [equipe]);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw result.error;
			setEquipe(result.data);
		} catch (error) {
			enqueueSnackbar('Falha ao atualizar!', {variant: 'error'});
		} finally {
			setIsUpdating(false);
		}
	}, []);

	useEffect(() => {
		update();
	}, []);

	const [equipeAdicionarMembroDialogOpen, setEquipeAdicionarMembroDialogOpen] = useState(false);

	const onEquipeAdicionarMembroDialogClose = () => {
		setEquipeAdicionarMembroDialogOpen(false);
		update();
	}

	const {mutateAsync: alterarEquipe} = usePerfilAlterarEquipeMutation();

	const onRemoverMembro = async (perfilId: number) => {
		try {
			const response = await alterarEquipe({
				perfilId: perfilId,
				payload: {
					equipeId: null,
				}
			});
			enqueueSnackbar('Membro removido com sucesso!', {variant: 'success'});
			update();
		} catch (error: any) {
			console.log(error);
			enqueueSnackbar('Falha ao remover membro!', {variant: 'error'});
		}
	}

	return <><DashboardContent
		titulo={<>{equipe?.nome ?? '...'} <Icon>{equipe?.icone ?? 'groups'}</Icon></>}
		fabs={[
			<CustomFab tooltip={{title: 'Atualizar'}} key={0} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>,
			...(isSupervisor ? [<CustomFab tooltip={{title: 'Adicionar Membro'}} key={1} onClick={() => setEquipeAdicionarMembroDialogOpen(true)} color="primary"><Add /></CustomFab>] : []),
		]}
	>
		<CustomDataGrid
			columns={columns}
			loading={isUpdating}
			rows={rows}
			columnGroupingModel={columnGroupingModel}
			apiRef={apiRef}
			stateKey={["equipe", empresaId, equipeId]}
			visao={{
				datagrid: "equipe",
				visoesPadrao: visoesPadrao,
			}}

		/>

	</DashboardContent>
	{equipeAdicionarMembroDialogOpen && <EquipeAdicionarMembroFormDialog onClose={onEquipeAdicionarMembroDialogClose} equipe={equipe!} update={update}/>}
	</>
}

export default EquipePage;