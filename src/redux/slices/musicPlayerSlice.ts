import { EpisodeData } from '@interfaces/EpisodeData';
import { SeasonData } from '@interfaces/SeasonData';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicPlayerState {
    songsList: EpisodeData[];
    currentAlbum: SeasonData | null;
    currentSong: number;
    currentImage: string;
    paused: boolean;
}

const initialState: MusicPlayerState = {
    songsList: [],
    currentAlbum: null,
    currentSong: -1,
    currentImage: '/img/songDefault.png',
    paused: false,
};

const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<EpisodeData[]>) => {
        state.songsList = action.payload;
    },
    setCurrentAlbum: (state, action: PayloadAction<{
        album: SeasonData | null,
        songIndex: number
    }>) => {
        state.currentAlbum = action.payload.album;

        if (state.currentAlbum){
            state.currentImage = state.currentAlbum.coverSrc;
            state.songsList = state.currentAlbum.episodes;
            state.currentSong = action.payload.songIndex;
        }
    },
    setCurrentSong: (state, action) => {
        if (state.songsList && action.payload < state.songsList.length)
            state.currentSong = action.payload;
    },
    playPrevSong: (state) => {
        if (state.currentSong > 0){
            state.currentSong--;
        }
    },
    playNextSong: (state) => {
        if (state.songsList && state.currentSong < state.songsList.length - 1){
            state.currentSong++;
        }
    },
    toggleMusicPause: (state) => {
        state.paused = !state.paused;
    }
  },
});

export const { setSongs, setCurrentAlbum, setCurrentSong, playPrevSong, playNextSong, toggleMusicPause } = musicPlayerSlice.actions;
export default musicPlayerSlice.reducer;