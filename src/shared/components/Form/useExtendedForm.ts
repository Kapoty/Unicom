import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm, UseFormProps } from "react-hook-form";
import { formatCnpj } from "../../utils/cnpjUtils";

export interface UseExtendedFormProps extends UseFormProps {
	isEditMode: boolean;
}
/*
const useExtendedForm = <TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined>(props: UseExtendedFormProps) => {

	const { isEditMode, ...rest } = props;
	
	const [defaultValues, setDefaultValues] = useState<FieldValues>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const form = useForm<FieldValues>({
		disabled: isUpdating,
		...rest
	});

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;

			setDefaultValues(result.data!);
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
		if (defaultValues)
			reset(EmpresaFormSchema.parse({
				...defaultValues,
				cnpj: formatCnpj(defaultValues.cnpj),
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [defaultValues]);

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	return {
		...form,
		defaultValues: defaultValues,
		setDefaultValues: setDefaultValues,
		isUpdating: isUpdating,
		setIsUpdating: setIsUpdating,
		isUpdateRequired: isUpdateRequired,
		setIsUpdateRequired: setIsUpdateRequired,
		isNewDataAvailable: isNewDataAvailable,
		setIsNewDataAvailable: setIsNewDataAvailable,
	}
}

export default useExtendedForm;*/