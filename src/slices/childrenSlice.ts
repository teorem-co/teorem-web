import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IChildListOption from '../interfaces/IChildListOption';

interface IState {
    child: IChildListOption[] | [];
}

const initialState: IState = {
    child: [],
};

export const childrenSlice = createSlice({
    name: 'children',
    initialState,
    reducers: {
        setchildren(state, action: PayloadAction<IChildListOption[]>) {
            state.child = action.payload;
        },
    },
});

export const { setchildren } = childrenSlice.actions;

export default childrenSlice.reducer;
