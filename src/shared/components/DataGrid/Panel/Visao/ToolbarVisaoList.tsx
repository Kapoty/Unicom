import { List } from "@mui/material";
import { IDatagridVisao } from "../../../../../domains/datagridVisao/DatagridVisao";
import ToolbarVisaoListItem from "./ToolbarVisaoListItem";

export interface ToolbarVisaoListProps {
	visoes: IDatagridVisao[]
}

const ToolbarVisaoList = ({ visoes }: ToolbarVisaoListProps) => {
	return <List
		dense
		disablePadding
		sx={{
			'& .MuiListItemIcon-root': {
				pl: 1,
				justifyContent: 'end',
			}
		}}>
		{visoes.map(d => <ToolbarVisaoListItem key={d?.datagridVisaoId ?? d.nome} visao={d}/>)}
	</List>
};

export default ToolbarVisaoList;