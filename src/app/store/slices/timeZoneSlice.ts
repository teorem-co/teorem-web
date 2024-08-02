import { createSlice } from '@reduxjs/toolkit';

export interface ITimeZoneState {
    timeZone: string | null;
}

const initialState: ITimeZoneState = {
    timeZone: null,
};

export const timeZoneSlice = createSlice({
    name: 'timeZone',
    initialState,
    reducers: {
        setTimeZone(state, action) {
            state.timeZone = action.payload;
        },
    },
});

export const { setTimeZone } = timeZoneSlice.actions;

export default timeZoneSlice.reducer;
