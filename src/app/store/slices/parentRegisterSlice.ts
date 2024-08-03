import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IChild } from '../../../types/IChild';

interface IRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    roleSelection: string;
}

interface IStepOne {
    firstName: string;
    lastName: string;
    countryId: string;
    dateOfBirth: string;
    phoneNumber: string;
}

interface IStepTwo {
    childFirstName: string;
    childLastName: string;
    childDateOfBirth: string;
    username: string;
    childPassword: string;
}

interface IState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    countryId: string;
    phoneNumber: string;
    dateOfBirth: string;
    roleSelection: string;
    childFirstName: string;
    childLastName: string;
    childDateOfBirth: string;
    username: string;
    childPassword: string;
    child: IChild[];
    skip: boolean;
}

const initialState: IState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    countryId: '',
    phoneNumber: '',
    dateOfBirth: '',
    childFirstName: '',
    childLastName: '',
    childDateOfBirth: '',
    username: '',
    childPassword: '',
    roleSelection: '',
    child: [],
    skip: false,
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
        setSkip(state, action: PayloadAction<boolean>) {
            state.skip = action.payload;
        },
        setStepOne(state, action: PayloadAction<IStepOne>) {
            const { countryId, dateOfBirth, phoneNumber, firstName, lastName } = action.payload;
            state.firstName = firstName;
            state.lastName = lastName;
            state.countryId = countryId;
            state.dateOfBirth = dateOfBirth;
            state.phoneNumber = phoneNumber;
        },
        setStepTwo(state, action: PayloadAction<IStepTwo>) {
            const {
                childFirstName,
                childLastName,
                childDateOfBirth,
                username,
                childPassword,
            } = action.payload;
            state.childFirstName = childFirstName;
            state.childLastName = childLastName;
            state.childDateOfBirth = childDateOfBirth;
            state.username = username;
            state.childPassword = childPassword;
        },
        setChildList(state, action: PayloadAction<IChild[]>) {
            state.child = action.payload;
        },
        resetParentRegister(state) {
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.password = '';
            state.passwordRepeat = '';
            state.countryId = '';
            state.phoneNumber = '';
            state.dateOfBirth = '';
            state.childFirstName = '';
            state.childLastName = '';
            state.childDateOfBirth = '';
            state.username = '';
            state.childPassword = '';
            state.child = [];
            state.skip = false;
            state.roleSelection = '';
        },
    },
});

export const {
    setRegister,
    setStepOne,
    setStepTwo,
    resetParentRegister,
    setChildList,
    setSkip,
} = parentRegisterSlice.actions;

export default parentRegisterSlice.reducer;
