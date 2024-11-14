import { useMatch } from "react-router-dom";

const useEmpresaIdParam = () => {
    const empresaIdParam = useMatch("/e/:empresaId/*")?.params?.empresaId;
    const empresaId = empresaIdParam ? parseInt(empresaIdParam) : undefined;

    return empresaId;
}

export default useEmpresaIdParam;