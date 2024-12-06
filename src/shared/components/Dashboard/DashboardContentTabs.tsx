import { Description, Gavel } from "@mui/icons-material";
import { Stack, Box, Tabs, Tab, TabOwnProps, TabsOwnProps, Badge } from "@mui/material";
import React, { useState, useCallback, ReactElement, forwardRef, useImperativeHandle } from "react";
import useAppStore from "../../state/useAppStore";
import SwipeableViews from "react-swipeable-views";
import { virtualize, SlideRendererParams } from "react-swipeable-views-utils";
import { DashboardContentTabProps } from "./DashboardContentTab";

export interface DashboardContentTabsProps extends TabsOwnProps {
	tabs: ReactElement<DashboardContentTabProps>[];
	children: React.ReactNode[];
	currentTab: number;
	setCurrentTab: (index: number) => void;
}

const DashboardContentTabs = ({tabs, children, currentTab, setCurrentTab, ...rest}: DashboardContentTabsProps) => {

	const isMobile = useAppStore(s => s.isMobile);

	//const getTabIndex = useCallback((tab: number) => ((tab % tabs.length) + tabs.length) % tabs.length, [tabs]);

	return <Stack direction="column" flexGrow={1} gap={1}>
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs
				allowScrollButtonsMobile
				variant="scrollable"
				{...rest}
				value={currentTab}
				onChange={(event, value) => setCurrentTab(value)}
			>
				{tabs}
			</Tabs>
		</Box>
		<Box
			sx={{
				display: 'flex',
				flexGrow: 1,
				'& > div': {
					display: 'flex',
					flexGrow: 1,
				},
				'& > div > div': {
					flexGrow: 1,
					width: '100%',
				},
				'& > div > div > div': {
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
				}
			}}
		>
			<SwipeableViews
				index={currentTab}
				onChangeIndex={(index: number) => setCurrentTab(index)}
				//enableMouseEvents
			>
				{children?.map((child, i) => <Box key={i} flexGrow={1} overflow='auto' height='1px' maxWidth={800}>{Math.abs(currentTab - i) <= 1 && child}</Box>)}
			</SwipeableViews>
		</Box>
	</Stack>

};

export default DashboardContentTabs;