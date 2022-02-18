import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IProgressProfile from '../interfaces/IProgressProfile';

const initialState: IProgressProfile = {
    aboutMe: false,
    generalAvailability: false,
    myTeachings: false,
    percentage: 0,
};

export const myProfileSlice = createSlice({
    name: 'myProfileSlice',
    initialState,
    reducers: {
        setMyProfileProgress(state, action: PayloadAction<IProgressProfile>) {
            return action.payload;
        },
        resetMyProfileProgress() {
            return initialState;
        },
    },
});

export const { setMyProfileProgress, resetMyProfileProgress } = myProfileSlice.actions;

export default myProfileSlice.reducer;
