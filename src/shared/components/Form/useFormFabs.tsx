import { Refresh, Save, Cancel, Delete } from "@mui/icons-material";
import CustomFab from "../Fab/CustomFab";

const useFormFabs = (
	key: number,
	isEditMode: boolean,
	isNewDataAvailable: boolean,
	isUpdateRequired: boolean,
	update: any,
	isUpdating: boolean,
	handleSubmit: any,
	onSubmit: any,
	onError: any,
	isDirty: boolean,
	isSubmitting: boolean,
	handleDiscardChanges: any,
	handleDelete?: any,
) => {

	return [
		...(isEditMode ? [<CustomFab tooltip={{ title: !isNewDataAvailable ? 'Atualizar' : 'Nova Atualização', ...(isUpdateRequired ? { open: true } : {}) }} tooltipKey={isUpdateRequired ? 1 : 0} badge={{ invisible: !isNewDataAvailable }} key={key} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>] : []),
		<CustomFab tooltip={{ title: 'Salvar' }} key={key + 1} onClick={handleSubmit(onSubmit, onError)} color='success' disabled={!isDirty || isSubmitting} loading={isSubmitting}><Save /></CustomFab>,
		...(isDirty ? [<CustomFab tooltip={{ title: 'Descartar Alterações' }} key={key + 2} onClick={handleDiscardChanges} color='error' disabled={isSubmitting}><Cancel /></CustomFab>] : []),
		...(isEditMode && !!handleDelete ? [<CustomFab tooltip={{ title: 'Excluir' }} key={key + 3} onClick={handleDelete} color='error' ><Delete /></CustomFab>] : []),
	]

}

export default useFormFabs;