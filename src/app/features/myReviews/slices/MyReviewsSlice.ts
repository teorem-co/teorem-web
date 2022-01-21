import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IMyReviews from '../interfaces/IMyReviews';

interface IState {
    myReviews: IMyReviews;
}

const initialState: IState = {
    myReviews: {
        count: 0,
        rows: []
    },
};

export const myReviewsSlice = createSlice({
    name: 'myReviews',
    initialState,
    reducers: {
        setMyReviews(state, action: PayloadAction<IMyReviews>) {
            state.myReviews = action.payload;
        },
        resetMyReviews(state) {
            state.myReviews = initialState.myReviews;
        },
    },
});

export const { setMyReviews, resetMyReviews } = myReviewsSlice.actions;

export default myReviewsSlice.reducer;
