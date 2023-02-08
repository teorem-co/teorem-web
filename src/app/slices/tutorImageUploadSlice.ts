import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FileType = {
    preview: string;
};

interface IState {
    file: File | null;
}

const initialState: IState = {
    file: null,
};

//RESET STATE AFTER SUCCESFUL LOGIN/REGISTER
const uploadFileSlice = createSlice({
    name: 'uploadFile',
    initialState,
    reducers: {
        setFile(state, action: PayloadAction<File | null>) {
            state.file = action.payload;
        },
        resetTutorImageUploadState(state) {
            state.file = null;
        },
    },
});

export const { setFile, resetTutorImageUploadState } = uploadFileSlice.actions;
export default uploadFileSlice.reducer;
