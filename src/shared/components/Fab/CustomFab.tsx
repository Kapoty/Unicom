import { Badge, BadgeProps, Box, CircularProgress, Fab, FabProps, Tooltip, TooltipProps } from "@mui/material";
import { forwardRef } from "react";

export interface CustomFabProps extends FabProps {
	tooltip?: Partial<TooltipProps>;
	badge?: Partial<BadgeProps>;
	loading?: boolean;
}

const CustomFab = forwardRef(({ tooltip, badge, loading, children, ...rest }: CustomFabProps, ref) => {
	return <Tooltip {...tooltip} title={tooltip?.title ?? ''} ref={ref} hidden={!tooltip}>
		<Box>
			<Fab {...rest}>
				<Badge variant="dot" color='primary' invisible={true} {...badge}>
					{children}
					{loading && <CircularProgress
						size={40}
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							marginTop: -20,
							marginLeft: -20,
						}}
					/>}
				</Badge>
			</Fab>
		</Box>
	</Tooltip>
});

export default CustomFab;