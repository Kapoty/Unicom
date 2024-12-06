import { TabOwnProps, Tab, Badge } from "@mui/material";

export interface DashboardContentTabProps extends TabOwnProps {
	error?: boolean;
}

const DashboardContentTab = ({error, ...props}: DashboardContentTabProps) => {
	return <Tab {...props} icon={<Badge color="error" variant="dot" invisible={!error}>{props?.icon}</Badge>}></Tab>;
};

export default DashboardContentTab;