import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IDatagridVisao } from "./DatagridVisao";
import { usePatchDatagridVisaoMutation, usePostDatagridVisaoMutation } from "./DatagridVisaoMutations";

const DatagridVisaoFormSchema = z.object({
	nome: z.string().min(1).max(100),
})

type DatagridVisaoFormData = z.infer<typeof DatagridVisaoFormSchema>;

export interface EditDatagridVisaoDialogProps {
	visao: Partial<IDatagridVisao>;
	datagrid: string,
	onClose: () => void;
}

const DatagridVisaoFormDialog = ({ visao, datagrid, onClose }: EditDatagridVisaoDialogProps) => {

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors, isValid },
		setError,
	} = useForm<DatagridVisaoFormData>({
		defaultValues: visao,
		resolver: zodResolver(DatagridVisaoFormSchema),
		mode: 'onChange',
	});

	const isEditMode = !!visao.datagridVisaoId;

	const {mutateAsync: postDatagridVisao} = usePostDatagridVisaoMutation()
	const {mutateAsync: patchDatagridVisao} = usePatchDatagridVisaoMutation();

	const {enqueueSnackbar} = useSnackbar();

	const onSubmit = async (data: DatagridVisaoFormData) => {
		try {
			if (isEditMode)
				await patchDatagridVisao({
					datagrid: datagrid,
					datagridVisaoId: visao?.datagridVisaoId!,
					payload: {
						nome: data.nome,
					}
				});
			else 
				await postDatagridVisao({
					datagrid: datagrid,
					payload: {
						nome: data.nome,
						state: visao.state,
					}
				});
			enqueueSnackbar('Visão salva com sucesso!', {variant: 'success'});
			onClose();
		} catch (error: any) {
			console.log(error);
			const errors = error?.response?.data?.errors;
			if (errors) {
				if (errors?.nome)
					setError('nome', {message: errors?.nome})
			} else {
				setError("root", {message: "Oops, algo inesperado aconteceu. Por favor, tente novamente."});
			}
		}
	}

	return <Dialog open onClose={onClose}>
		<DialogTitle>{visao?.datagridVisaoId ? 'Alterar Nome' : 'Nova Visão'}</DialogTitle>
		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogContent>
				<Box>
					<TextField
						{...register('nome')}
						required
						fullWidth
						label="Nome"
						error={!!(errors?.nome)}
						helperText={errors?.nome?.message}
						autoFocus
					/>
					{errors?.root && <Alert severity='error'>{errors.root.message}</Alert>}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error">
					Cancelar
				</Button>
				<LoadingButton
					loading={isSubmitting}
					loadingPosition='end'
					type="submit"
					variant="contained"
					size="large"
					endIcon={<Save />}
					disabled={!isValid}
				>
					Salvar
				</LoadingButton>
			</DialogActions>
		</form>
	</Dialog>
}

export default DatagridVisaoFormDialog;