import { Backdrop, Box, Icon, List, ListItemButton, ListItemIcon, Menu, MenuItem, Tooltip, useTheme } from "@mui/material";
import { forwardRef, PropsWithChildren, useRef, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import browserHistory from "../../utils/browserHistory";

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

	return <Box ref={ref}>
			<Box ref={menuRef} >
				{depth == 1 ? <Tooltip title={titulo} arrow placement="right">
				<ListItemButton
					onClick={handleOnClick}
					sx={{
						position: 'relative',
						height: 48,
						//transition: 'height 0.25s',
						'&::before': {
							display: 'block',
							content: '""',
							position: 'absolute',
							right: '0',
							top: '0',
							width: '0px',
							height: '100%',
							bgcolor: theme.palette.primary.main,
							//transition: 'all 0.25s',
						},
						'&.Mui-selected': {
							height: 48,
							//transition: 'height 0.25s',
						},
						'&.Mui-selected::before': {
							display: 'block',
							content: '""',
							position: 'absolute',
							right: '0',
							top: '0',
							width: '2px',
							height: '100%',
							bgcolor: theme.palette.primary.main,
							//transition: 'all 0.25s',
						}
					}}
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
		<Backdrop invisible open={menuOpen} onClick={() => setMenuOpen(false)}>
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
				{props.children}
			</Menu>
		</Backdrop>
	</Box>
});

export default DrawerMenuItem;