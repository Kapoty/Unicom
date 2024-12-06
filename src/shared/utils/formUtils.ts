import { FieldValues, Path, UseFormSetError } from "react-hook-form";

type ErrorResponse = Record<string, string>;

export const handleServerErrors = <TFieldValues extends FieldValues>(errors: ErrorResponse, setError: UseFormSetError<TFieldValues>): void => {
	if (errors)
		Object.entries(errors).forEach(([field, message]) => {
			setError(field as Path<TFieldValues>, { type: "server", message });
		});
	else
		setError('root', {message: 'Oops, algo inesperado aconteceu. Por favor, tente novamente.'});
}