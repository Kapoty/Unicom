import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton, styled } from "@mui/material";
import { MaterialDesignContent, SnackbarProvider, closeSnackbar } from "notistack";
import { PropsWithChildren } from 'react';
import useAppStore from '../../state/useAppStore';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
	'&.notistack-MuiContent': {
		position: 'relative',
		//paddingTop: 0,
		//paddingBottom: 0,
		'&::after': {
			content: '""',
			display: 'block',
			width: '100%',
			height: '3px',
			background: 'rgba(0, 0, 0, 0.5)',
			position: 'absolute',
			bottom: 0,
			left: 0,
			animation: `notificationFade 3s forwards linear`
		},
		"@keyframes notificationFade": {
			"0%": {
				width: "100%"
			},
			"100%": {
				width: "0%"
			}
		},
	},
  }));

const CustomSnackbarProvider = ({children}: PropsWithChildren) => {

	const isMobile = useAppStore(s => s.isMobile);

	return <SnackbarProvider
		dense={isMobile}
		anchorOrigin={{
			horizontal: "center",
			vertical: !isMobile ? "bottom" : "top"
		}}
		Components={{
			default: StyledMaterialDesignContent,
			error: StyledMaterialDesignContent,
			success: StyledMaterialDesignContent,
			info: StyledMaterialDesignContent,
			warning: StyledMaterialDesignContent,
		}}
		action={(snackbarId) => (
			<IconButton size='small' onClick={() => closeSnackbar(snackbarId)}>
				<CloseIcon />
			</IconButton>
		)}
		autoHideDuration={3000}
		//disableWindowBlurListener
	>
		{children}
	</SnackbarProvider>
}

export default CustomSnackbarProvider;