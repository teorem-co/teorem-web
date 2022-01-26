import { FieldAttributes, useField } from 'formik';
import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { setFile } from '../../slices/uploadFileSlice';

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
        accept: 'image/*',
        onDropAccepted: (acceptedFiles: File[]) => {
            dispatch(setFile(acceptedFiles[0]));
        },
    });

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
                        {preview.preview ? (
                            <aside className="upload__images">
                                <img alt="profile" src={preview.preview} />
                            </aside>
                        ) : (
                            <></>
                        )}
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

// <div className="flex">
//     <div>
//         {preview.preview ? (
//             <aside className="upload__images">
//                 <img alt="profile" src={preview.preview} />
//             </aside>
//         ) : (
//             <></>
//         )}
//     </div>
//     <div {...getRootProps({ className: 'upload' })}>
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop some files here, or click to select files</p>
//     </div>
// </div>
