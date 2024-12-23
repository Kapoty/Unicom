import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, CloudUpload, Delete, Description, Watch } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, ButtonGroup, Chip, Fab, FormControl, FormHelperText, Grid2 as Grid, IconButton, InputLabel, MenuItem, Select, SvgIcon, TextField, Tooltip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import DashboardContentTab from "../../shared/components/Dashboard/DashboardContentTab";
import DashboardContentTabs from "../../shared/components/Dashboard/DashboardContentTabs";
import CustomFab from "../../shared/components/Fab/CustomFab";
import Carregando from "../../shared/components/Feedback/Carregando";
import useFormFabs from "../../shared/components/Form/useFormFabs";
import useHandleDiscardChanges from "../../shared/components/Form/useHandleDiscardChanges";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import useBlockNavigation from "../../shared/hooks/useBlockNavigation";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import { AparenciaCorSchema, IEmpresa } from "./Empresa";
import { useEmpresaQuery } from "./EmpresaQueries";
import { useEmpresaAparenciaPatchMutation } from "./EmpresaMutations";
import { EmpresaAparenciaPatchRequestSchema } from "./EmpresaPayloads";
import { colors } from "../../shared/utils/themeUtils";
import { getArquivoUrl } from "./EmpresaService";
import NoImageIcon from '../../assets/svg/no-image.svg';
import { toBase64 } from "../../shared/utils/fileUtils";

const EmpresaAparenciaFormSchema = z.object({
	icone: z.nullable(z.string()),
	novoIcone: z.optional(z.nullable(z.string())),
	cor: z.string(),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type EmpresaAparenciaFormData = z.infer<typeof EmpresaAparenciaFormSchema>;

const EmpresaForm = () => {

	const empresaId = useEmpresaIdParam();

	const isEditMode = true;

	const [empresa, setEmpresa] = useState<IEmpresa>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useEmpresaQuery(empresaId);

	const { mutateAsync: patchEmpresaAparencia } = useEmpresaAparenciaPatchMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control,
		watch
	} = useForm<EmpresaAparenciaFormData>({
		defaultValues: {
			icone: null,
			novoIcone: undefined,
			cor: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(EmpresaAparenciaFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: EmpresaAparenciaFormData) => {
		try {
			if (isEditMode)
				await patch(data)
			enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });
		} catch (error: any) {
			const errors = error?.response?.data?.errors;
			handleServerErrors(errors);
		}
	}

	const onError = (error: any) => {
		enqueueSnackbar('Falha ao salvar', { variant: 'error' });
		console.error(error);
	}

	const patch = async (data: EmpresaAparenciaFormData) => {
		const response = await patchEmpresaAparencia({
			empresaId: empresaId!,
			payload: EmpresaAparenciaPatchRequestSchema.parse({
				...data,
				icone: undefined,
				...(novoIcone !== undefined ? {icone: novoIcone} : {}),
				cor: data.cor !== '' ? data.cor : null,
			}),
		});
		reset();
		setEmpresa(response);
	}

	const handleDiscardChanges = useHandleDiscardChanges(reset);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setEmpresa(result.data!);
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
		if (empresa)
			reset(EmpresaAparenciaFormSchema.parse({
				...empresa,
				icone: empresa?.aparencia?.icone ?? null,
				novoIcone: undefined,
				cor: empresa?.aparencia?.cor ? empresa.aparencia.cor : '',
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [empresa]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ["cor"].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges);

	const icone = watch('icone');
	const novoIcone = watch('novoIcone');

	const handleIconeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			toBase64(file).then((base64) => {
				if (!base64?.startsWith('data:image/png;base64'))
					throw new Error();
				setValue('novoIcone', base64?.toString());
			}).catch((error) => {
				console.error(error);
				enqueueSnackbar({message: 'Arquivo inválido!', variant: 'error'});
			});
		}
	}

	const handleIconeDiscard: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setValue('novoIcone', undefined);
	}

	const handleIconeDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setValue('novoIcone', null);
	}

	return <DashboardContent
		titulo='Aparência'
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!empresa && isFetching) ? <Carregando /> :
			(!empresa && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Aparência" key={0} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					{[<Grid key={0} container spacing={1}>
						<Grid container size={12}>
							<Grid size={12} container justifyContent='center'>
								Ícone
							</Grid>
							<Grid size={12} container justifyContent='center'>
								{novoIcone === undefined ? <Avatar variant='square' src={icone !== null ? getArquivoUrl(empresaId!, icone!) : undefined}><SvgIcon component={NoImageIcon} inheritViewBox /></Avatar>
								: <Avatar variant='square' src={novoIcone ?? undefined}><SvgIcon component={NoImageIcon} inheritViewBox /></Avatar>}
							</Grid>
							<Grid size={12} container justifyContent='center' gap={1}>
								<Tooltip title='Alterar'>
									<Box>
										<Fab component='label' size='small'>
											<CloudUpload />
											<input type="file" accept="image/png" id="foto-perfil" hidden onChange={handleIconeChange} />
										</Fab>
									</Box>
								</Tooltip>
								{(icone || novoIcone) && novoIcone !== null &&
									<Tooltip title='Excluir'>
										<Box>
											<Fab color='error' onClick={handleIconeDelete} size='small'>
												<Delete />
											</Fab>
										</Box>
									</Tooltip>
								}
							</Grid>
							{errors?.icone && <Grid size={12}><Alert severity='error'>{errors?.icone.message}</Alert></Grid>}
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`cor`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Cor</InputLabel>
										<Select
											{...field}
											variant="filled"
											label="Papel"
										>
											<MenuItem value={''}><em>Padrão</em></MenuItem>
											{Object.keys(colors).map((color) => <MenuItem key={color} value={color}><Chip sx={{ 'backgroundColor': `${colors?.[color as keyof typeof colors]?.[800]} !important` }} label={color} /></MenuItem>)}
										</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
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

export default EmpresaForm;