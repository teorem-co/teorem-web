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
        addStripeId(state, action: PayloadAction<string>) {
            state.user!.stripeCustomerId = action.payload;
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

export const { logout, addStripeId } = authSlice.actions;
export default authSlice.reducer;
