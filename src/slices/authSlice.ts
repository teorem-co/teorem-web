import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';
import { IVerificationDocumentResponse } from '../app/features/my-profile/services/stripeService';

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
        connectStripe(
            state,
            action: PayloadAction<{
                stripeConnected: boolean;
                stripeAccountId: string;
            }>
        ) {
            state.user!.stripeConnected = action.payload.stripeConnected;
            state.user!.stripeAccountId = action.payload.stripeAccountId;
        },
        setServerVersion(state, action: PayloadAction<string>) {
            state.serverVersion = action.payload;
        },
        setToken(state, action: PayloadAction<ILoginPayload>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        updateStateOfVerificationDocument(state, action: PayloadAction<IVerificationDocumentResponse>) {
            state.user!.stripeVerifiedStatus = action.payload.stripeVerifiedStatus;
            state.user!.stripeVerificationDocumentsUploaded = action.payload.stripeVerificationDocumentsUploaded;
        },
    },
});

export const { logout, addStripeId, connectStripe, setServerVersion, setToken, updateStateOfVerificationDocument } = authSlice.actions;
export default authSlice.reducer;
