import { Stack } from "@mui/material";
import { TransitionGroup } from "react-transition-group"
import DrawerMenuItem, { IDrawerMenuItem } from "./DrawerMenuItem";

const items: IDrawerMenuItem[] = [
	{
		titulo: "Início",
		to: '/e/:empresaId'
	}
];

const DrawerMenu = () => {
	return <Stack gap={1} p={1}>
			<TransitionGroup>
				{items.map(item => <DrawerMenuItem key={item.titulo} {...item}/>)}
			</TransitionGroup>
		</Stack>
}

export default DrawerMenu;