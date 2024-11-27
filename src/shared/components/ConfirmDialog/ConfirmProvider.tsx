import React, { createContext, useContext, useState, ReactNode } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from "@mui/material";

type ConfirmOptions = {
	title?: string;
	message?: ReactNode;
	confirmText?: ReactNode;
	cancelText?: ReactNode;
};

type ConfirmContextType = {
	confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions>({});
	const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => { });

	const confirm = (options: ConfirmOptions): Promise<boolean> =>
		new Promise((resolve) => {
			setOptions(options);
			setResolvePromise(() => resolve);
			setOpen(true);
		});

	const handleClose = (result: boolean) => {
		setOpen(false);
		resolvePromise(result);
	};

	return (
		<ConfirmContext.Provider value={{ confirm }}>
			{children}
			<Dialog open={open} onClose={() => handleClose(false)}>
				<DialogTitle>{options.title || "Confirmação"}</DialogTitle>
				<DialogContent>
					<DialogContentText>{options.message || "Tem certeza?"}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose(false)} color="error">
						{options.cancelText || "Cancelar"}
					</Button>
					<Button onClick={() => handleClose(true)} color="primary" variant="contained">
						{options.confirmText || "Confirmar"}
					</Button>
				</DialogActions>
			</Dialog>
		</ConfirmContext.Provider>
	);
};

export const useConfirm = (): ConfirmContextType => {
	const context = useContext(ConfirmContext);
	if (!context) {
		throw new Error("useConfirm must be used within a ConfirmProvider");
	}
	return context;
};