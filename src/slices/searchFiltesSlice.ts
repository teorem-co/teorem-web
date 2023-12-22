import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signUpSlice } from './signUpSlice';

export interface ISearchFiltersState{
  subject: string,
  level: string,
  dayOfWeek:string[],
  timeOfDay: string[]
}


const initialState: ISearchFiltersState = {
  subject: '',
  level: '',
  dayOfWeek: [],
  timeOfDay: []
};


export const searchFiltersSlice = createSlice({
  name: 'searchFilters',
  initialState,
  reducers:{

    setSearchFilters(state, action:PayloadAction<ISearchFiltersState>){
      const {
        subject,
        level,
        timeOfDay,
        dayOfWeek
      } = action.payload;

      state.subject =subject;
      state.level = level;
      state.dayOfWeek = dayOfWeek;
      state.timeOfDay = timeOfDay;
    },

    resetSearchFilters(state) {
      state.subject = '';
      state.level = '';
      state.dayOfWeek = [];
      state.timeOfDay = [];
    },

  }
});

export const { setSearchFilters, resetSearchFilters} = searchFiltersSlice.actions;

export default searchFiltersSlice.reducer;

