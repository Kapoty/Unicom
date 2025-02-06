import { zodResolver } from "@hookform/resolvers/zod";
import { Add, PropaneSharp } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import PerfilChip from "../perfil/PerfilChip";
import { usePerfisAdminByEmpresaIdQuery } from "../perfil/PerfilQueries";
import { IEquipeInfo } from "./Equipe";
import { usePerfilAlterarEquipeMutation } from "../perfil/PerfilMutations";
import { useEffect } from "react";

const EquipeAdicionarMembroFormSchema = z.object({
	perfilId: z.number().min(1, 'obrigatório'),
})

type EquipeAdicionarMembroFormData = z.infer<typeof EquipeAdicionarMembroFormSchema>;

export interface EquipeAdicionarMembroFormDialog {
	equipe: IEquipeInfo;
	update: () => {};
	onClose: () => void;
}

const EquipeAdicionarMembroFormDialog = ({ update, equipe, onClose }: EquipeAdicionarMembroFormDialog) => {

	const empresaId = useEmpresaIdParam();

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors, isValid },
		setError,
		control,
		setValue
	} = useForm<EquipeAdicionarMembroFormData>({
		defaultValues: {
			perfilId: -1,
		},
		resolver: zodResolver(EquipeAdicionarMembroFormSchema),
		mode: 'onChange',
	});

	const handleServerErrors = useHandleServerErrors(setError);

	const {mutateAsync: alterarEquipe} = usePerfilAlterarEquipeMutation()

	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = async (data: EquipeAdicionarMembroFormData) => {
		try {
			const response = await alterarEquipe({
				perfilId: data.perfilId,
				payload: {
					equipeId: equipe.equipeId!,
				}
			});
			enqueueSnackbar('Membro adicionado com sucesso!', {variant: 'success'});
			refetchPerfis();
			update();
			setValue('perfilId', -1);
		} catch (error: any) {
			console.log(error);
			const errors = error?.response?.data?.errors;
			handleServerErrors(errors);
		}
	}

	const {data: perfis, refetch: refetchPerfis} = usePerfisAdminByEmpresaIdQuery(empresaId);

	useEffect(() => {
		refetchPerfis();
	}, []);

	return <Dialog open onClose={onClose}>
		<DialogTitle>Adicionar Membro</DialogTitle>
		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogContent>
				<Box>
					<Grid container spacing={1}>
					<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`perfilId`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Perfil</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Perfil"
											>
												<MenuItem value={-1}><em>Selecione</em></MenuItem>
												{(perfis?.filter(perfil => !perfil.equipeId) ?? []).map((perfil) => <MenuItem key={perfil.perfilId} value={perfil.perfilId}><PerfilChip perfil={perfil}/></MenuItem>)}
											</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
					</Grid>
					{errors?.root && <Alert severity='error'>{errors.root.message}</Alert>}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error">
					Voltar
				</Button>
				<LoadingButton
					loading={isSubmitting}
					loadingPosition='end'
					type="submit"
					variant="contained"
					size="large"
					endIcon={<Add />}
					disabled={!isValid}
				>
					Adicionar
				</LoadingButton>
			</DialogActions>
		</form>
	</Dialog>
}

export default EquipeAdicionarMembroFormDialog;