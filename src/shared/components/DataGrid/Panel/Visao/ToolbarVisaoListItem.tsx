import { Delete, Edit, Save } from "@mui/icons-material";
import { IconButton, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { GridInitialStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { IDatagridVisao } from "../../../../../domains/datagridVisao/DatagridVisao";
import DatagridVisaoFormDialog from "../../../../../domains/datagridVisao/DatagridVisaoFormDialog";
import { useDeleteDatagridVisaoMutation, usePatchDatagridVisaoMutation } from "../../../../../domains/datagridVisao/DatagridVisaoMutations";
import { useMarcarDatagridVisaoAtualMutation } from "../../../../../domains/datagridVisaoAtual/DatagridVisaoAtualMutations";
import { useDatagridVisaoAtualByDatagridQuery } from "../../../../../domains/datagridVisaoAtual/DatagridVisaoAtualQueries";
import { useConfirm } from "../../../ConfirmDialog/ConfirmProvider";
import { useDataGridContext } from "../../DataGridContext";
import { MarcarDatagridVisaoAtualRequestSchema } from "../../../../../domains/datagridVisaoAtual/DatagridVisaoAtualPayloads";

export interface ToolbarVisaoListItemProps {
	visao: IDatagridVisao;
}

const ToolbarVisaoListItem = ({ visao }: ToolbarVisaoListItemProps) => {

	const apiRef = useGridApiContext();
	const dataGridContext = useDataGridContext()!;
	const { data: visaoAtual } = useDatagridVisaoAtualByDatagridQuery(dataGridContext.visao?.datagrid);
	const { mutate: marcarDatagridVisaoAtual } = useMarcarDatagridVisaoAtualMutation();
	const { mutateAsync: patchDatagridVisao } = usePatchDatagridVisaoMutation();
	const { mutateAsync: deleteDatagridVisao } = useDeleteDatagridVisaoMutation();
	const { confirm } = useConfirm();
	const { enqueueSnackbar } = useSnackbar();
	const [editDatagridVisaoDialogOpen, setEditDatagridVisaoDialogOpen] = useState(false);

	const handleMarcar = useCallback(() => {
		marcarDatagridVisaoAtual({
			datagrid: dataGridContext.visao?.datagrid!,
			payload: MarcarDatagridVisaoAtualRequestSchema.parse(visao),
		});
		apiRef.current.restoreState(visao.state as GridInitialStatePremium);
	}, [visao]);

	const handleSalvar = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		if (await confirm({
			message: `Deseja salvar a visão atual na visão '${visao.nome}'?`
		})) {
			try {
				await patchDatagridVisao({
					datagrid: dataGridContext.visao?.datagrid!,
					datagridVisaoId: visao.datagridVisaoId!,
					payload: {
						state: apiRef.current.exportState()
					}
				});
				enqueueSnackbar('Visão salva!', { variant: 'success' });
			} catch (error) {
				enqueueSnackbar('Falha ao salvar visão!', { variant: 'error' });
			}
		}
	}, [visao]);

	const handleEditar = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		setEditDatagridVisaoDialogOpen(true);
	}, [visao]);

	const handleExcluir = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		if (await confirm({
			message: `Deseja excluir a visão '${visao.nome}'?`
		})) {
			try {
				await deleteDatagridVisao({
					datagrid: dataGridContext.visao?.datagrid!,
					datagridVisaoId: visao.datagridVisaoId!
				});
				enqueueSnackbar('Visão excluída!', { variant: 'success' });
			} catch (error) {
				enqueueSnackbar('Falha ao excluir visão!', { variant: 'error' });
			}
		}
	}, [visao]);

	return <>
		<ListItemButton
			selected={
				(visaoAtual?.tipo == 'PERSONALIZADA' && visaoAtual?.datagridVisaoId == visao?.datagridVisaoId)
				|| (visaoAtual?.nome == visao.nome)}
			onClick={handleMarcar}
		>
			<ListItemText sx={{maxWidth: 150, overflowWrap: "anywhere"}}>{visao.nome}</ListItemText>
			{visao.tipo == 'PERSONALIZADA' && <ListItemIcon>
				<Tooltip title="Salvar">
					<IconButton color="success" size="small" onClick={(event) => handleSalvar(event)}>
						<Save />
					</IconButton>
				</Tooltip>
				<Tooltip color="warning" title="Alterar Nome">
					<IconButton size="small" onClick={(event) => handleEditar(event)}>
						<Edit />
					</IconButton>
				</Tooltip>
				<Tooltip color="error" title="Excluir">
					<IconButton size="small" onClick={(event) => handleExcluir(event)}>
						<Delete />
					</IconButton>
				</Tooltip>
			</ListItemIcon>}
		</ListItemButton >
		{editDatagridVisaoDialogOpen && <DatagridVisaoFormDialog
			visao={visao}
			datagrid={dataGridContext.visao?.datagrid!}
			onClose={() => setEditDatagridVisaoDialogOpen(false)}
		/>}
	</>
};

export default ToolbarVisaoListItem;