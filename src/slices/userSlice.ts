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
//refactor other components to use user from userSlice not from authSlice so they get up to date info about user
//handle user clear on logout
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authService.endpoints.login.matchFulfilled, (state, action: PayloadAction<ILoginPayload>) => {
            const { user } = action.payload;
            state.user = user;
        });
        builder.addMatcher(userService.endpoints.getUser.matchFulfilled, (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        });
    },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
