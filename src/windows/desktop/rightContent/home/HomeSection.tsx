import { RightPanelSections } from "@data/enums/Sections";
import { EpisodeData } from "@interfaces/EpisodeData";
import { LibraryData } from "@interfaces/LibraryData";
import { SeasonData } from "@interfaces/SeasonData";
import { SeriesData } from "@interfaces/SeriesData";
import { RootState } from "@redux/store";
import { useSectionContext } from "context/section.context";
import { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./HomeSection.scss";
import Loading from "@components/utils/Loading";
import ContentCard from "./ContentCard";

function HomeSection() {
	const { t } = useTranslation();

	const { setCurrentRightSection } = useSectionContext();

	const libraries = useSelector((state: RootState) => state.data.libraries);
	const selectedLibrary = useSelector(
		(state: RootState) => state.data.selectedLibrary
	);

	// Reducers for images size
	const seriesImageWidth = useSelector(
		(state: RootState) => state.seriesImage.width
	);

	const [currentlyWatchingShows, setCurrentlyWatchingShows] = useState<
		{
			library: LibraryData;
			show: SeriesData;
			season: SeasonData;
			episode: EpisodeData;
		}[]
	>([]);

	useEffect(() => {
		if (libraries.length === 0) {
			setCurrentRightSection(RightPanelSections.NoContent);
			return;
		}

		setCurrentlyWatchingShows([]);
		for (const library of libraries) {
			if (!library || !library.series) continue;
			
			for (const show of library.series) {
				if (
					!show.seasons ||
					show.seasons.length <= 0 ||
					show.currentlyWatchingSeason === -1
				)
					continue;

				// Get sorted seasons
				const seasons = [...show.seasons].sort((a, b) => {
					if (a.order !== 0 && b.order !== 0) {
						return a.order - b.order;
					}
					if (a.order === 0 && b.order === 0) {
						return (
							new Date(a.year).getTime() - new Date(b.year).getTime()
						);
					}
					return a.order === 0 ? 1 : -1;
				});

				// Get currently watching season
				const season = seasons[show.currentlyWatchingSeason];

				if (season) {
					if (
						!season.episodes ||
						season.episodes.length <= 0 ||
						season.currentlyWatchingEpisode === -1
					)
						continue;

					// Get sorted episodes
					const episodes = [...season.episodes].sort(
						(a, b) => a.episodeNumber - b.episodeNumber
					);

					const episode = episodes[season.currentlyWatchingEpisode];

					if (episode) {
						setCurrentlyWatchingShows((prevElements) => [
							...prevElements,
							{
								library,
								show,
								season,
								episode,
							},
						]);
					}
				}
			}
		}
	}, [libraries, selectedLibrary]);

	return (
		<Suspense fallback={<Loading />}>
			{currentlyWatchingShows.length > 0 ? (
				<div className="home-view-container">
					<span id="section-title">{t("continueWatching")}</span>
					<div className="container scroll" id="scroll">
						{[...currentlyWatchingShows].map(
							(value: {
								library: LibraryData;
								show: SeriesData;
								season: SeasonData;
								episode: EpisodeData;
							}) => (
								<ContentCard
									key={value.show.id}
									library={value.library}
									show={value.show}
									season={value.season}
									episode={value.episode}
								/>
							)
						)}
					</div>
				</div>
			) : (
				<h2>You are not watching any series</h2>
			)}
		</Suspense>
	);
}

export default HomeSection;
