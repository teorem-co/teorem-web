import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import LOCAL_STORAGE_KEYS from '../../constants/localStorageKeys';
import { ILanguage } from '../services/langService';

interface IState {
    languages: ILanguage[];
    selectedLanguage: ILanguage | null;
}

const initialLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.PREFERRED_LANGUAGE) || null;
const parsedLanguage = initialLanguage && typeof initialLanguage !== 'string' ? JSON.parse(initialLanguage) : null;

const initialState: IState = {
    selectedLanguage: parsedLanguage ?? null,
    languages: [],
};

export const langSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        setSelectedLang(state, action: PayloadAction<ILanguage>) {
            state.selectedLanguage = action.payload;
            localStorage.setItem(LOCAL_STORAGE_KEYS.PREFERRED_LANGUAGE, JSON.stringify(action.payload));
        },
        setLanguages(state, action: PayloadAction<ILanguage[]>) {
            state.languages = action.payload;
        },
    },
});

export const { setSelectedLang, setLanguages } = langSlice.actions;

export default langSlice.reducer;
