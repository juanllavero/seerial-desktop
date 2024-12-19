import { useState, useCallback } from "react";

// Custom hook to fetch data from an API
const useFetch = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(
		async (
			url: string,
			onSuccess: (data: any) => void,
			onError: (error: any) => void = () => {},
			onFinally: () => void = () => {},
			options: RequestInit = {}
		) => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(url, options);

				if (!response.ok) {
					throw new Error(
						`Error ${response.status}: ${response.statusText}`
					);
				}

				const data = await response.json();
				onSuccess(data);
			} catch (err) {
				onError(err);
			} finally {
				setLoading(false);
				onFinally();
			}
		},
		[]
	);

	return { fetchData, loading, error };
};

export default useFetch;
