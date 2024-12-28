import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import MainBackgroundImage from "@components/desktop/mainBackgroundImage";
import {
	addEpisode,
	addSeason,
	addSeries,
	selectLibrary,
	setLibraries,
	updateSeries,
} from "redux/slices/dataSlice";
import "./MainDesktop.scss";
import "../utils/utils.scss";
import "../../i18n";
import { toggleMaximize } from "redux/slices/windowStateSlice";
import { closeVideo } from "redux/slices/videoSlice";
import { closeAllMenus, toggleAddServerMenu } from "redux/slices/contextMenuSlice";
import { LibraryData } from "@interfaces/LibraryData";
import { ReactUtils } from "data/utils/ReactUtils";
import { setGradientLoaded } from "redux/slices/imageLoadedSlice";
import { SeriesData } from "@interfaces/SeriesData";
import { SeasonData } from "@interfaces/SeasonData";
import { EpisodeData } from "@interfaces/EpisodeData";
import TopBar from "./rightContent/utils/TopBar";
import EpisodeWindow from "@components/desktop/windows/episodeWindow";
import LibraryWindow from "@components/desktop/windows/libraryWindow";
import SeasonWindow from "@components/desktop/windows/seasonWindow";
import SeriesWindow from "@components/desktop/windows/seriesWindow";
import MusicPlayer from "windows/desktop/rightContent/music/MusicPlayer";
import { useDataContext } from "context/data.context";
import StatusRightPanelMessage from "./rightContent/StatusRightPanelMessage";
import StatusRightPanelMessageAPI from "./rightContent/StatusRightPanelMessageAPI";
import RightContent from "./rightContent/RightContent";
import LeftPanel from "./leftContent/LeftPanel";
import AddServer from "@components/desktop/windows/AddServer";
import ConfigManager from "@data/utils/Configuration";
import { LeftPanelSections } from "@data/enums/Sections";
import { useSectionContext } from "context/section.context";
import SettingsRightPanel from "./rightContent/SettingsRightPanel";
import VideoPlayer from "./VideoPlayer";

