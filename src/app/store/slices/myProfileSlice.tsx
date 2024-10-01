import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IProgressProfile from '../../types/IProgressProfile';

const initialState: IProgressProfile = {
    aboutMe: false,
    generalAvailability: false,
    myTeachings: false,
    step: 0,
    substep: 0,
    payment: false,
    verified: true,
    profileImage: false,
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
