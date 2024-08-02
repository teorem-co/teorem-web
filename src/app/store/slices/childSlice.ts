import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ChildOptions {
    Child1 = 'Child 1',
}

interface IState {
    selectedChild: ChildOptions | null;
}

const initialState: IState = {
    selectedChild: null,
};

export const childSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setSelectedChild(state, action: PayloadAction<ChildOptions>) {
            state.selectedChild = action.payload;
        },
        resetSelectedChild(state) {
            state.selectedChild = null;
        },
    },
});

export const { setSelectedChild, resetSelectedChild } = childSlice.actions;

export default childSlice.reducer;
