import { FieldAttributes, useField } from 'formik';
import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { setFile } from '../../slices/tutorImageUploadSlice';

interface PreviewFileType {
    preview: string | null;
}

type UploadFileType = {
    setFieldValue: (field: string, value: any) => void;
} & FieldAttributes<{}>;

const UploadFile: FC<UploadFileType> = ({ setFieldValue, ...props }) => {
    const dispatch = useAppDispatch();

    const [field, meta] = useField<{}>(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const { file } = useAppSelector((state) => state.uploadFile);

    const [preview, setImagePreview] = useState<PreviewFileType>({
        preview: null,
    });

    useEffect(() => {
        if (file) {
            setImagePreview(
                Object.assign(file, { preview: URL.createObjectURL(file) })
            );
            setFieldValue('profileImage', file);
        }
    }, [file]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: 'image/jpg,image/png,image/jpeg,image/svg',
        maxSize: 2000000,
        onDropAccepted: (acceptedFiles: File[]) => {
            dispatch(setFile(acceptedFiles[0]));
        },
    });

    return (
        <>
            <div className="flex flex--center">
                {preview.preview ? (
                    <aside className="upload__images mr-6">
                        <img alt="profile" src={preview.preview} />
                    </aside>
                ) : (
                    <div className="upload__placeholder">
                        <div className="upload__placeholder--background">
                            <i className="icon icon--base icon--profile icon--grey"></i>
                        </div>
                    </div>
                )}
                <div {...getRootProps({ className: 'upload' })}>
                    {isDragActive ? (
                        <div className="upload__drag-overlay"></div>
                    ) : (
                        ''
                    )}
                    <input {...getInputProps()} />
                    <div className="upload__text" role="presentation">
                        {preview ? (
                            <div className="flex--primary flex--col">
                                <i className="icon icon--base icon--upload icon--grey"></i>
                                <div className="type--color--tertiary type--wgt--regular">
                                    Drag and drop to upload
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <div className="field__validation">
                {errorText ? errorText : ''}
            </div>
        </>
    );
};

export default UploadFile;
