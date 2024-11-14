import { CreditCard } from "@mui/icons-material"
import { Tooltip, Box, IconButton, alpha, Grow } from "@mui/material"
import { useRef, useState } from "react";
import browserHistory from "../../utils/browserHistory";

export interface IDrawerSubMenuItem {
	titulo: string,
	to: string,
	submenu?: IDrawerSubMenuItem[],
}

export interface IDrawerMenuItem {
	titulo: string;
	to?: string;
	submenu?: IDrawerSubMenuItem[],
}

export interface DrawerMenuItemProps extends IDrawerMenuItem {

}

const DrawerMenuItem = ({titulo, to, submenu}: DrawerMenuItemProps) => {

	const menuRef = useRef();

	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	return <Grow unmountOnExit mountOnEnter>
		<Tooltip title={titulo} arrow placement="right">
			<Box ref={menuRef} >
				<IconButton onClick={() => browserHistory.push(to!)}>
					<CreditCard color="primary" />
				</IconButton>
			</Box>
		</Tooltip>
	</Grow>
}

export default DrawerMenuItem;