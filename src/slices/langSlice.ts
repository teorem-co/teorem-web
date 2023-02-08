import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    lang: string | null;
}

const initialState: IState = {
    lang: null,
};

export const langSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        setLang(state, action: PayloadAction<any>) {
            state.lang = action.payload;
        },
    },
});

export const { setLang } = langSlice.actions;

export default langSlice.reducer;
