import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    roleSelection: string;
}

interface IStepOne {
    countryId: string;
    phoneNumber: string;
    prefix: string;
    dateOfBirth: string;
}

interface IState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
    countryId: string;
    phoneNumber: string;
    prefix: string;
    dateOfBirth: string;
    roleSelection: string;
}

const initialState: IState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    countryId: '',
    phoneNumber: '',
    prefix: '',
    dateOfBirth: '',
    roleSelection: '',
};

export const studentRegisterSlice = createSlice({
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
            const { countryId, prefix, phoneNumber, dateOfBirth } =
                action.payload;
            state.countryId = countryId;
            state.prefix = prefix;
            state.phoneNumber = phoneNumber;
            state.dateOfBirth = dateOfBirth;
        },
        resetStudentRegister(state) {
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.password = '';
            state.passwordRepeat = '';
            state.countryId = '';
            state.phoneNumber = '';
            state.prefix = '';
            state.dateOfBirth = '';
        },
    },
});

export const { setRegister, setStepOne, resetStudentRegister } =
    studentRegisterSlice.actions;

export default studentRegisterSlice.reducer;
