import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface IStepOne {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface IStepTwo {
  email: string;
  phoneNumber: string;
  countryId: string;
}

interface IStepThree{
  password: string;
  confirmPassword: string;
}

interface IState{
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  countryId: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const initialState: IState = {
  firstName: '',
  lastName: '',
  dateOfBirth:'',
  email: '',
  phoneNumber: '',
  countryId: '',
  password: '',
  confirmPassword: '',
};


export const tutorSignUpSlice = createSlice({
  name: 'tutorSignup',
  initialState,
  reducers: {
    setStepOne(state, action: PayloadAction<IStepOne>) {
      const {
        firstName,
        lastName,
        dateOfBirth
      } = action.payload;

      state.firstName = firstName;
      state.lastName = lastName;
      state.dateOfBirth = dateOfBirth;
    },

    setStepTwo(state, action: PayloadAction<IStepTwo>) {
      const {
        email,
        phoneNumber,
        countryId
      } = action.payload;

      state.email = email;
      state.phoneNumber = phoneNumber;
      state.countryId = countryId;
    },

    setStepThree(state, action: PayloadAction<IStepThree>) {
      const {
        password,
        confirmPassword
      } = action.payload;

      state.password = password;
      state.confirmPassword = confirmPassword;
    },

    resetTutorSignUp(state) {
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.password = '';
      state.countryId = '';
      state.phoneNumber = '';
      state.dateOfBirth = '';
    },
  },
});

export const {  setStepOne, setStepTwo, setStepThree, resetTutorSignUp } =
  tutorSignUpSlice.actions;

export default tutorSignUpSlice.reducer;
