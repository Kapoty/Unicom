import { Typography } from "@mui/material";
import { useDataGridContext } from "../DataGridContext";

const ToolbarTitulo = () => {
	
	const {titulo} = useDataGridContext();

	return <>
		{titulo && <Typography variant="h5" pl={1}> {titulo} </Typography>}
	</>
}

export default ToolbarTitulo;