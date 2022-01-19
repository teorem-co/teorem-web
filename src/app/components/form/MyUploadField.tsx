import { FieldAttributes, useField } from 'formik';
import { FC, Fragment, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { FileType, setFiles } from '../../slices/uploadFileSlice';
import { RootState } from '../../store';

type UploadFileType = {
    infoText?: boolean;
    uploadedFile: (file: any) => void;
    filePreview?: (preview: any) => void;
    imagePreview?: string;
    setFieldValue: (field: string, value: any) => void;
    clearImagePreview?: () => void;
} & FieldAttributes<{}>;

const mappedFiles = (files: FileType[], filePreview: any) => {
    return files.map((file, index) => {
        if (file.preview) {
            filePreview ? filePreview(file.preview) : <></>;
        }
        return (
            <Fragment key={index}>
                <aside className="upload__images">
                    <img alt="profile" src={file.preview} />
                    <div className="upload__images__edit">
                        <i className="icon icon--edit"></i>
                    </div>
                </aside>
            </Fragment>
        );
    });
};

const UploadFile: FC<UploadFileType> = ({
    imagePreview,
    uploadedFile,
    filePreview,
    id,
    setFieldValue,
    clearImagePreview,
    infoText,
    ...props
}) => {
    const dispatch = useAppDispatch();
    const [field, meta] = useField<{}>(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    const files = useAppSelector((state: RootState) => state.uploadFile.files);
    const isEdit = id === 'imageFood';

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            dispatch(
                setFiles(
                    acceptedFiles.map((file, i) => {
                        // sending values to parent component
                        uploadedFile(file);
                        return Object.assign(file, {
                            preview: URL.createObjectURL(file),
                            index: i,
                        });
                    })
                )
            );
        },
    });

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            if (!filePreview) {
                files.forEach((file) => URL.revokeObjectURL(file.preview));
            }
        },
        [files]
    );

    useEffect(() => {
        dispatch(setFiles([]));
    }, []);

    return (
        <>
            <div className="flex">
                <div {...getRootProps({ className: 'upload' })}>
                    {isDragActive ? (
                        <div className="upload__drag-overlay"></div>
                    ) : (
                        ''
                    )}
                    <input {...getInputProps()} />
                    <div className="upload__text" role="presentation">
                        {imagePreview ? (
                            <aside className="upload__images">
                                <img alt="profile" src={imagePreview} />
                            </aside>
                        ) : (
                            <></>
                        )}
                        {mappedFiles(files, filePreview)}
                        {files.length <= 0 ? (
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
