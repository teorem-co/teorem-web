import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// first step for student or parent, tutor doesn't have this step

interface IStepZero{
  levelId: string;
  subjectId: string;
}

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
  roleAbrv: string;
  levelId:string,
  subjectId:string,
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
  roleAbrv:'',
  levelId:'',
  subjectId:'',
  firstName: '',
  lastName: '',
  dateOfBirth:'',
  email: '',
  phoneNumber: '',
  countryId: '',
  password: '',
  confirmPassword: '',
};


export const signUpSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<string>){
      state.roleAbrv = action.payload;
    },

    setStepZero(state, action: PayloadAction<IStepZero>){
      const {
        levelId,
        subjectId
      } = action.payload;

      state.levelId = levelId;
      state.subjectId = subjectId;
    },

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

    resetSignUp(state) {
      state.roleAbrv = '';
      state.levelId = '';
      state.subjectId = '';
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

export const {  setRole, setStepZero, setStepOne, setStepTwo, setStepThree, resetSignUp } =
  signUpSlice.actions;

export default signUpSlice.reducer;
