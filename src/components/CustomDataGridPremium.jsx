import React from 'react';

import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';
import { useTheme, darken, lighten } from "@mui/material/styles";

class CustomDataGridPremium extends React.Component {

	render() {

		const theme = this.props.theme;

		return  <DataGridPremium
				showCellVerticalBorder
				{...this.props}
				sx={{
					...this.props.sx,
					"& .MuiDataGrid-toolbarContainer, & .MuiDataGrid-footerContainer": {
						backgroundColor: theme.palette.background.default,
					},
					[`& .${gridClasses.row}.even`]: {
						backgroundColor: theme.palette.background.light,
						'&:hover': {
							backgroundColor: lighten(theme.palette.background.light, 0.1),
						},
						'&.Mui-selected': {
							backgroundColor: darken(theme.palette.primary.main, 0.8),
							'&:hover': {
								backgroundColor: darken(theme.palette.primary.main, 0.7),
							},
						},
					},
					[`& .${gridClasses.row}.odd`]: {
						backgroundColor: theme.palette.background.default,
						'&:hover': {
							backgroundColor: lighten(theme.palette.background.default, 0.1),
						},
						'&.Mui-selected': {
							backgroundColor: darken(theme.palette.primary.main, 0.8),
							'&:hover': {
								backgroundColor: darken(theme.palette.primary.main, 0.7), 
							},
						},
					}
				}}
				getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
			/>
	}
}

export default (props) => {
	const theme = useTheme();
	return <CustomDataGridPremium theme={theme} {...props}/>
}