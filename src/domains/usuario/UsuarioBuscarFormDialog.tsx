import { zodResolver } from "@hookform/resolvers/zod";
import { PersonSearch, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, InputAdornment, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import { useUsuarioBuscarMutation } from "./UsuarioMutations";
import { IUsuarioPublic } from "./Usuario";
import { useState } from "react";

const UsuarioBuscarFormSchema = z.object({
	dominio: z.string().min(1).max(200),
	email: z.string().min(1, {message: "Obrigatório"}).email("Email inválido"),
})

type UsuarioBuscarFormData = z.infer<typeof UsuarioBuscarFormSchema>;

export interface EditDatagridVisaoDialogProps {
	onSave: (usuario: IUsuarioPublic) => void;
	onClose: () => void;
}

const UsuarioBuscarFormDialog = ({ onSave, onClose }: EditDatagridVisaoDialogProps) => {

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors, isValid },
		setError,
		control,
	} = useForm<UsuarioBuscarFormData>({
		defaultValues: {
			dominio: '',
			email: '',
		},
		resolver: zodResolver(UsuarioBuscarFormSchema),
		mode: 'onChange',
	});

	const handleServerErrors = useHandleServerErrors(setError);

	const {mutateAsync: buscarUsuario} = useUsuarioBuscarMutation()

	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = async (data: UsuarioBuscarFormData) => {
		try {
			const response = await buscarUsuario({
				payload: {
					...data,
					dominio: `${data.dominio}.unisystem.app.br`
				}
			});
			onSave(response);
		} catch (error: any) {
			console.log(error);
			if (error?.response?.status == 404) {
				enqueueSnackbar('Usuario não encontrado!', {variant: 'error'});
			} else {
				const errors = error?.response?.data?.errors;
				handleServerErrors(errors);
			}
			
		}
	}

	return <Dialog open onClose={onClose}>
		<DialogTitle>Encontrar Usuário</DialogTitle>
		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogContent>
				<Box>
					<Grid container spacing={1}>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`dominio`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Domínio"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
										slotProps={{
											input: {
												endAdornment: <InputAdornment position="end">
													.unisystem.app.br
												</InputAdornment>
											}
										}}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`email`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Email"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
					</Grid>
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
					endIcon={<PersonSearch />}
					disabled={!isValid}
				>
					Buscar
				</LoadingButton>
			</DialogActions>
		</form>
	</Dialog>
}

export default UsuarioBuscarFormDialog;