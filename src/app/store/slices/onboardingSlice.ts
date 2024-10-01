import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IOnboardingState from '../../types/IOnboardingState';

interface IOnboardingSlice {
    onboardingState: IOnboardingState | undefined;
}

const initialState: IOnboardingSlice = {
    onboardingState: undefined,
};

export const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setOnboardingState(state, action: PayloadAction<IOnboardingState>) {
            state.onboardingState = action.payload;
        },

        resetOnboarding(state) {
            state.onboardingState = undefined;
        },
    },
});

export const { setOnboardingState, resetOnboarding } = onboardingSlice.actions;

export default onboardingSlice.reducer;
