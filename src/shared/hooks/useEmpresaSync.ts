import { useEffect } from "react";
import useAppStore from "../state/useAppStore";

const useEmpresaSync = () => {
    const empresa = useAppStore(s => s.empresa);
    const setTheme = useAppStore(s => s.setTheme);

    useEffect(() => {
        setTheme({
            corPrimaria: empresa?.aparencia?.cor
        });
        document.title = empresa ? `UniSystem - ${empresa.nome}` : 'UniSystem';
    }, [empresa]);
}

export default useEmpresaSync;