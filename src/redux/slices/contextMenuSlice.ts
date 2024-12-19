import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isContextShown: false,
    videoMenuOpen: false,
    audioMenuOpen: false,
    subtitleMenuOpen: false,
    subtitleSizeMenu: false,
    serverMenu: false,
    libraryMenu: false,
    libraryMenuSecondary: false,
    seriesMenu: false,
    seasonMenu: false,
    episodeMenu: false,
    mainMenu: false,
    settingsMenu: false,
    folderSelectionMenu: false,
};

const contextMenuSlice = createSlice({
name: 'contextMenu',
initialState,
reducers: {
    closeAllMenus: (state) => {
        state.isContextShown = false;
        state.videoMenuOpen = false;
        state.audioMenuOpen = false;
        state.subtitleMenuOpen = false;
        state.subtitleSizeMenu = false;
        state.libraryMenu = false;
        state.libraryMenuSecondary = false;
        state.seriesMenu = false;
        state.seasonMenu = false;
        state.episodeMenu = false;
        state.mainMenu = false;
        state.serverMenu = false;
    },
    toggleContextMenu: (state) => {
        state.isContextShown = !state.isContextShown;
    },
    closeContextMenu: (state) => {
        state.isContextShown = false;
    },
    toggleVideoMenu: (state) => {
        state.videoMenuOpen = !state.videoMenuOpen;
    },
    toggleAudioMenu: (state) => {
        state.audioMenuOpen = !state.audioMenuOpen;
    },
    toggleSubsMenu: (state) => {
        state.subtitleMenuOpen = !state.subtitleMenuOpen;
    },
    toggleSubsSizeMenu: (state) => {
        state.subtitleSizeMenu = !state.subtitleSizeMenu;
    },
    toggleLibraryMenu: (state) => {
        state.libraryMenu = !state.libraryMenu;
    },
    toggleLibraryMenuSecondary: (state) => {
        state.libraryMenuSecondary = !state.libraryMenuSecondary;
    },
    toggleSeriesMenu: (state) => {
        state.seriesMenu = !state.seriesMenu;
    },
    toggleSeasonMenu: (state) => {
        state.seasonMenu = !state.seasonMenu;
    },
    toggleEpisodeMenu: (state) => {
        state.episodeMenu = !state.episodeMenu;
    },
    toggleMainMenu: (state) => {
        state.mainMenu = !state.mainMenu;
    },
    toggleSettingsMenu: (state) => {
        state.settingsMenu = !state.settingsMenu;
    },
    toggleServerMenu: (state) => {
        state.serverMenu = !state.serverMenu;
    },
    toggleFolderSelectionMenu: (state) => {
        state.folderSelectionMenu = !state.folderSelectionMenu;
    }
},
});

export const { closeAllMenus, closeContextMenu, toggleContextMenu, toggleVideoMenu, toggleAudioMenu, toggleSubsMenu, toggleSubsSizeMenu, toggleLibraryMenu, 
    toggleLibraryMenuSecondary, toggleSeriesMenu, toggleSeasonMenu, toggleEpisodeMenu, toggleMainMenu, toggleSettingsMenu, toggleServerMenu, toggleFolderSelectionMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;
