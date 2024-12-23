import { useCallback } from "react";
import { useConfirm } from "../ConfirmDialog/ConfirmProvider";
import { Cancel } from "@mui/icons-material";
import { UseFormReset } from "react-hook-form";

const useHandleDelete = (_delete: () => {}) => {

	const { confirm } = useConfirm();

	const handleDelete = useCallback(async () => {
		if (await confirm({
			title: "Deseja realmente excluir?",
			message: 'Atenção: essa ação é irreversível!',
			cancelText: 'Continuar editando',
			confirmColor: 'error',
			confirmText: 'Excluir',
			confirmIcon: <Cancel />,
		})) {
			_delete();
		}
	}, []);

	return handleDelete;
}

export default useHandleDelete;