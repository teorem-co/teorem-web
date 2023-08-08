import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';

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
      connectStripe(state, action: PayloadAction<{
        stripeConnected: boolean;
        stripeAccountId: string;
      }>) {
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
    }
});

export const {
  logout,
  addStripeId,
  connectStripe,
  setServerVersion,
  setToken,
} = authSlice.actions;
export default authSlice.reducer;
