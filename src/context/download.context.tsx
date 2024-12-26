import { MediaSearchResult } from "@interfaces/SearchResults";
import React, { useContext, useEffect } from "react";
import { useDataContext } from "./data.context";

interface DownloadContextProps {
	loaded: boolean;
	showWindow: boolean;
	setShowWindow: (showWindow: boolean) => void;
	searchQuery: string;
	results: MediaSearchResult[];
	setResults: (results: MediaSearchResult[]) => void;
	videoContent: boolean;
	selectedUrl: string;
	playContent: boolean;
	setSearchQuery: (query: string) => void;
	setVideoContent: (downloadVideos: boolean) => void;
	setSelectedUrl: (url: string) => void;
	setPlayContent: (playContent: boolean) => void;
}

export const DownloadContext = React.createContext<
	DownloadContextProps | undefined
>(undefined);

export const DownloadProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [showWindow, setShowWindow] = React.useState<boolean>(false);
	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const [results, setResults] = React.useState<MediaSearchResult[]>([]);
	const [videoContent, setVideoContent] = React.useState<boolean>(false);
	const [selectedUrl, setSelectedUrl] = React.useState<string>("");
	const [playContent, setPlayContent] = React.useState<boolean>(false);
	const [loaded, setLoaded] = React.useState<boolean>(false);

	const { serverIP } = useDataContext();

	const search = async () => {
		setLoaded(false);

		fetch(`https://${serverIP}/searchMedia/${searchQuery}`)
			.then((response) => response.json())
			.then((data) => {
				setResults(data);
				setLoaded(true);
			})
			.catch((_error) => setResults([]))
			.finally(() => setLoaded(true));
	};

	useEffect(() => {
		if (searchQuery) search();
	}, [searchQuery]);

	return (
		<DownloadContext.Provider
			value={{
				loaded,
				showWindow,
				setShowWindow,
				results,
				setResults,
				searchQuery,
				setSearchQuery,
				videoContent,
				setVideoContent,
				selectedUrl,
				setSelectedUrl,
				playContent,
				setPlayContent,
			}}
		>
			{children}
		</DownloadContext.Provider>
	);
};

// Custom hook to use the DownloadContext
export const useDownloadContext = (): DownloadContextProps => {
	const context = useContext(DownloadContext);
	if (!context) {
		throw new Error(
			"useDownloadContext must be used within a DownloadProvider"
		);
	}
	return context;
};
