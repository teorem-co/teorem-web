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
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            userService.endpoints.getUserId.matchFulfilled,
            (state, action: PayloadAction<IUser>) => {
                state.user = action.payload;
            }
        );
    },
});

export default userSlice.reducer;
