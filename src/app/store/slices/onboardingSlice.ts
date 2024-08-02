import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ITutorAvailability
  from "../../features/my-profile/interfaces/ITutorAvailability";
import ISubject from "../../../interfaces/ISubject";
import ITutorSubjectLevel from "../../../interfaces/ITutorSubjectLevel";

export interface ITutorSubject{
  tutorId?:string,
  id:string | number,
  levelId:string,
  subjectId:string,
  price:string
}

interface IStepZero{
  availability: ITutorAvailability[];
}

interface IStepOne {
  subjects: ITutorSubjectLevel[];
}

interface IStepTwo {
  currentOccupation: string;
  yearsOfExperience: string;
  aboutYou: string;
  aboutYourLessons: string;
}

interface IStepThree{
  address: string;
  addressLine2: string;
  postcode: string;
  city: string;
  country: string;
  IBAN: string;
}

interface IStepFour{
  image: string;
}

interface IState{
  availability: ITutorAvailability[];
  subjects: ITutorSubjectLevel[];
  currentOccupation: string;
  yearsOfExperience: string;
  aboutYou: string;
  aboutYourLessons: string;
  address: string;
  addressLine2: string;
  postcode: string;
  city: string;
  country: string;
  IBAN: string;
  image: string;
}

const initialState: IState = {
  availability: [],
  subjects: [],
  currentOccupation: '',
  yearsOfExperience: '',
  aboutYou: '',
  aboutYourLessons: '',
  address: '',
  addressLine2: '',
  postcode: '',
  city: '',
  country: '',
  IBAN: '',
  image: '',
};


export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setStepZero(state, action: PayloadAction<IStepZero>){
      const {
        availability
      } = action.payload;

      state.availability = availability;
    },

    setStepOne(state, action: PayloadAction<IStepOne>) {
      const {
        subjects
      } = action.payload;

      state.subjects = subjects;
    },

    setStepTwo(state, action: PayloadAction<IStepTwo>) {
      const {
        currentOccupation,
        yearsOfExperience,
        aboutYou,
        aboutYourLessons,
      } = action.payload;

      state.currentOccupation = currentOccupation;
      state.yearsOfExperience = yearsOfExperience;
      state.aboutYou = aboutYou;
      state.aboutYourLessons = aboutYourLessons;
    },

    setStepThree(state, action: PayloadAction<IStepThree>) {
      const {
        address,
        addressLine2,
        postcode,
        city,
        country,
        IBAN,
      } = action.payload;

      state.address = address;
      state.addressLine2 = addressLine2;
      state.postcode = postcode;
      state.city = city;
      state.country = country;
      state.IBAN = IBAN;
    },

    setStepFour(state, action: PayloadAction<IStepFour>) {
      const {
        image,
      } = action.payload;

      state.image = image;
    },

    resetOnboarding(state) {
      state.availability = [];
      state.subjects = [];
      state.currentOccupation = '';
      state.yearsOfExperience = '';
      state.aboutYou = '';
      state.aboutYourLessons = '';
      state.address = '';
      state.addressLine2 = '';
      state.postcode = '';
      state.city = '';
      state.country = '';
      state.IBAN = '';
      state.image = '';
    },
  },
});

export const {   setStepZero, setStepOne, setStepTwo, setStepThree, setStepFour, resetOnboarding } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;
