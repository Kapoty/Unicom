import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
	queries: {
		//staleTime: 300000
	}
});

export default queryClient;