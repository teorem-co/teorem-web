import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICountry } from '../app/features/onboarding/services/countryService';

export interface ICountryMarketState {
  countries: ICountry[];
  selectedCountry: ICountry | null;
}

const initialState: ICountryMarketState = {
  countries: [],
  selectedCountry: {
    id: 'da98ad50-5138-4f0d-b297-62c5cb101247',
    abrv: 'HR',
    name: 'Croatia',
    phonePrefix: '+385',
    currencyCode: 'EUR',
    currentcyName: 'Euro',
    isEuMember: true,
    flag: 'https://teorem.co:3000/teorem/countries/hr.png',
  },
};

export const countryMarketSlice = createSlice({
  name: 'countryMarket',
  initialState,
  reducers: {
    setCountries(state, action: PayloadAction<ICountry[]>) {
      state.countries = action.payload;
    },

    setSelectedCountry(state, action: PayloadAction<ICountry>) {
      state.selectedCountry = action.payload;
    },
  },
});

export const { setCountries, setSelectedCountry } = countryMarketSlice.actions;

export default countryMarketSlice.reducer;
