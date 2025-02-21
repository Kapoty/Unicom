import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Description } from "@mui/icons-material";
import { Alert, FormControl, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";
import { IProdutoAdmin } from "./Produto";
import { useProdutoDeleteMutation, useProdutoPatchMutation, useProdutoPostMutation } from "./ProdutoMutations";
import { ProdutoPatchRequestSchema, ProdutoPostRequestSchema } from "./ProdutoPayloads";
import { useProdutoAdminByEmpresaIdAndProdutoIdQuery } from "./ProdutoQueries";

const ProdutoFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	valor: z.coerce.number(),
	ordem: z.coerce.number(),
	tipoProduto: z.string().min(1, 'obrigatório'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type ProdutoFormData = z.infer<typeof ProdutoFormSchema>;

const ProdutoFormPage = () => {

	const { produtoId: produtoIdParam } = useParams();
	const produtoId = parseInt(produtoIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = produtoIdParam !== 'add';

	const [produto, setProduto] = useState<IProdutoAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useProdutoAdminByEmpresaIdAndProdutoIdQuery(empresaId, isEditMode ? produtoId : undefined);

	const { mutateAsync: postProduto } = useProdutoPostMutation();
	const { mutateAsync: patchProduto } = useProdutoPatchMutation();
	const { mutateAsync: deleteProduto } = useProdutoDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<ProdutoFormData>({
		defaultValues: {
			nome: '',
			valor: 0,
			ordem: 0,
			tipoProduto: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(ProdutoFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: ProdutoFormData) => {
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

	const patch = async (data: ProdutoFormData) => {
		const response = await patchProduto({
			empresaId: empresaId!,
			produtoId: produtoId!,
			payload: ProdutoPatchRequestSchema.parse({
				...data,
			}),
		});
		reset();
		setProduto(response);
	}

	const post = async (data: ProdutoFormData) => {
		const response = await postProduto({
			empresaId: empresaId!,
			payload: ProdutoPostRequestSchema.parse({
				...data,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/cadastros/produtos/${response.produtoId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteProduto({
				empresaId: empresaId!,
				produtoId: produtoId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/e/${empresaId}/cadastros/produtos`);
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
			setProduto(result.data!);
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
		if (produto)
			reset(ProdutoFormSchema.parse({
				...produto,
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [produto]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['nome', 'valor', 'ordem', 'tipoProduto'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	return <DashboardContent
		titulo={isEditMode ? 'Editar Produto' : 'Novo Produto'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/produtos`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!produto && isFetching) ? <Carregando /> :
			(!produto && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					{[<Grid key={0} container spacing={1}>
						<Grid size={{ xs: 6, md: 6 }}>
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
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`valor`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Valor"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
										type="number"
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`ordem`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Ordem"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
										type="number"
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`tipoProduto`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Tipo Produto</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Tipo Produto"
											>
												<MenuItem value=''><em>Selecione</em></MenuItem>
												{Object.keys(VendaTipoProdutoSchema.enum).map((tipoProduto) => <MenuItem key={tipoProduto} value={tipoProduto}>{tipoProduto}</MenuItem>)}
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

export default ProdutoFormPage;