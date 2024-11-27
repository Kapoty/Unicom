import { Backdrop, CircularProgress } from "@mui/material";

const CustomBackdrop = () => {
	return <Backdrop
		open
		sx={{
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		<CircularProgress/>
	</Backdrop>
}

export default CustomBackdrop;