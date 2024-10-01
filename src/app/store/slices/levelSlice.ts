import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ILevel from '../../types/ILevel';

export interface ILevelSlice {
    levels: ILevel[];
}

const initialState: ILevelSlice = {
    levels: [],
};

export const levelSlice = createSlice({
    name: 'level',
    initialState,
    reducers: {
        setLevels(state, action: PayloadAction<ILevel[]>) {
            state.levels = action.payload;
        },
    },
});

export const { setLevels } = levelSlice.actions;

export default levelSlice.reducer;
