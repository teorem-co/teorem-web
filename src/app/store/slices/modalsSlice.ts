import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    loginModalOpen: boolean;
    registrationModalOpen: boolean;
    resetPasswordModalOpen: boolean;
    confirmationModalOpen: boolean;
}

const initialState: IState = {
    loginModalOpen: false,
    registrationModalOpen: false,
    resetPasswordModalOpen: false,
    confirmationModalOpen: false,
};

export const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        setLoginModalOpen(state, action: PayloadAction<boolean>) {
            state.loginModalOpen = action.payload;
        },
        setRegistrationModalOpen(state, action: PayloadAction<boolean>) {
            state.registrationModalOpen = action.payload;
        },
        setResetPasswordModalOpen(state, action: PayloadAction<boolean>) {
            state.resetPasswordModalOpen = action.payload;
        },
        setConfirmationModalOpen(state, action: PayloadAction<boolean>) {
            state.confirmationModalOpen = action.payload;
        },
    },
});

export const { setLoginModalOpen, setRegistrationModalOpen, setResetPasswordModalOpen, setConfirmationModalOpen } =
    modalsSlice.actions;
export default modalsSlice.reducer;
