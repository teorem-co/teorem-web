import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IChildListOption from '../interfaces/IChildListOption';

interface IRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    roleSelection: string;
}

interface IStepOne {
    country: string;
    phoneNumber: string;
    prefix: string;
    dateOfBirth: string;
}

interface IStepTwo {
    childFirstName: string;
    childLastName: string;
    childDateOfBirth: string;
}

interface IState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    country: string;
    phoneNumber: string;
    prefix: string;
    dateOfBirth: string;
    roleSelection: string;
    childFirstName: string;
    childLastName: string;
    childDateOfBirth: string;
    child: IChildListOption[] | [];
}

const initialState: IState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    country: '',
    phoneNumber: '',
    prefix: '',
    dateOfBirth: '',
    childFirstName: '',
    childLastName: '',
    childDateOfBirth: '',
    roleSelection: '',
    child: [],
};

export const parentRegisterSlice = createSlice({
    name: 'tutorRegister',
    initialState,
    reducers: {
        setRegister(state, action: PayloadAction<IRegister>) {
            const {
                firstName,
                lastName,
                email,
                password,
                passwordRepeat,
                roleSelection,
            } = action.payload;
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
            state.password = password;
            state.passwordRepeat = passwordRepeat;
            state.roleSelection = roleSelection;
        },
        setStepOne(state, action: PayloadAction<IStepOne>) {
            const { country, prefix, phoneNumber, dateOfBirth } =
                action.payload;
            state.country = country;
            state.prefix = prefix;
            state.phoneNumber = phoneNumber;
            state.dateOfBirth = dateOfBirth;
        },
        setStepTwo(state, action: PayloadAction<IStepTwo>) {
            const { childFirstName, childLastName, childDateOfBirth } =
                action.payload;
            state.childFirstName = childFirstName;
            state.childLastName = childLastName;
            state.childDateOfBirth = childDateOfBirth;
        },
        setChildList(state, action: PayloadAction<IChildListOption[]>) {
            state.child = action.payload;
        },
        resetParentRegister(state) {
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.password = '';
            state.passwordRepeat = '';
            state.country = '';
            state.phoneNumber = '';
            state.prefix = '';
            state.dateOfBirth = '';
            state.childFirstName = '';
            state.childLastName = '';
            state.childDateOfBirth = '';
        },
    },
});

export const {
    setRegister,
    setStepOne,
    setStepTwo,
    resetParentRegister,
    setChildList,
} = parentRegisterSlice.actions;

export default parentRegisterSlice.reducer;
