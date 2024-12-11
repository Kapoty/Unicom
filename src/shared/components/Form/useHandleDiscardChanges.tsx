import { useCallback } from "react";
import { useConfirm } from "../ConfirmDialog/ConfirmProvider";
import { Cancel } from "@mui/icons-material";
import { UseFormReset } from "react-hook-form";

const useHandleDiscardChanges = (reset: UseFormReset<any>) => {

	const { confirm } = useConfirm();

	const handleDiscardChanges = useCallback(async () => {
		if (await confirm({
			title: "Descartar alterações?",
			message: 'Atenção: dados não salvos serão perdidos!',
			cancelText: 'Continuar editando',
			confirmColor: 'error',
			confirmText: 'Descartar',
			confirmIcon: <Cancel />,
		})) {
			reset();
		}
	}, []);

	return handleDiscardChanges;
}

export default useHandleDiscardChanges;