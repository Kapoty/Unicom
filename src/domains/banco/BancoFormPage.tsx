import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Description } from "@mui/icons-material";
import { Alert, Grid2 as Grid, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import DashboardContentTab from "../../shared/components/Dashboard/DashboardContentTab";
import DashboardContentTabs from "../../shared/components/Dashboard/DashboardContentTabs";
import CustomFab from "../../shared/components/Fab/CustomFab";
import Carregando from "../../shared/components/Feedback/Carregando";
import useFormFabs from "../../shared/components/Form/useFormFabs";
import useHandleDelete from "../../shared/components/Form/useHandleDelete";
import useHandleDiscardChanges from "../../shared/components/Form/useHandleDiscardChanges";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import useBlockNavigation from "../../shared/hooks/useBlockNavigation";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import { IBancoAdmin } from "./Banco";
import { useBancoDeleteMutation, useBancoPatchMutation, useBancoPostMutation } from "./BancoMutations";
import { BancoPatchRequestSchema, BancoPostRequestSchema } from "./BancoPayloads";
import { useBancoAdminByBancoIdQuery } from "./BancoQueries";

const BancoFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type BancoFormData = z.infer<typeof BancoFormSchema>;

const BancoFormPage = () => {

	const { bancoId: bancoIdParam } = useParams();
	const bancoId = parseInt(bancoIdParam!);

	const isEditMode = bancoIdParam !== 'add';

	const [banco, setBanco] = useState<IBancoAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useBancoAdminByBancoIdQuery(isEditMode ? bancoId : undefined);

	const { mutateAsync: postBanco } = useBancoPostMutation();
	const { mutateAsync: patchBanco } = useBancoPatchMutation();
	const { mutateAsync: deleteBanco } = useBancoDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<BancoFormData>({
		defaultValues: {
			nome: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(BancoFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: BancoFormData) => {
		try {
			if (isEditMode)
				await patch(data)
			else
				await post(data);
			enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });
		} catch (error: any) {
			console.error(error);
			const errors = error?.response?.data?.errors;
			handleServerErrors(errors);
		}
	}

	const onError = (error: any) => {
		enqueueSnackbar('Falha ao salvar', { variant: 'error' });
		console.error(error);
	}

	const patch = async (data: BancoFormData) => {
		const response = await patchBanco({
			bancoId: bancoId!,
			payload: BancoPatchRequestSchema.parse({
				...data,
			}),
		});
		reset();
		setBanco(response);
	}

	const post = async (data: BancoFormData) => {
		const response = await postBanco({
			payload: BancoPostRequestSchema.parse({
				...data,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/admin/bancos/${response.bancoId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteBanco({
				bancoId: bancoId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/admin/bancos`);
		} catch (error) {
			enqueueSnackbar('Falha ao excluir', { variant: 'error' });
			console.error(error);
		}
	}

	const handleDiscardChanges = useHandleDiscardChanges(reset);
	const handleDelete = useHandleDelete(_delete);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setBanco(result.data!);
			setIsUpdateRequired(false);
		} catch (error) {
			enqueueSnackbar('Falha ao atualizar!', { variant: 'error' });
		} finally {
			setIsUpdating(false);
		}
	}, []);

	useEffect(() => {
		if (isEditMode)
			update();
	}, []);

	useEffect(() => {
		if (banco)
			reset(BancoFormSchema.parse({
				...banco,
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [banco]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['nome'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	return <DashboardContent
		titulo={isEditMode ? 'Editar Banco' : 'Novo Banco'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/admin/bancos`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!banco && isFetching) ? <Carregando /> :
			(!banco && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					{[<Grid key={0} container spacing={1}>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`nome`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Nome"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						{isEditMode && <>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`createdAt`}
									control={control}
									render={({ field, fieldState }) => (
										<DateTimePicker
											{...field}
											label='Criado em'
											disabled
											slotProps={{
												textField: {
													fullWidth: true,
													error: !!(fieldState?.error),
													helperText: fieldState?.error?.message,
												},
											}}
										/>
									)} />
							</Grid>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`updatedAt`}
									control={control}
									render={({ field, fieldState }) => (
										<DateTimePicker
											{...field}
											label='Atualizado em'
											disabled
											slotProps={{
												textField: {
													fullWidth: true,
													error: !!(fieldState?.error),
													helperText: fieldState?.error?.message,
												},
											}}
										/>
									)} />
							</Grid>
						</>}
					</Grid>]}
				</DashboardContentTabs>}
		{errors?.root && <Alert severity='error'>{errors.root?.message}</Alert>}
	</DashboardContent>
}

export default BancoFormPage;