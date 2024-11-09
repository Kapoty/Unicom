import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import useAuthStore from "../state/useAuthStore";

const EmpresaComponent = () => {
    const {empresaId} = useParams()

    return <div>{empresaId}</div>
}

const DashBoardPage = () => {

    const isAuth = useAuthStore(s => s.isAuth);
    const logout = useAuthStore(s => s.logout);

    useEffect(() => {
        if (isAuth !== undefined && !isAuth)
            logout();
    }, [isAuth]);

    if (isAuth == undefined)
        return <Backdrop open>
            <CircularProgress color="inherit"></CircularProgress>
        </Backdrop>

    return <>
        <div>Dashboard</div>
        <Routes>
            <Route path="/e/:empresaId" element={<EmpresaComponent/>}></Route>
        </Routes>
    </>;
}

export default DashBoardPage;