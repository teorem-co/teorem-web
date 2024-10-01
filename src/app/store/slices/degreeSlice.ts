import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IDegree from '../../types/IDegree';

export interface IDegreeSlice {
    degrees: IDegree[];
}

const initialState: IDegreeSlice = {
    degrees: [],
};

export const degreeSlice = createSlice({
    name: 'degree',
    initialState,
    reducers: {
        setDegrees(state, action: PayloadAction<IDegree[]>) {
            state.degrees = action.payload;
        },
    },
});

export const { setDegrees } = degreeSlice.actions;

export default degreeSlice.reducer;
