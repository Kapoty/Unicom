import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDatagridsVisoesByDatagridQuery } from "../../../../../domains/datagridVisao/DatagridVisaoQueries";
import { useDatagridVisaoAtualByDatagridQuery } from "../../../../../domains/datagridVisaoAtual/DatagridVisaoAtualQueries";
import { useDataGridContext } from "../../DataGridContext";
import ToolbarVisaoList from "./ToolbarVisaoList";
import CustomPanel from "../CustomPanel";
import { Add } from "@mui/icons-material";
import { IDatagridVisao } from "../../../../../domains/datagridVisao/DatagridVisao";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import DatagridVisaoFormDialog from "../../../../../domains/datagridVisao/DatagridVisaoFormDialog";

export interface ToolbarVisaoPanelProps {
	onClose: (() => void);
}

const ToolbarVisaoPanel = ({ onClose }: ToolbarVisaoPanelProps) => {

	const dataGridContext = useDataGridContext();

	const apiRef = useGridApiContext();

	const { data: visaoAtual } = useDatagridVisaoAtualByDatagridQuery(dataGridContext.visao?.datagrid);

	const [currentTab, setCurrentTab] = useState(visaoAtual?.tipo ?? "PADRAO");
	const handleTabChange = useCallback((event: React.SyntheticEvent, value: any) => setCurrentTab(value), []);

	const visoesPadrao = dataGridContext.visao?.visoesPadrao ?? [];
	const { data: visoesPersonalizadas } = useDatagridsVisoesByDatagridQuery(dataGridContext.visao?.datagrid);
	const visoesPersonalizadasSorted = useMemo(() => (visoesPersonalizadas ?? []).sort((a, b) => a.nome.localeCompare(b.nome)), [visoesPersonalizadas])

	const [createDatagridVisaoDialogOpen, setCreateDatagridVisaoDialogOpen] = useState(false);
	const [visao, setVisao] = useState<Partial<IDatagridVisao>>({});
	
	const openCreateDatagridVisaoDialogOpen = useCallback(() => {
		setVisao({
			state: apiRef.current.exportState()
		})
		setCreateDatagridVisaoDialogOpen(true); 
	}, []);

	return <CustomPanel open onClose={onClose}>
		<TabContext value={currentTab}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<TabList onChange={handleTabChange}>
					<Tab label="Padrão" value="PADRAO" />
					{dataGridContext.visao?.datagrid && <Tab label="Personalizada" value="PERSONALIZADA" />}
				</TabList>
			</Box>
			<TabPanel value="PADRAO" sx={{ p: 0, pt: 1 }}>
				<Box maxHeight={400} overflow='auto'>
					<ToolbarVisaoList visoes={visoesPadrao} />
				</Box>
			</TabPanel>
			{dataGridContext.visao?.datagrid &&
				<TabPanel value="PERSONALIZADA" sx={{ p: 0, pt: 1 }}>
					<>
						<Button variant="contained" startIcon={<Add />} size="small" fullWidth sx={{ mb: 1 }} onClick={openCreateDatagridVisaoDialogOpen}>
							Nova Visão
						</Button>
						<Box maxHeight={400} overflow='auto'>
							<ToolbarVisaoList visoes={visoesPersonalizadasSorted ?? []} />
						</Box>
					</>
				</TabPanel>}
		</TabContext>
		{createDatagridVisaoDialogOpen && <DatagridVisaoFormDialog
			visao={visao}
			datagrid={dataGridContext.visao?.datagrid!}
			onClose={() => setCreateDatagridVisaoDialogOpen(false)}
		/>}
	</CustomPanel>
}

export default ToolbarVisaoPanel;