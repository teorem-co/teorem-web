import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum RoleOptions {
    Student = 'student',
    Tutor = 'tutor',
    Parent = 'parent',
    Child = 'child',
    SuperAdmin = 'admin',
}

interface IState {
    selectedRole: RoleOptions | null;
    selectedCountry: string | null;
}

const initialState: IState = {
    selectedRole: null,
    selectedCountry: null,
};

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setSelectedRole(state, action: PayloadAction<RoleOptions>) {
            state.selectedRole = action.payload;
        },
        resetSelectedRole(state) {
            state.selectedRole = null;
        },
        setSelectedCountryState(state, action: PayloadAction<string>) {
            state.selectedCountry = action.payload;
            console.log('Setting country to: ', action.payload);
        },
    },
});

export const { setSelectedRole, setSelectedCountryState, resetSelectedRole } = roleSlice.actions;

export default roleSlice.reducer;
