import { WindowSections } from "@data/enums/Sections";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuSection } from "redux/slices/menuSectionsSlice";
import { RootState } from "redux/store";
import { useTranslation } from "react-i18next";
import { toggleSeasonWindow, updateSeason } from "redux/slices/dataSlice";
import ReactPlayer from "react-player";
import VideoAudioDownloader from "../downloaders/VideoAudioDownloader";
import { useDownloadContext } from "context/download.context";
import DialogHeader from "./utils/DialogHeader";
import {
	DownloadIcon,
	RemoveIcon,
	UploadIcon,
} from "@components/utils/IconLibrary";
import ImagesList from "./utils/ImagesList";
import DialogInput from "./utils/DialogInput";
import DialogTags from "./utils/DialogTags";
import DialogTextArea from "./utils/DialogTextArea";
import DialogSectionButton from "./utils/DialogSectionButton";
import DialogFooter from "./utils/DialogFooter";
import DialogDownloading from "./utils/DialogDownloading";
import { useWebSocketsContext } from "context/ws.context";
import { useDataContext } from "context/data.context";

function SeasonWindow() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { serverIP } = useDataContext();
	const { videoContent, setVideoContent, showWindow, setShowWindow } =
		useDownloadContext();

	const { downloading, setDownloading } = useWebSocketsContext();

	const menuSection = useSelector(
		(state: RootState) => state.sectionState.menuSection
	);
	const seasonMenuOpen = useSelector(
		(state: RootState) => state.data.seasonWindowOpen
	);
	const library = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);
	const series = useSelector((state: RootState) => state.data.selectedSeries);
	const season = useSelector((state: RootState) => state.data.selectedSeason);

	const [pasteUrl, setPasteUrl] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [imageDownloaded, setImageDownloaded] = useState<boolean>(false);

	const [backgrounds, setBackgrounds] = useState<string[]>([]);
	const [logos, setLogos] = useState<string[]>([]);
	const [posters, setPosters] = useState<string[]>([]);
	const [selectedBackground, selectBackground] = useState<string | undefined>(
		undefined
	);
	const [selectedLogo, selectLogo] = useState<string | undefined>(undefined);
	const [selectedPoster, selectPoster] = useState<string | undefined>(
		undefined
	);

	const [backgroundsUrls, setBackgroundsUrls] = useState<string[]>([]);
	const [logosUrls, setLogosUrls] = useState<string[]>([]);
	const [coversUrls, setCoversUrls] = useState<string[]>([]);

	//#region ATTRIBUTES
	const [nameLock, setNameLock] = useState<boolean>(false);
	const [orderLock, setOrderLock] = useState<boolean>(false);
	const [yearLock, setYearLock] = useState<boolean>(false);
	const [overviewLock, setOverviewLock] = useState<boolean>(false);
	const [taglineLock, setTaglineLock] = useState<boolean>(false);
	const [studiosLock, setStudiosLock] = useState<boolean>(false);
	const [genresLock, setGenresLock] = useState<boolean>(false);
	const [creatorLock, setCreatorLock] = useState<boolean>(false);
	const [musicLock, setMusicLock] = useState<boolean>(false);
	const [directedByLock, setDirectedByLock] = useState<boolean>(false);
	const [writtenByLock, setWrittenByLock] = useState<boolean>(false);

	const [name, setName] = useState<string>("");
	const [order, setOrder] = useState<number>(0);
	const [year, setYear] = useState<string>("");
	const [overview, setOverview] = useState<string>("");
	const [tagline, setTagline] = useState<string>("");
	const [studios, setStudios] = useState<string[]>([""]);
	const [genres, setGenres] = useState<string[]>([""]);
	const [creator, setCreator] = useState<string[]>([""]);
	const [music, setMusic] = useState<string[]>([""]);
	const [directedBy, setDirectedBy] = useState<string[]>([""]);
	const [writtenBy, setWrittenBy] = useState<string[]>([""]);
	const [videoSrc, setVideoSrc] = useState<string>("");
	const [musicSrc, setMusicSrc] = useState<string>("");
	const [extVideoSrc, setExtVideoSrc] = useState<string>("");
	const [extMusicSrc, setExtMusicSrc] = useState<string>("");
	//#endregion

	// Fetch images
	useEffect(() => {
		const fetchBackgrounds = async () => {
			if (!season) return;

			// Get images from backgrounds folder
			fetch(`https://${serverIP}/images?path=img/backgrounds/${season.id}`)
				.then((response) =>
					response.json().then((data) => setBackgrounds(data))
				)
				.catch((error) => console.error(error))
				.finally(() => setBackgrounds([]));

			if (season.backgroundSrc) selectBackground(season.backgroundSrc);
		};

		const fetchLogos = async () => {
			setPasteUrl(false);

			if (!season) return;

			// Get images from logos folder
			fetch(`https://${serverIP}/images?path=img/logos/${season.id}`)
				.then((response) => response.json().then((data) => setLogos(data)))
				.catch((error) => console.error(error))
				.finally(() => setLogos([]));

			if (season.logoSrc) selectLogo(season.logoSrc);
		};

		const fetchPosters = async () => {
			if (!season) return;

			// Get images from posters folder
			fetch(`https://${serverIP}/images?path=img/posters/${season.id}`)
				.then((response) =>
					response.json().then((data) => setPosters(data))
				)
				.catch((error) => console.error(error))
				.finally(() => setPosters([]));

			if (season.coverSrc) selectPoster(season.coverSrc);
		};

		if (menuSection === WindowSections.Logos && season) {
			fetchLogos().then(() => setImageDownloaded(false));
		} else if (menuSection === WindowSections.Posters && season) {
			fetchPosters().then(() => setImageDownloaded(false));
		} else if (menuSection === WindowSections.Thumbnails && season) {
			fetchBackgrounds().then(() => setImageDownloaded(false));
		}
	}, [menuSection, imageDownloaded, season]);

	// Initialize attributes
	useEffect(() => {
		if (seasonMenuOpen && season) {
			selectBackground("");
			setBackgrounds([]);
			setPosters([]);
			setLogos([]);
			setBackgroundsUrls(season.backgroundsUrls);
			setLogosUrls(season.logosUrls);
			setCoversUrls(season.coversUrls);
			dispatch(changeMenuSection(WindowSections.General));

			setName(season.name || "");
			setOrder(season.order || 0);
			setYear(season.year || "");
			setOverview(season.overview || "");
			setNameLock(season.nameLock || false);
			setOrderLock(season.orderLock || false);
			setYearLock(season.yearLock || false);
			setOverviewLock(season.overviewLock || false);
			setVideoSrc(season.videoSrc || "");
			setMusicSrc(season.musicSrc || "");

			setTagline(season.tagline || "");
			setTaglineLock(season.taglineLock || false);
			setStudiosLock(season.studioLock || false);
			setGenresLock(season.genresLock || false);
			setCreatorLock(season.creatorLock || false);
			setMusicLock(season.musicLock || false);
			setDirectedByLock(season.directedLock || false);
			setWrittenByLock(season.writtenLock || false);
			setStudios(season.productionStudios || []);
			setGenres(season.genres || []);
			setMusic(season.musicComposer || []);
			setCreator(season.creator || []);
			setDirectedBy(season.directedBy || []);
			setWrittenBy(season.writtenBy || []);
		}
	}, [seasonMenuOpen]);

	// Download Music and Video
	useEffect(() => {
		if (seasonMenuOpen && season && !showWindow) {
			if (videoContent) {
				setVideoSrc(`https://${serverIP}/video/${season.id}.webm`);
			} else {
				setMusicSrc(`https://${serverIP}/audio/${season.id}.opus`);
			}
		}
	}, [seasonMenuOpen, showWindow, season]);

	const downloadUrlImage = async (url: string, downloadPath: string) => {
		setPasteUrl(false);
		return await window.ipcRenderer.invoke(
			"download-image-url",
			url,
			downloadPath
		);
	};

	const handleDownloadUrls = async (): Promise<boolean> => {
		if (!season) return false;

		if (selectedLogo && logosUrls && logosUrls.includes(selectedLogo)) {
			await downloadUrlImage(selectedLogo, "img/logos/" + season.id + "/");
		}

		if (selectedPoster && logosUrls && coversUrls.includes(selectedPoster)) {
			await downloadUrlImage(
				selectedPoster,
				"img/posters/" + season.id + "/"
			);
		}

		if (
			selectedBackground &&
			backgroundsUrls &&
			backgroundsUrls.includes(selectedBackground)
		) {
			await downloadUrlImage(
				selectedBackground,
				"img/backgrounds/" + season.id + "/"
			);
		}

		return true;
	};

	const handleSavingChanges = async () => {
		setDownloading(true);

		if (season) {
			if (library?.type !== "Music") {
				await handleDownloadUrls();
			}

			dispatch(
				updateSeason({
					name: name,
					overview: overview,
					year: year,
					order: order,
					id: season.id,
					tagline: library?.type === "Movies" ? tagline : season.tagline,
					score: season.score,
					seasonNumber: season.seasonNumber,
					logoSrc: selectedLogo ? selectedLogo : season.logoSrc,
					coverSrc: selectedPoster ? selectedPoster : season.coverSrc,
					backgroundSrc: selectedBackground
						? selectedBackground
						: season.backgroundSrc,
					videoSrc: videoSrc ? videoSrc : season.videoSrc,
					musicSrc: musicSrc ? musicSrc : season.musicSrc,
					seriesID: season.seriesID,
					themdbID: season.themdbID,
					imdbID: season.imdbID,
					lastDisc: season.lastDisc,
					folder: season.folder,
					showName: season.showName,
					audioTrackLanguage: season.audioTrackLanguage,
					selectedAudioTrack: season.selectedAudioTrack,
					subtitleTrackLanguage: season.subtitleTrackLanguage,
					selectedSubtitleTrack: season.selectedSubtitleTrack,
					episodes: season.episodes,
					genres: season.genres,
					currentlyWatchingEpisode: season.currentlyWatchingEpisode,
					cast: season.cast,
					creator: season.creator,
					musicComposer: season.musicComposer,
					directedBy: season.directedBy,
					writtenBy: season.writtenBy,
					productionStudios:
						library?.type === "Movies"
							? studios
							: season.productionStudios,
					nameLock: season.nameLock,
					orderLock: orderLock,
					overviewLock: season.overviewLock,
					yearLock: season.yearLock,
					studioLock: season.studioLock,
					taglineLock: season.taglineLock,
					creatorLock: false,
					musicLock: false,
					directedLock: false,
					writtenLock: false,
					genresLock: false,
					logosUrls: season.logosUrls,
					coversUrls: season.coversUrls,
					backgroundsUrls: season.backgroundsUrls,
					watched: season.watched,
				})
			);
		}

		setDownloading(false);
		dispatch(toggleSeasonWindow());
	};

	return (
		<>
			{showWindow && <VideoAudioDownloader />}
			<section
				className={`dialog ${seasonMenuOpen ? " dialog-active" : ""}`}
			>
				<div
					className="dialog-background"
					onClick={() => {
						if (!downloading) {
							dispatch(toggleSeasonWindow());
						}
					}}
				></div>
				<div className="dialog-box">
					<DialogDownloading downloadingContent={downloading} />
					<DialogHeader
						title={
							t("editButton") +
							": " +
							(library?.type === "Shows"
								? series?.name + " - " + season?.name
								: season?.name)
						}
						onClose={() => dispatch(toggleSeasonWindow())}
					/>
					<section className="dialog-center">
						<div className="dialog-center-left">
							<DialogSectionButton
								title={t("generalButton")}
								section={WindowSections.General}
							/>
							{library?.type === "Movies" ? (
								<DialogSectionButton
									title={t("tags")}
									section={WindowSections.Tags}
								/>
							) : null}
							{library?.type !== "Music" && (
								<>
									<DialogSectionButton
										title={t("media")}
										section={WindowSections.Details}
									/>

									<DialogSectionButton
										title={t("backgroundImage")}
										section={WindowSections.Thumbnails}
									/>
								</>
							)}
							{library?.type === "Movies" && (
								<>
									<DialogSectionButton
										title={t("logosButton")}
										section={WindowSections.Logos}
									/>
								</>
							)}
							{library?.type !== "Shows" && (
								<DialogSectionButton
									title={t("postersButton")}
									section={WindowSections.Posters}
								/>
							)}
						</div>
						<div className="dialog-center-right scroll">
							{menuSection === WindowSections.General ? (
								<>
									<DialogInput
										type="text"
										title={t("name")}
										value={name}
										setValue={setName}
										lock={nameLock}
										setLock={setNameLock}
									/>
									<DialogInput
										type="number"
										title={t("sortingOrder")}
										value={order}
										setValue={setOrder}
										lock={orderLock}
										setLock={setOrderLock}
									/>
									<DialogInput
										type="text"
										title={t("year")}
										value={year}
										setValue={setYear}
										lock={yearLock}
										setLock={setYearLock}
									/>

									{library?.type === "Movies" && (
										<>
											<DialogTags
												title={t("studios")}
												value={studios}
												setValue={setStudios}
												lock={studiosLock}
												setLock={setStudiosLock}
											/>
											<DialogInput
												type="text"
												title={t("tagline")}
												value={tagline}
												setValue={setTagline}
												lock={taglineLock}
												setLock={setTaglineLock}
											/>
										</>
									)}

									{library?.type === "Music" && (
										<DialogTags
											title={t("genres")}
											value={genres}
											setValue={setGenres}
											lock={genresLock}
											setLock={setGenresLock}
										/>
									)}

									{library?.type !== "Music" && (
										<DialogTextArea
											title={t("overview")}
											value={overview}
											setValue={setOverview}
											lock={overviewLock}
											setLock={setOverviewLock}
										/>
									)}
								</>
							) : menuSection === WindowSections.Tags ? (
								<>
									<DialogTags
										title={t("genres")}
										value={genres}
										setValue={setGenres}
										lock={genresLock}
										setLock={setGenresLock}
									/>
									<DialogTags
										title={t("createdBy")}
										value={creator}
										setValue={setCreator}
										lock={creatorLock}
										setLock={setCreatorLock}
									/>
									<DialogTags
										title={t("directedBy")}
										value={directedBy}
										setValue={setDirectedBy}
										lock={directedByLock}
										setLock={setDirectedByLock}
									/>
									<DialogTags
										title={t("writtenBy")}
										value={writtenBy}
										setValue={setWrittenBy}
										lock={writtenByLock}
										setLock={setWrittenByLock}
									/>
									<DialogTags
										title={t("musicBy")}
										value={music}
										setValue={setMusic}
										lock={musicLock}
										setLock={setMusicLock}
									/>
								</>
							) : menuSection === WindowSections.Details ? (
								<>
									<div
										className="dialog-horizontal-box"
										style={{ justifyContent: "start" }}
									>
										<div
											className="dialog-background-buttons"
											style={{ width: "40%" }}
										>
											<span>{t("backgroundMusic")}</span>
											<div className="media-input">
												<button
													className="desktop-dialog-btn"
													onClick={() =>
														dispatch(toggleSeasonWindow())
													}
												>
													<UploadIcon />
												</button>
												<button
													className="desktop-dialog-btn"
													onClick={() => {
														setVideoContent(false);
														setShowWindow(true);
													}}
												>
													<DownloadIcon />
												</button>
												<button
													className="desktop-dialog-btn"
													onClick={() => {
														setExtMusicSrc("");
														setMusicSrc("");
													}}
												>
													<RemoveIcon />
												</button>
											</div>
										</div>
										<div
											style={{
												width: "60%",
												height: "100%",
												display: "flex",
												justifyContent: "end",
												alignItems: "center",
											}}
										>
											{extMusicSrc && extMusicSrc !== "" ? (
												<ReactPlayer
													url={extMusicSrc}
													controls
													height="50px"
													width="100%"
												/>
											) : (
												<span>{t("noMusicFound")}</span>
											)}
										</div>
									</div>
									<div className="dialog-horizontal-box">
										<div className="dialog-background-buttons">
											<span>{t("backgroundVideo")}</span>
											<div>
												<button
													className="desktop-dialog-btn"
													onClick={() =>
														dispatch(toggleSeasonWindow())
													}
												>
													<UploadIcon />
												</button>
												<button
													className="desktop-dialog-btn"
													onClick={() => {
														setVideoContent(true);
														setShowWindow(true);
													}}
												>
													<DownloadIcon />
												</button>
												<button
													className="desktop-dialog-btn"
													onClick={() => {
														setExtVideoSrc("");
														setVideoSrc("");
													}}
												>
													<RemoveIcon />
												</button>
											</div>
										</div>
										{extVideoSrc && extVideoSrc !== "" ? (
											<ReactPlayer
												url={extVideoSrc}
												controls
												width="60%"
												height="auto"
											/>
										) : (
											<span>{t("noVideoFound")}</span>
										)}
									</div>
								</>
							) : menuSection === WindowSections.Logos ? (
								<ImagesList
									images={logos}
									imageWidth={290}
									imagesUrls={logosUrls}
									setImagesUrls={setLogosUrls}
									downloadPath={`img/logos/${season?.id}/`}
									selectedImage={selectedLogo}
									selectImage={selectLogo}
									setImageDownloaded={setImageDownloaded}
								/>
							) : menuSection === WindowSections.Posters ? (
								<ImagesList
									images={posters}
									imageWidth={185}
									imagesUrls={coversUrls}
									setImagesUrls={setCoversUrls}
									downloadPath={`img/posters/${season?.id}/`}
									selectedImage={selectedPoster}
									selectImage={selectPoster}
									setImageDownloaded={setImageDownloaded}
								/>
							) : menuSection === WindowSections.Thumbnails ? (
								<ImagesList
									images={backgrounds}
									imageWidth={290}
									imagesUrls={backgroundsUrls}
									setImagesUrls={setBackgroundsUrls}
									downloadPath={`img/thumbnails/video/${season?.id}/`}
									selectedImage={selectedBackground}
									selectImage={selectBackground}
									setImageDownloaded={setImageDownloaded}
								/>
							) : null}
						</div>
					</section>
					<DialogFooter
						downloadingContent={downloading}
						handleSavingChanges={handleSavingChanges}
						action={() => dispatch(toggleSeasonWindow())}
					/>
				</div>
			</section>
		</>
	);
}

export default SeasonWindow;
