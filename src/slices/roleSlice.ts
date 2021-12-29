import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum RoleOptions {
    Student = 'student',
    Tutor = 'tutor',
    Parent = 'parent',
}

interface IState {
    selectedRole: RoleOptions | null;
}

const initialState: IState = {
    selectedRole: null,
};

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setSelectedRole(state, action: PayloadAction<RoleOptions>) {
            state.selectedRole = action.payload;
        },
    },
});

export const { setSelectedRole } = roleSlice.actions;

export default roleSlice.reducer;