function MainDesktop() {
	const dispatch = useDispatch();
	const configManager = ConfigManager.getInstance();
	const { currentLeftSection } = useSectionContext();

	const { serverIP, serverStatus, apiKeyStatus, getServerStatus, setServerIP } =
		useDataContext();

	const isVideoLoaded = useSelector(
		(state: RootState) => state.video.isLoaded
	);

	const gradientLoaded = useSelector(
		(state: RootState) => state.imageLoaded.gradientLoaded
	);

	const selectedSeason = useSelector(
		(state: RootState) => state.data.selectedSeason
	);

	const [gradientBackground, setGradientBackground] = useState<string>("");

	useEffect(() => {
		const getServerIP = async () => {
			setServerIP(await configManager.get("serverIP", ""));
		};

		getServerIP();
	}, []);

	useEffect(() => {
		if (selectedSeason) {
			if (selectedSeason.coverSrc !== "") {
				ReactUtils.getDominantColors(selectedSeason.coverSrc);
			} else {
				ReactUtils.getDominantColors("/img/songDefault.png");
			}

			setTimeout(() => {
				const newGradient = ReactUtils.getGradientBackground();

				if (gradientBackground !== newGradient) {
					dispatch(setGradientLoaded(false));
				}

				setTimeout(() => {
					setGradientBackground(newGradient);

					if (gradientBackground !== newGradient) {
						dispatch(setGradientLoaded(true));
					}
				}, 200);
			}, 300);
		} else {
			setGradientBackground("none");
		}
	}, [selectedSeason]);

	useEffect(() => {
		window.ipcRenderer.on(
			"update-libraries",
			(_event, newLibraries: LibraryData[]) => {
				dispatch(setLibraries(newLibraries));
				ReactUtils.saveLibraries(newLibraries);
			}
		);

		window.ipcRenderer.on(
			"series-updated",
			(_event, libraryID: string, show: SeriesData) => {
				dispatch(updateSeries({ libraryId: libraryID, series: show }));
			}
		);

		window.ipcRenderer.on(
			"add-library",
			(_event, newLibrary: LibraryData, newLibraries: LibraryData[]) => {
				dispatch(setLibraries(newLibraries));
				dispatch(selectLibrary(newLibrary));
				ReactUtils.saveLibraries(newLibraries);
			}
		);

		window.ipcRenderer.on(
			"series-added",
			(_event, libraryID: string, show: SeriesData) => {
				dispatch(addSeries({ libraryId: libraryID, series: show }));
			}
		);

		window.ipcRenderer.on(
			"season-added",
			(_event, libraryID: string, season: SeasonData) => {
				dispatch(addSeason({ libraryId: libraryID, season: season }));
			}
		);

		window.ipcRenderer.on(
			"episode-added",
			(_event, libraryID: string, showID: string, episode: EpisodeData) => {
				dispatch(
					addEpisode({
						libraryId: libraryID,
						showId: showID,
						episode: episode,
					})
				);
			}
		);

		window.electronAPI.onWindowStateChange((state: string) => {
			dispatch(toggleMaximize(state === "maximized"));
		});

		window.ipcRenderer.on("video-stopped", (_event) => {
			dispatch(closeVideo());
		});
	}, []);

	const showControls = () => {
		window.electronAPI.showControls();
	};

	const hideControls = () => {
		window.electronAPI.hideControls();
	};

	return (
		<>
			{isVideoLoaded ? (
				<div
					className={`overlay ${isVideoLoaded ? "visible" : ""}`}
					onMouseMove={showControls}
					onClick={hideControls}
					onKeyDown={showControls}
					onDoubleClick={() => {
						window.electronAPI.setFullscreenControls();
					}}
				/>
			) : null}

			{/* PopUp Windows */}
			<LibraryWindow />
			<SeriesWindow />
			<SeasonWindow />
			<EpisodeWindow />
			<AddServer />

			<VideoPlayer source="https://seerial.sirjohn.es/video?path=F:\\UHD\\Blade Runner Collection\\Blade Runner 2049 (2017)\\Blade Runner 2049.mkv"/>

			<div
				className={`gradient-background ${gradientLoaded ? "fade-in" : ""}`}
				style={{
					background: `${gradientBackground}`,
				}}
			/>
			<section
				className="container blur-background-image"
				onClick={(event) => {
					const target = event.target as Element;

					if (!target.closest(".select")) {
						dispatch(closeAllMenus());
					}
				}}
			>
				<MainBackgroundImage />
				{selectedSeason && selectedSeason.backgroundSrc !== "" && (
					<>
						<div className="background-filter"></div>
						<div className="noise-background"></div>
					</>
				)}

				<MusicPlayer />

				{/* Left Panel */}
				<LeftPanel />

				{/* Right Panel */}
				<section className="right-panel">
					<TopBar />
					{serverIP === ""? (
						<StatusRightPanelMessage
							title={`No hay ningún servidor registrado`}
							subtitle="Registre un servidor para poder utilizar la aplicación."
							containsButton={true}
							action={() => dispatch(toggleAddServerMenu())}
							buttonText="Añadir servidor"
						/>
					) : currentLeftSection === LeftPanelSections.Settings ? (
						<SettingsRightPanel />
					) : !serverStatus ? (
						<StatusRightPanelMessage
							title={`El servidor no está disponible en este momento`}
							subtitle="Verifique que tenga una conexión de red y que el servidor esté en
				línea."
							containsButton={true}
							action={getServerStatus}
							buttonText="Reintentar conexión"
						/>
					) : !apiKeyStatus ? (
						<StatusRightPanelMessageAPI
							title={`El servidor no cuenta con una clave de API`}
							subtitle="Añada una clave de API para TheMovieDB."
							containsButton={true}
							buttonText="Comprobar clave API"
						/>
					) : (
						<RightContent />
					)}
				</section>
			</section>
		</>
	);
}

export default MainDesktop;
