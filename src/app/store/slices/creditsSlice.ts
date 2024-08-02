import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    credits: number;
}

const initialState: IState = {
    credits: 0,
};

export const creditsSlice = createSlice({
    name: 'credits',
    initialState,
    reducers: {
        setCredits(state, action: PayloadAction<number>) {
            state.credits = action.payload;
        },
    },
});

export const { setCredits } = creditsSlice.actions;
export default creditsSlice.reducer;
