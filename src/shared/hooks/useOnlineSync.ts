import { useEffect, useState } from "react";
import useAppStore from "../state/useAppStore";

const useEmpresaSync = () => {
    const setOnline = useAppStore(s => s.setOnline);
	const setOffline = useAppStore(s => s.setOffline);

    useEffect(() => {
		window.addEventListener("online", setOnline);
		window.addEventListener("offline", setOffline);

        
		return () => {
			window.removeEventListener("online", setOnline);
			window.removeEventListener("offline", setOffline);
		}
    }, []);
}

export default useEmpresaSync;