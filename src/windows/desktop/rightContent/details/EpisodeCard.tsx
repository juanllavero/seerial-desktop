import Image from "@components/image/Image";
import { EpisodeData } from "@interfaces/EpisodeData";
import { toggleEpisodeMenu } from "@redux/slices/contextMenuSlice";
import {
	markEpisodeWatched,
	selectEpisode,
	toggleEpisodeWindow,
} from "@redux/slices/dataSlice";
import { loadVideo } from "@redux/slices/videoSlice";
import { RootState } from "@redux/store";
import { t } from "i18next";
import { ContextMenu } from "primereact/contextmenu";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Card.scss";
import {
	EditIcon,
	PlayIcon,
	TickIcon,
	VerticalDotsIcon,
} from "@components/utils/IconLibrary";

interface EpisodeCardProps {
	episode: EpisodeData;
}

function EpisodeCard({ episode }: EpisodeCardProps) {
	const dispatch = useDispatch();

	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);
	const selectedSeries = useSelector(
		(state: RootState) => state.data.selectedSeries
	);
	const selectedSeason = useSelector(
		(state: RootState) => state.data.selectedSeason
	);
	const cm2 = useRef<ContextMenu | null>(null);
	const episodeImageWidth = useSelector(
		(state: RootState) => state.episodeImage.width
	);
	const episodeImageHeight = useSelector(
		(state: RootState) => state.episodeImage.height
	);

	const handleEpisodeSelection = (episode: EpisodeData) => {
		dispatch(selectEpisode(episode));
		dispatch(loadVideo());

		if (selectedLibrary && selectedSeries && selectedSeason && episode)
			window.electronAPI.startMPV(
				selectedLibrary,
				selectedSeries,
				selectedSeason,
				episode
			);
	};

	return (
		<div className="card">
			<div className="top-section">
				{episode.watched && (
					<div className="watched">
						<TickIcon />
					</div>
				)}
				<div className="on-hover">
					<div className="play-btn-container">
						<button
							className="play-btn-episode"
							onClick={() => handleEpisodeSelection(episode)}
						>
							<PlayIcon />
						</button>
					</div>
					<button
						className="svg-button-desktop-transparent"
						onClick={() => {
							dispatch(selectEpisode(episode));
							dispatch(toggleEpisodeWindow());
						}}
					>
						<EditIcon />
					</button>
					<button
						className="svg-button-desktop-transparent"
						onClick={(e) => {
							dispatch(selectEpisode(episode));
							dispatch(toggleEpisodeMenu());
							cm2.current?.show(e);
						}}
					>
						<VerticalDotsIcon />
					</button>
				</div>
				{false ? (
					<div className="card-slider">
						<input
							type="range"
							min="0"
							max={episode.runtimeInSeconds}
							value={episode.timeWatched}
							step="1"
							style={{
								background: `linear-gradient(to right, #8EDCE6 ${
									episode.timeWatched +
									(1550 * 100) / episode.runtimeInSeconds
								}%, #646464 0px`,
							}}
							className="slider hide-slider-thumb"
						/>
					</div>
				) : null}
				<div className="image-section">
					<Image
						src={episode.imgSrc}
						alt="Video Thumbnail"
						style={{
							aspectRatio: 16/9,
						}}
						errorSrc="/img/Default_video_thumbnail.jpg"
						isRelative={true}
					/>
				</div>
			</div>

			<div className="info-section">
				<span className="a_text" id="title" title={episode.name}>
					{episode.name}
				</span>
				{selectedLibrary?.type === "Shows" ? (
					<span id="subtitle">
						{t("episode") + " " + episode.episodeNumber}
					</span>
				) : null}
			</div>
			<ContextMenu
				model={[
					{
						label: t("editButton"),
						command: () => {
							dispatch(toggleEpisodeMenu());
							dispatch(toggleEpisodeWindow());
						},
					},
					{
						label: t("markWatched"),
						command: () => {
							if (!selectedLibrary || !selectedSeries || !selectedSeason) return;

							dispatch(
								markEpisodeWatched({
									libraryId: selectedLibrary.id,
									seriesId: selectedSeries.id,
									seasonId: selectedSeason.id,
									episodeId: episode.id,
									watched: true,
								})
							);
							dispatch(toggleEpisodeMenu());
						},
					},
					{
						label: t("markUnwatched"),
						command: () => {
							if (!selectedLibrary || !selectedSeries || !selectedSeason) return;
							
							dispatch(
								markEpisodeWatched({
									libraryId: selectedLibrary.id,
									seriesId: selectedSeries.id,
									seasonId: selectedSeason.id,
									episodeId: episode.id,
									watched: false,
								})
							);
							dispatch(toggleEpisodeMenu());
						},
					},
					{
						label: t("removeButton"),
						command: () => {
							// Do something
							dispatch(toggleEpisodeMenu());
						},
					},
				]}
				ref={cm2}
				className="dropdown-menu"
			/>
		</div>
	);
}

export default React.memo(EpisodeCard);
