import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FileType = {
    preview: string;
};

interface IState {
    files: FileType[] | [];
}

const initialState: IState = {
    files: [],
};

const uploadFileSlice = createSlice({
    name: 'uploadFile',
    initialState,
    reducers: {
        setFiles(state, action: PayloadAction<FileType[]>) {
            state.files = action.payload;
        },
    },
});

export const { setFiles } = uploadFileSlice.actions;
export default uploadFileSlice.reducer;
