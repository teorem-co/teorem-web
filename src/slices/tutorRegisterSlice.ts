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
    profileImage: string;
}

interface IStepTwo {
    cardFirstName: string;
    cardLastName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
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
    profileImage: string;
    cardFirstName: string;
    cardLastName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
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
    profileImage: '',
    cardFirstName: '',
    cardLastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    zipCode: '',
    roleSelection: '',
};

export const tutorRegisterSlice = createSlice({
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
            const {
                countryId,
                prefix,
                phoneNumber,
                dateOfBirth,
                profileImage,
            } = action.payload;
            state.countryId = countryId;
            state.prefix = prefix;
            state.phoneNumber = phoneNumber;
            state.dateOfBirth = dateOfBirth;
            state.profileImage = profileImage;
        },
        setStepTwo(state, action: PayloadAction<IStepTwo>) {
            const {
                cardFirstName,
                cardLastName,
                cardNumber,
                expiryDate,
                cvv,
                zipCode,
            } = action.payload;
            state.cardFirstName = cardFirstName;
            state.cardLastName = cardLastName;
            state.cardNumber = cardNumber;
            state.expiryDate = expiryDate;
            state.cvv = cvv;
            state.zipCode = zipCode;
        },
        resetTutorRegister(state) {
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.password = '';
            state.passwordRepeat = '';
            state.countryId = '';
            state.phoneNumber = '';
            state.prefix = '';
            state.dateOfBirth = '';
            state.profileImage = '';
            state.cardFirstName = '';
            state.cardLastName = '';
            state.cardNumber = '';
            state.expiryDate = '';
            state.cvv = '';
            state.zipCode = '';
            state.roleSelection = '';
        },
    },
});

export const { setRegister, setStepOne, setStepTwo, resetTutorRegister } =
    tutorRegisterSlice.actions;

export default tutorRegisterSlice.reducer;
