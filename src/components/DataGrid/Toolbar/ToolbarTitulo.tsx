import { Typography } from "@mui/material";
import { useContext } from "react";
import { DataGridContext } from "../DataGridContext";

const ToolbarTitulo = () => {
	
	const {titulo} = useContext(DataGridContext)!;

	return <>
		{titulo && <Typography variant="h5" pl={1}> {titulo} </Typography>}
	</>
}

export default ToolbarTitulo;