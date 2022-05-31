import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';
import { authService } from '../services/authService';

interface ILoginPayload {
    token: string;
    user: IUser;
}

interface IState {
    token: string | null;
    user: IUser | null;
    serverVersion: string | null;
}

const initialState: IState = {
    token: null,
    user: null,
    serverVersion: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
        },
        addStripeId(state, action: PayloadAction<string>) {
            state.user!.stripeCustomerId = action.payload;
        },
        setServerVersion(state, action: PayloadAction<string>) {
            state.serverVersion = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authService.endpoints.login.matchFulfilled, (state, action: PayloadAction<ILoginPayload>) => {
            const { user, token } = action.payload;
            state.token = token;
            state.user = user;
        });
    },
});

export const { logout, addStripeId, setServerVersion } = authSlice.actions;
export default authSlice.reducer;
