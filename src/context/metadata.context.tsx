import React, { useContext, useEffect } from "react";
import { IdentificationResult } from "@interfaces/IdentificationResult";
import { EpisodeGroupResult } from "@interfaces/EpisodeGroupResult";
import { useDataContext } from "./data.context";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

interface MetadataContextProps {
  showCIWindow: boolean;
  setShowCIWindow: (showWindow: boolean) => void;
  showEGWindow: boolean;
  setShowEGWindow: (showWindow: boolean) => void;
  identificationResults: IdentificationResult[];
  setIdentificationResults: (results: IdentificationResult[]) => void;
  episodeGroupsResults: EpisodeGroupResult[];
  setEpisodeGroupsResults: (results: EpisodeGroupResult[]) => void;
  loaded: boolean;
  setLoaded: (loading: boolean) => void;
  searchContent: (isShow: boolean, name: string, year: number) => void;
  searchEpisodeGroups: (showId: number) => void;
}

export const MetadataContext = React.createContext<
  MetadataContextProps | undefined
>(undefined);

export const MetadataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const selectedLibrary = useSelector(
    (state: RootState) => state.data.selectedLibrary
  );
  const selectedShow = useSelector((state: RootState) => state.data.selectedSeries);
  const selectedMovie = useSelector((state: RootState) => state.data.selectedSeason);
  const { serverIP } = useDataContext();
  const [showCIWindow, setShowCIWindow] = React.useState(false);
  const [showEGWindow, setShowEGWindow] = React.useState(false);
  const [identificationResults, setIdentificationResults] =
    React.useState<IdentificationResult[]>([]);
  const [episodeGroupsResults, setEpisodeGroupsResults] =
    React.useState<EpisodeGroupResult[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  useEffect(() => {
    if (!showCIWindow || !selectedLibrary) return;

    if (selectedLibrary.type === 'Movies' && selectedMovie) {
      searchContent(false, selectedMovie.name, 1);
    } else if (selectedLibrary.type === 'Shows' && selectedShow) {
      searchContent(true, selectedShow.name, 1);
    }

  }, [showCIWindow])

  useEffect(() => {
    if (!showEGWindow || !selectedShow) return;

    searchEpisodeGroups(selectedShow.themdbID);
  })

  const searchContent = (isShow: boolean, name: string, year: number) => {
    setLoaded(false);
    setIdentificationResults([]);

    fetch(`https://${serverIP}/${isShow ? 'shows' : 'movies'}/search?name=${name}&year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        setIdentificationResults(data);
        setLoaded(true);
      })
      .catch((_error) => setIdentificationResults([]))
      .finally(() => setLoaded(true));
  }

  const searchEpisodeGroups = (showId: number) => {
    setLoaded(false);
    setEpisodeGroupsResults([]);

    fetch(`https://${serverIP}/episodeGroups/search?id=${showId}`)
      .then((response) => response.json())
      .then((data) => {
        setEpisodeGroupsResults(data);
        setLoaded(true);
      })
      .catch((_error) => setEpisodeGroupsResults([]))
      .finally(() => setLoaded(true));
  }

  return (
    <MetadataContext.Provider
      value={{
        loaded,
        setLoaded,
        showCIWindow,
        setShowCIWindow,
        showEGWindow,
        setShowEGWindow,
        identificationResults,
        setIdentificationResults,
        episodeGroupsResults,
        setEpisodeGroupsResults,
        searchContent,
        searchEpisodeGroups
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

// Custom hook to use the MetadataContext
export const useMetadataContext = (): MetadataContextProps => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error(
      "useMetadataContext must be used within a MetadataProvider"
    );
  }
  return context;
};
