import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    topOffset: number;
}

const initialState: IState = {
    topOffset: 0,
};

export const scrollSlice = createSlice({
    name: 'scroll',
    initialState,
    reducers: {
        setTopOffset(state, action: PayloadAction<number>) {
            state.topOffset = action.payload;
        },
        resetTopOffset(state) {
            state.topOffset = 0;
        },
    },
});

export const { resetTopOffset, setTopOffset } = scrollSlice.actions;

export default scrollSlice.reducer;
