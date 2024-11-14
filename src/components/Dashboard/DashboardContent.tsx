import { Box, Divider, Fab, Fade, Stack, Typography } from "@mui/material";
import { forwardRef, ReactNode } from "react";
import useAppStore from "../../state/useAppStore";
import { useTheme } from "@emotion/react";
import { Add } from "@mui/icons-material";

export interface DashboardContentProps {
	titulo?: string;
	children?: ReactNode
}

const DashboardContent = forwardRef<HTMLDivElement, DashboardContentProps>((props, ref) => {

	const {titulo, children} = props;

	const isMobile = useAppStore(s => s.isMobile);
	const theme = useTheme();

	return <Fade in ref={ref}>
			<Stack ref={ref} gap={1}>
				{titulo && <Typography variant="h3">
					{titulo}
				</Typography>}
				<Box>
					{children}
				</Box>
				{isMobile && <Fab sx={{
					position: "absolute",
					bottom: (theme) => theme.spacing(2),
					right: (theme) => theme.spacing(2)
					}} color="primary"><Add/></Fab>}
		</Stack>
	</Fade>
});

export default DashboardContent;