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
            state.aboutMe = action.payload.aboutMe;
            state.generalAvailability = action.payload.generalAvailability;
            state.myTeachings = action.payload.myTeachings;
            state.percentage = action.payload.percentage;
        },
        resetMyProfileProgress(state) {
            state = initialState;
        },
    },
});

export const { setMyProfileProgress, resetMyProfileProgress } =
    myProfileSlice.actions;

export default myProfileSlice.reducer;
