import { createSlice } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';

interface IState {
    user: IUser | null;
    token: string | null;
}

const initialState: IState = {
    user: null,
    token: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

export default authSlice.reducer;
