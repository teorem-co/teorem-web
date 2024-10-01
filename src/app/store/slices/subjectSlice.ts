import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ISubject from '../../types/ISubject';
import ISubjectLevel from '../../types/ISubjectLevel';

export interface ISubjectSlice {
    subjects: ISubject[];
    subjectLevels: ISubjectLevel[];
}

const initialState: ISubjectSlice = {
    subjects: [],
    subjectLevels: [],
};

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setSubjects(state, action: PayloadAction<ISubject[]>) {
            state.subjects = action.payload;
        },
        setSubjectLevels(state, action: PayloadAction<ISubjectLevel[]>) {
            state.subjectLevels = action.payload;
        },
    },
});

export const { setSubjects, setSubjectLevels } = subjectSlice.actions;

export default subjectSlice.reducer;
