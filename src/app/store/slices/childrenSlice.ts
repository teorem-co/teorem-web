import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IChild } from '../../types/IChild';

interface IState {
    child: IChild[];
}

const initialState: IState = {
    child: [],
};

export const childrenSlice = createSlice({
    name: 'children',
    initialState,
    reducers: {
        setchildren(state, action: PayloadAction<IChild[]>) {
            state.child = action.payload;
        },
    },
});

export const { setchildren } = childrenSlice.actions;

export default childrenSlice.reducer;
