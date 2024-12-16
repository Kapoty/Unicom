import { ChangeEvent, ChangeEventHandler, Fragment, useCallback, useMemo, useState } from "react";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import { Box, Button, Chip, Collapse, Divider, Grow, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import { usePapelAtualQuery } from "../../domains/papel/PapelQueries";
import { useUsuarioLogadoQuery } from "../../domains/usuario/UsuarioQueries";
import { DrawerMenuItemContext, getActiveMenuItems, IDrawerMenuItem, menuItems } from "../../shared/components/Drawer/DrawerMenu";
import browserHistory from "../../shared/utils/browserHistory";
import React from "react";
import { TransitionGroup } from "react-transition-group";
import useAppStore from "../../shared/state/useAppStore";
import { usePerfilAtualQuery } from "../../domains/perfil/PerfilQueries";
import { useRelatoriosByPerfilQuery } from "../../domains/relatorio/RelatorioQueries";

const filterMenuItems = (items: IDrawerMenuItem[], query: string, context: DrawerMenuItemContext) => {
	let filteredMenuItems: IDrawerMenuItem[] = [];
	items.forEach(item => {
		if (item.hideOnHome)
			return;

		if (item.titulo.toLowerCase().includes(query.toLowerCase()))
			filteredMenuItems.push(item);
		else if (item.submenu) {
			item.submenu = filterMenuItems((typeof item.submenu === 'function') ? item.submenu(context) : item.submenu, query, context);
			if (item.submenu?.length !== 0)
				filteredMenuItems.push(item);
		}

	});
	return filteredMenuItems;
}

const renderShortcutItems = (items: IDrawerMenuItem[], context: DrawerMenuItemContext, depth = 1) => {
	return items.map((menuItem, i) => {

		const { titulo, icone, to, submenu } = menuItem;

		if (depth == 1)
			return <Collapse key={i} appear>
				{/*<Typography color="primary" variant='button'>{titulo}</Typography>*/}
				<Chip label={titulo} sx={{mb: 1}}/>
				<Stack direction="row" gap={1} sx={{mb: 1}}>
					{renderShortcutItems(submenu ? (typeof submenu === 'function') ? submenu(context) : submenu : [menuItem], context, depth + 1)}
				</Stack>
			</Collapse>
		else
			return <Button
				onClick={() => to && browserHistory.push((typeof to === 'function') ? to(context) : to)}
				variant='text'
				sx={{
					//borderRadius: '5px',
				}}
				key={i}
			>
				<Stack
					direction='column'
					alignItems='center'
					gap={0}
				>
					{icone}
					<Typography variant="caption" color="textSecondary" align="center">
						{titulo}
					</Typography>
				</Stack>
			</Button>
	});
}

const HomePage = () => {

	const isMobile = useAppStore(s => s.isMobile);

	const [query, setQuery] = useState("");

	const handleQueryInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	}, []);

	const { data: usuarioLogado } = useUsuarioLogadoQuery();
	const empresa = useAppStore(s => s.empresa);
	const location = useLocation();
	const { data: papel } = usePapelAtualQuery();
	const empresaId = useEmpresaIdParam();
	const {data: perfil } = usePerfilAtualQuery();
	const {data: relatorios} = useRelatoriosByPerfilQuery(perfil?.perfilId);

	const items = useMemo(() => {
		const context = {
			usuarioLogado: usuarioLogado,
			empresa: empresa,
			empresaId: empresaId,
			location: location,
			papel: papel,
			relatorios: relatorios,
		};
		const activeMenuItems = getActiveMenuItems(menuItems, context);
		const filteredMenuItems = filterMenuItems(activeMenuItems, query, context);
		return renderShortcutItems(filteredMenuItems, context, 1);
	}, [usuarioLogado, empresa, empresaId, location, papel, query]);

	return <DashboardContent
		//titulo={'Atalhos Rápidos'}
		hideHomeShortcut
	>
		<Stack
			direction='column'
			gap={1}
			alignItems='start'
		>
			<TextField
				id="query"
				placeholder="Procurar..."
				type="search"
				variant="standard"
				value={query}
				onChange={handleQueryInputChange}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						),
					},
				}}
				{...(isMobile ? { fullWidth: true } : {})}
				sx={{
					mt: 0,
				}}

			/>
			<TransitionGroup>
				{items}
			</TransitionGroup>
		</Stack>
	</DashboardContent>
}

export default HomePage;