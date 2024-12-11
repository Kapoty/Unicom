import { useEffect, useState } from "react";
import browserHistory from "../utils/browserHistory";
import { useConfirm } from "../components/ConfirmDialog/ConfirmProvider";

const useBlockNavigation = (block: boolean) => {

	const { confirm } = useConfirm();
	
	const [unblockNavigation, setUnblockNavigation] = useState<() => void>();

	useEffect(() => {
		if (block) {

			const unblock = browserHistory.block(async ({ action, location, retry }) => {
				if (await confirm({
					title: 'Deseja realmente sair?',
					message: 'Alterações não salvas serão perdidas',
				})) {
					unblock();
					retry();
				}
			});

			setUnblockNavigation(() => () => {
				unblock();
				setUnblockNavigation(undefined);
			});

			return () => unblockNavigation?.();
		}
		
		unblockNavigation?.();
	}, [block]);

	return unblockNavigation;

};

export default useBlockNavigation;