import React, { useContext, useEffect, useState } from "react";
import { useDataContext } from "./data.context";
import { SeriesData } from "@interfaces/SeriesData";

interface WebSocketsContextProps {
	downloading: boolean;
	setDownloading: React.Dispatch<React.SetStateAction<boolean>>;
	downloadPercentage: number;
	setDownloadPercentage: React.Dispatch<React.SetStateAction<number>>;
	analyzing: boolean;
	setAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
	seriesReceived: SeriesData | null;
	setSeriesReceived: React.Dispatch<React.SetStateAction<SeriesData | null>>;
	downloadAudio: (elementId: string, url: string) => Promise<void>;
	downloadVideo: (elementId: string, url: string) => Promise<void>;
}

export const WebSocketsContext = React.createContext<
	WebSocketsContextProps | undefined
>(undefined);

export const WebSocketsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { serverIP } = useDataContext();
	const [downloading, setDownloading] = React.useState<boolean>(false);
	const [downloadPercentage, setDownloadPercentage] =
		React.useState<number>(0);
	const [analyzing, setAnalyzing] = React.useState<boolean>(false);
	const [seriesReceived, setSeriesReceived] =
		React.useState<SeriesData | null>(null);

	const [ws, setWS] = useState<WebSocket | null>(null);

	useEffect(() => {
		if (!serverIP) return;

		setWS(new WebSocket(`ws://${serverIP}/ws`));
	}, [serverIP]);

	useEffect(() => {
		if (!ws) return;

		ws.onopen = () => {
			console.log("WebSocket connected");
		};

		ws.onmessage = (event) => {
			// Los mensajes vienen como cadenas JSON
			const message = JSON.parse(event.data);

			// Verificar el tipo de mensaje (en este caso, DOWNLOAD_PROGRESS)
			if (message.header === "DOWNLOAD_PROGRESS") {
				// Actualizar la interfaz con el progreso
				setDownloadPercentage(message.body);
			} else if (message.header === "DOWNLOAD_ERROR") {
				setDownloading(false);
			} else if (message.header === "DOWNLOAD_COMPLETE") {
				setDownloading(false);
			} else if (message.header === "RECEIVE_SERIES") {
				setSeriesReceived(message.body);
			}
		};

		ws.onclose = () => {
			setDownloading(false);
			setAnalyzing(false);
		};
	}, [ws]);

	const downloadVideo = async (elementId: string, url: string) => {
		setDownloadPercentage(0);
		setDownloading(true);

		fetch(`https:${serverIP}/downloadVideo`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: url,
				downloadFolder: "resources/video/",
				fileName: elementId,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Download started:", data);
			})
			.catch((error) => {
				console.error("Error downloading media:", error);
			});
	};

	const downloadAudio = async (elementId: string, url: string) => {
		setDownloadPercentage(0);
		setDownloading(true);

		fetch(`https:${serverIP}/downloadMusic`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: url,
				downloadFolder: "resources/music/",
				fileName: elementId,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Download started:", data);
			})
			.catch((error) => {
				console.error("Error downloading media:", error);
			});
	};

	return (
		<WebSocketsContext.Provider
			value={{
				downloading,
				setDownloading,
				downloadPercentage,
				setDownloadPercentage,
				analyzing,
				setAnalyzing,
				seriesReceived,
				setSeriesReceived,
				downloadAudio,
				downloadVideo,
			}}
		>
			{children}
		</WebSocketsContext.Provider>
	);
};

// Custom hook to use the WebSocketsContext
export const useWebSocketsContext = (): WebSocketsContextProps => {
	const context = useContext(WebSocketsContext);
	if (!context) {
		throw new Error(
			"useDownloadContext must be used within a WebSocketsProvider"
		);
	}
	return context;
};
