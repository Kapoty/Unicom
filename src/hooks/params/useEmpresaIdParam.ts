import { useMatch } from "react-router-dom";

const useEmpresaIdParam = () => {
    const empresaIdParam = useMatch("/e/:empresaId/*")?.params?.empresaId;
    let empresaId: number | undefined = parseInt(empresaIdParam ?? '');
	if (isNaN(empresaId))
		empresaId = undefined;

    return empresaId;
}

export default useEmpresaIdParam;