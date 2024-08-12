import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    isFinished: boolean;
}

const initialState: IState = {
    isFinished: true, // default to true to hide the modal
};

export const tutorialSlice = createSlice({
    name: 'tutorial',
    initialState,
    reducers: {
        setTutorialFinished(state, action: PayloadAction<boolean>) {
            state.isFinished = action.payload;
        },
    },
});

export const { setTutorialFinished } = tutorialSlice.actions;
export default tutorialSlice.reducer;
