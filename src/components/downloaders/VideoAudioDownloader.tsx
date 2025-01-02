import { WindowCloseIcon } from "@components/utils/IconLibrary";
import "./Downloaders.scss";
import VerticalResults from "./utils/VerticalResults";
import VideoAudioSearch from "./utils/VideoAudioSearch";
import { useTranslation } from "react-i18next";
import { useDownloadContext } from "context/download.context";
import ProgressPopUp from "./utils/ProgressPopUp";
import { useWebSocketsContext } from "context/ws.context";
// import { useEffect } from "react";

function VideoAudioDownloader() {
	const { t } = useTranslation();
	const { videoContent, setShowWindow } =
		useDownloadContext();
		const { downloading } = useWebSocketsContext();

	// useEffect(() => {
	// 	if (!downloading) setShowWindow(false);
	// }, [downloading]);

	return (
		<div className="downloader-container">
			<div
				className="downloader-background"
				onClick={() => setShowWindow(false)}
			></div>
			<div className="downloader-window">
				{downloading && <ProgressPopUp />}
				<header>
					<span>
						{videoContent ? t("searchVideos") : t("searchMusic")}
					</span>
					<button
						className="svg-button-desktop-transparent"
						onClick={() => setShowWindow(false)}
					>
						<WindowCloseIcon />
					</button>
				</header>
				<VideoAudioSearch />
				<VerticalResults />
			</div>
		</div>
	);
}

export default VideoAudioDownloader;
