import { Box, Divider, Fab, FabProps, Fade, Grow, Slide, Stack, Typography, useTheme } from "@mui/material";
import { forwardRef, ReactElement, ReactNode, useCallback, useMemo } from "react";
import { Add, Home, Refresh, Search } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";
import browserHistory from "../../utils/browserHistory";
import useAppStore from "../../state/useAppStore";

export interface DashboardContentProps {
	titulo?: string;
	subtitulo?: string;
	children?: ReactNode;
	fabs?: ReactElement[];
	hideHomeShortcut?: boolean;
}

const DashboardContent = forwardRef<HTMLDivElement, DashboardContentProps>((props, ref) => {

	const { titulo, subtitulo, children, fabs, hideHomeShortcut } = props;

	const isMobile = useAppStore(s => s.isMobile);
	const theme = useTheme();

	/*const fabsAdapted = useMemo<ReactElement<FabProps>[] | undefined>(() => {
		if (isMobile) {

			if ((fabs?.length ?? 1) % 2 == 0)
				fabs?.push(<Fab key={parseInt(fabs[fabs.length - 1].key!) + 1} sx={{ visibility: 'hidden' }} />)

			return fabs?.map((fab, i) => {
				return {
					...fab,
					key: i.toString(),
					props: {
						...fab.props,
						size: i == 0 ? 'large' : 'medium',
						//...(i == 0 ? {color: 'primary'} : {}),
						sx: {
							...fab.props.sx,
							order: i == 0 ? 0 : i + 10 * (i < fabs.length! / 2 ? -1 : 1)
						}
					}
				}
			});
		} else {
			return fabs?.map((fab, i) => {
				return {
					...fab,
					key: i.toString(),
					props: {
						...fab.props,
						size: i == 0 ? 'medium' : 'small',
						//...(i == 0 ? {color: 'primary'} : {}),
						sx: {
							...fab.props.sx,
							order: i == 0 ? 100 : i
						}
					}
				}
			});
		}
	}, [fabs, isMobile]);*/

	const empresa = useAppStore(s => s.empresa);

	const goHome = useCallback(() => {
		browserHistory.push(empresa?.empresaId ? `/e/${empresa.empresaId}` : '/admin')
	}, [empresa]);

	return <Fade in ref={ref}>
		<Stack ref={ref} gap={1} height={1}>
			{(titulo || (isMobile && fabs)) && <Stack direction="row" gap={1} alignItems="center">
				{!isMobile && <>
					<Stack direction="row" gap={1} alignItems="center">
						{fabs?.map(fab => <Slide in direction='down' key={fab.key}>{fab}</Slide>)}
					</Stack>
				</>}
				{titulo && <Typography variant="h3" align={isMobile ? 'center' : 'left'} flexGrow={1}>
					{titulo}
				</Typography>}
			</Stack>}
			{subtitulo && <Typography variant="caption" color='textSecondary' align={isMobile ? 'center' : 'left'}>
				{subtitulo}
			</Typography>}
			<Stack direction='column' gap={1} flexGrow={1} overflow='auto' height='1px'>
				{children}
			</Stack>
			{isMobile && <TransitionGroup
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: theme.spacing(1),
					justifyContent: "center",
					alignItems: "center",
					position: 'relative',
				}}
			>
				{fabs?.map(fab => <Slide in direction='up' key={fab.key}>{fab}</Slide>)}
				{!hideHomeShortcut && isMobile && <Slide in direction='right'>
					<Fab
						onClick={goHome}
						color="error"
						size="small"
						sx={{
							position: 'absolute',
							left: theme.spacing(1),
							bottom: theme.spacing(0.5),
						}}>
						<Home />
					</Fab>
				</Slide>
				}
			</TransitionGroup>}
		</Stack>
	</Fade>
});

export default DashboardContent;