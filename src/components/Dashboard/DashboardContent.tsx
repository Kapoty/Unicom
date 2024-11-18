import { Box, Divider, Fab, FabProps, Fade, Slide, Stack, Typography, useTheme } from "@mui/material";
import { forwardRef, ReactElement, ReactNode, useMemo } from "react";
import useAppStore from "../../state/useAppStore";
import { Add, Refresh, Search } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";
import browserHistory from "../../utils/browserHistory";

export interface DashboardContentProps {
	titulo?: string;
	children?: ReactNode;
	fabs?: ReactElement<FabProps>[];
}

const DashboardContent = forwardRef<HTMLDivElement, DashboardContentProps>((props, ref) => {

	const {titulo, children, fabs} = props;

	const isMobile = useAppStore(s => s.isMobile);
	const theme = useTheme();

	const fabsAdapted = useMemo<ReactElement<FabProps>[] | undefined>(() => {
		if (isMobile) {

			if ((fabs?.length ?? 1) % 2 == 0)
				fabs?.push(<Fab key={parseInt(fabs[fabs.length - 1].key!) + 1} sx={{visibility: 'hidden'}}/>)

			return fabs?.map((fab, i) => {
			return {
				...fab,
				key: i.toString(),
				props: {
					...fab.props,
					size: i == 0 ? 'large' : 'medium',
					color: i == 0 ? 'primary' : 'default',
					sx: {
						...fab.props.sx,
						order: i == 0 ? 0 : i + 10 * (i < fabs.length! / 2 ? -1 : 1) 
					}
				}
			}});
		} else {
			return fabs?.map((fab, i) => {
				return {
					...fab,
					key: i.toString(),
					props: {
						...fab.props,
						size: i == 0 ? 'medium' : 'small',
						color: i == 0 ? 'primary' : 'default',
						sx: {
							...fab.props.sx,
							order: i == 0 ? 100 : i
						}
					}
				}
			});
		}
	}, [fabs, isMobile]);

	return <Fade in ref={ref}>
			<Stack ref={ref} gap={1} height={1}>
				<Stack direction = "row" gap={2} alignItems="center">
					{!isMobile && <>
						<Stack direction = "row" gap={2} alignItems="center">
							{fabsAdapted?.map(fab => <Slide in direction='down' key={fab.key}>{fab}</Slide>)}
						</Stack>
					</>}
					{titulo && <Typography variant="h3" align={isMobile ? 'center' : 'left'}>
						{titulo}
					</Typography>}
				</Stack>
				<Box gap={1} flexGrow={1}>
					{children}
				</Box>
				{isMobile && <TransitionGroup
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: theme.spacing(2),
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{fabsAdapted?.map(fab => <Slide in direction='up' key={fab.key}>{fab}</Slide>)}
				</TransitionGroup>}
			</Stack>
	</Fade>
});

export default DashboardContent;