import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IUser from '../interfaces/IUser';
import { userService } from '../services/userService';

interface IState {
    user: IUser | null;
}

const initialState: IState = {
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userReset(state) {
            state.user = initialState.user;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            userService.endpoints.getUserId.matchFulfilled,
            (state, action: PayloadAction<IUser>) => {
                state.user = action.payload;
            }
        );
    },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
