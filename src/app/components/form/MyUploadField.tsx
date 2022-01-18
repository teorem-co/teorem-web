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
    setFieldValue?: (field: string, value: any) => void;
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
        onDrop: (acceptedFiles: any) => {
            dispatch(setFiles(acceptedFiles[0]));
            uploadedFile(acceptedFiles[0]);
        },
    });

    // useEffect(
    //     () => () => {
    //         // Make sure to revoke the data uris to avoid memory leaks
    //         if (!filePreview) {
    //             files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    //         }
    //     },
    //     [files]
    // );

    return (
        <>
            <section>
                {/* <div {...getRootProps({ className: "upload" })}>
                        {isDragActive ? <div className="upload__drag-overlay">

                        </div> : ''}
                        <input {...getInputProps()} />
                        <div className="upload__text" role="presentation">
                            {
                                files.length > 0
                                    ? <></>
                                    : imagePreview
                                        ? <></>
                                        : <i className="icon icon--group"></i>
                            }

                            {
                                imagePreview
                                    ? <aside className="upload__images">
                                        <img
                                            alt="profile"
                                            src={imagePreview}
                                        />
                                        <div className="upload__images__edit">
                                            <i className="icon icon--edit-black"></i>
                                        </div>
                                    </aside>
                                    : <></>
                            }
                            {
                                mappedFiles(files, filePreview)
                            }
                        </div>
                    </div> */}
                <div {...getRootProps({ className: 'field__file__wrap' })}>
                    <input
                        type="file"
                        className="input__file"
                        {...getInputProps()}
                    />
                    <i className="icon icon--upload icon--base icon--grey"></i>
                    <div className="type--color--tertiary type--wgt--regular">
                        Drag and drop to upload
                    </div>
                </div>
                <div className="field__validation">
                    {errorText ? errorText : ''}
                </div>
            </section>
        </>
    );
};

export default UploadFile;
