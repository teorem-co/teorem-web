import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUniversity from '../../types/IUniversity';

export interface IUniversitySlice {
    universities: IUniversity[];
}

const initialState: IUniversitySlice = {
    universities: [],
};

export const universitySlice = createSlice({
    name: 'university',
    initialState,
    reducers: {
        setUniversities(state, action: PayloadAction<IUniversity[]>) {
            state.universities = action.payload;
        },
    },
});

export const { setUniversities } = universitySlice.actions;

export default universitySlice.reducer;
