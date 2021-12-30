import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authService } from '../services/authService';

interface ILoginPayload {
    token: string;
    user: {
        id: string;
    };
}

interface IState {
    userId: string | null;
    token: string | null;
}

const initialState: IState = {
    userId: null,
    token: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.userId = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authService.endpoints.login.matchFulfilled,
            (state, action: PayloadAction<ILoginPayload>) => {
                const {
                    user: { id },
                    token,
                } = action.payload;
                state.token = token;
                state.userId = id;
            }
        );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
