import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface IState {
    user: IUser | null;
}

interface ILoginPayload {
    token: string;
    user: IUser;
}

const initialState: IState = {
    user: null,
};

//test to see if user slice is cleared properly
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        //add action to clear
    },
    extraReducers: (builder) => {
        // builder.addMatcher(
        //     authService.endpoints.login.matchFulfilled,
        //     (state, action: PayloadAction<ILoginPayload>) => {
        //         const { user } = action.payload;
        //         state.user = user;
        //     }
        // );
        // builder.addMatcher(
        //     userService.endpoints.updateUserInformation.matchFulfilled,
        //     (state, action: PayloadAction<IUser>) => {
        //         state.user = action.payload;
        //     }
        // );
    },
});

export default userSlice.reducer;
