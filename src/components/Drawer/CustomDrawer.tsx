import { Drawer } from "@mui/material";
import useAppStore from "../../state/useAppStore";
import DrawerMenu from "./DrawerMenu";

const CustomDrawer = () => {

	const drawerOpen = useAppStore(s => s.drawerOpen);

	return <Drawer
		variant="permanent"
		anchor="left"
		open={true}
		sx={{
			width: "56px",
			display: drawerOpen ? 'block' : 'none',
		}}
		PaperProps={{
			sx: {
				position: "relative",
				overflow: "hidden",
			},
		}}
	>
		<DrawerMenu/>
	</Drawer>
};

export default CustomDrawer;