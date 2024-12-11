import { Refresh } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { useConfirm } from "../ConfirmDialog/ConfirmProvider";

type ErrorResponse = Record<string, string>;

const useHandleServerErrors = <TFieldValues extends FieldValues>(
	setError: UseFormSetError<TFieldValues>,
	setIsUpdateRequired?: Dispatch<SetStateAction<boolean>>,
	setIsNewDataAvailable?: Dispatch<SetStateAction<boolean>>) => {

	const { enqueueSnackbar } = useSnackbar();
	const { confirm } = useConfirm();

	const handleServerErrors = (errors: ErrorResponse) => {
		if (errors)
			Object.entries(errors).forEach(([field, message]) => {
				setError(field as Path<TFieldValues>, { type: "server", message });
			});
		else
			setError('root', {message: 'Oops, algo inesperado aconteceu. Por favor, tente novamente.'});

			if (errors?.outdated) {
				setIsUpdateRequired?.(true);
				setIsNewDataAvailable?.(true);
				confirm({
					title: 'Dados desatualizados',
					message: <Box>
						Os dados do seu formulário estão desatualizados.<br />
						Por gentileza, atualize o formulário  {'('}<Refresh />{')'} e salve novamente.<br />
						Fique tranquilo, as suas alterações não serão perdidas.
					</Box>,
					confirmText: 'Ok!',
					hideCancel: true,
				});
			}
			else
				enqueueSnackbar('Falha ao salvar!', { variant: 'error' });
	}

	return handleServerErrors;
}

export default useHandleServerErrors;