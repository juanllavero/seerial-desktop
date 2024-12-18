import React, { useContext, useEffect } from "react";

interface DataContextProps {
	currentServer: Server | undefined;
	setCurrentServer: (server: Server) => void;
	serverStatus: boolean;
	gettingServerStatus: boolean;
	apiKeyStatus: boolean;
	gettingApiKeyStatus: boolean;
	getServerStatus: () => void;
	serverList: Server[];
	setServerList: (serverList: Server[]) => void;
	setApiKey: (apiKey: string) => void;
	serverForMenu: Server | undefined;
	setServerForMenu: (server: Server) => void;
}

export const DataContext = React.createContext<DataContextProps | undefined>(
	undefined
);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentServer, setCurrentServer] = React.useState<Server | undefined>(
		undefined
	);
	const [serverForMenu, setServerForMenu] = React.useState<Server | undefined>();
	const [serverStatus, setServerStatus] = React.useState<boolean>(false);
	const [gettingServerStatus, setGettingServerStatus] =
		React.useState<boolean>(false);
	const [apiKeyStatus, setApiKeyStatus] = React.useState<boolean>(false);
	const [gettingApiKeyStatus, setGettingApiKeyStatus] =
		React.useState<boolean>(false);
	const [serverList, setServerList] = React.useState<Server[]>([]);

	// Check server status and api key status every time the currentServer changes
	useEffect(() => {
		getServerStatus();
	}, [currentServer]);

	useEffect(() => {
		if (serverList && serverList.length > 0) {
			setCurrentServer(serverList[0]);
		}
	}, [serverList]);

	// Check server status and api key status
	const getServerStatus = async () => {
		if (!currentServer) return;

		setGettingServerStatus(true);

		// Promise that rejects after 10 seconds
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(
				() => reject(new Error("Timeout: The request took too long")),
				10000
			)
		);

		// Fetch server status
		const fetchPromise = fetch(`http://${currentServer.ip}:3000/`).then(
			(response) => response.json()
		);

		try {
			// Cancel fetch if 10 seconds pass
			const data = await Promise.race([fetchPromise, timeoutPromise]);
			setServerStatus(data.status != undefined);

			console.log(data.status);

			setApiKeyStatus(data.status === "VALID_API_KEY");
			setGettingApiKeyStatus(false);
		} catch (error) {
			setServerStatus(false);
		} finally {
			setGettingServerStatus(false);
		}
	};

	// Set api key in server
	const setApiKey = async (apiKey: string) => {
		if (!currentServer) return;

		setGettingApiKeyStatus(true);
		const response = await fetch(`http://${currentServer.ip}:3000/api-key`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ apiKey: apiKey }),
		});
		const data = await response.json();

		setApiKeyStatus(data.status === "VALID_API_KEY");
		setGettingApiKeyStatus(false);
	};

	return (
		<DataContext.Provider
			value={{
				currentServer,
				setCurrentServer,
				serverStatus,
				gettingServerStatus,
				apiKeyStatus,
				gettingApiKeyStatus,
				getServerStatus,
				serverList,
				setServerList,
				setApiKey,
				serverForMenu,
				setServerForMenu,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

// Custom hook to use the DataContext
export const useDataContext = (): DataContextProps => {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error("useDataContext must be used within a DataProvider");
	}
	return context;
};
