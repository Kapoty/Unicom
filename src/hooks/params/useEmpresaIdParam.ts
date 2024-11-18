import { useMatch } from "react-router-dom";

const useEmpresaIdParam = () => {
    const empresaIdParam = useMatch("/e/:empresaId/*")?.params?.empresaId;
	if (!empresaIdParam)
		return undefined;
    let empresaId = parseInt(empresaIdParam);
	if (isNaN(empresaId))
		empresaId = -1;

    return empresaId;
}

export default useEmpresaIdParam;