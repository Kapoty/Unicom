import { AddCard, CreditCard } from "@mui/icons-material"
import { Tooltip, Box, IconButton, alpha, Grow, Icon, useTheme, Menu, ListItemIcon, MenuItem, ListItem, ListItemButton, Backdrop } from "@mui/material"
import { ForwardedRef, forwardRef, PropsWithChildren, useRef, useState } from "react";
import browserHistory from "../../utils/browserHistory";
import { IDrawerMenuItem } from "./DrawerMenu";
import { DrawerMenuItemContext } from "./DrawerMenu";
import { TransitionGroup } from "react-transition-group";
import useAppStore from "../../state/useAppStore";

export interface DrawerMenuItemProps {
	titulo: string;
	icone: JSX.Element;
	to?: string;
	selected: boolean;
	depth: number;
}

const DrawerMenuItem = forwardRef<HTMLDivElement, PropsWithChildren<DrawerMenuItemProps>>((props, ref) => {

	const {titulo, icone, to, selected, depth} = props;

	const menuRef = useRef();

	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	const theme = useTheme();

	const handleOnClick = () => to ? browserHistory.push(to) : setMenuOpen(true);

	/*sx={selected ? {
		bgcolor: alpha(theme.palette.action.hover, theme.palette.action.hoverOpacity)
	} : {}}*/

	return <Box ref={ref}>
			<Box ref={menuRef} >
				{depth == 1 ? <Tooltip title={titulo} arrow placement="right">
				<ListItemButton
					onClick={handleOnClick}
					sx={selected ? {
						position: 'relative',
						'&::before': {
							display: 'block',
							content: '""',
							position: 'absolute',
							right: '0',
							top: '0',
							width: '2px',
							height: '100%',
							bgcolor: theme.palette.primary.main
						}
					} : {}}
					selected={selected}
				>
					
					<ListItemIcon>
						<Icon color={selected ? "primary" : "inherit"}>{icone}</Icon>
					</ListItemIcon>
				</ListItemButton></Tooltip> : <MenuItem
					onClick={handleOnClick}	
					selected={selected}
				>
						<ListItemIcon>
							{icone}
						</ListItemIcon>
						{titulo}
					</MenuItem>}
			</Box>
		<Backdrop open={menuOpen} onClick={() => setMenuOpen(false)}>
			<Menu
				anchorEl={menuRef.current}
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<TransitionGroup>
					{props.children}
				</TransitionGroup>
			</Menu>
		</Backdrop>
	</Box>
});

export default DrawerMenuItem;