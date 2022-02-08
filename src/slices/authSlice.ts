import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface ILoginPayload {
    token: string;
    user: IUser;
}

interface IState {
    token: string | null;
    user: IUser | null;
}

const initialState: IState = {
    token: null,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authService.endpoints.login.matchFulfilled,
            (state, action: PayloadAction<ILoginPayload>) => {
                const { user, token } = action.payload;
                state.token = token;
                state.user = user;
            }
        );
        builder.addMatcher(
            userService.endpoints.updateUserInformation.matchFulfilled,
            (state, action: PayloadAction<IUser>) => {
                state.user = action.payload;
            }
        );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
