import { FieldAttributes, useField } from 'formik';
import { t } from 'i18next';
import React, { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  resetTutorImageUploadState,
  setFile,
} from '../../slices/tutorImageUploadSlice';

interface PreviewFileType {
    preview: string | null;
}

type UploadFileType = {
    setFieldValue: (field: string, value: any) => void;
    removePreviewOnUnmount?: boolean;
    imagePreview?: string;
    setPreview?: (img: string) => void;
} & FieldAttributes<{}>;

const UploadFile: FC<UploadFileType> = ({ setPreview, setFieldValue, removePreviewOnUnmount, ...props }) => {
    const dispatch = useAppDispatch();

    const [field, meta, helper] = useField<{}>(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const { file } = useAppSelector((state) => state.uploadFile);

    const [preview, setImagePreview] = useState<PreviewFileType>({
        preview: null,
    });

    useEffect(() => {
        if (file) {
            setImagePreview(Object.assign(file, { preview: URL.createObjectURL(file) }));
            setFieldValue(field.name, file);
        }

        if (removePreviewOnUnmount) {
            return function () {
                dispatch(resetTutorImageUploadState());
            };
        }
    }, [file]);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: 'image/jpg,image/png,image/jpeg,image/svg',
        maxSize: 6000000,
        onDropAccepted: (acceptedFiles: File[]) => {
            setFieldValue(field.name, acceptedFiles[0]);
            dispatch(setFile(acceptedFiles[0]));
            helper.setTouched(true);
        },
    });

    const cacheBuster = new Date();


  useEffect(() => {
    if (setPreview) {
      setPreview(preview.preview ? preview.preview : '');
    }
  }, [preview]);
  return (
        <>
            <div className="flex flex--center">
                {preview.preview || props.imagePreview ? (
                    <aside className="upload__images mr-6">
                        <img alt="profile" src={preview.preview || `${props.imagePreview}&v=${cacheBuster}`} />
                    </aside>
                ) : (
                    <div className="upload__placeholder">
                        <div className="upload__placeholder--background">
                            <i className="icon icon--base icon--profile icon--grey"></i>
                        </div>
                    </div>
                )}
                <div {...getRootProps({ className: 'upload' })} style={{height: "auto", backgroundColor:'white'}}>
                    {isDragActive ? <div className="upload__drag-overlay"></div> : ''}
                    <input {...getInputProps()} />
                    <div className="upload__text" role="presentation">
                        {preview ? (
                            <div className="flex--primary flex--col" style={{margin: "10px"}}>
                                <i className="icon icon--base icon--upload icon--black"></i>
                                <div className="type--color--secondary type--wgt--bold" dangerouslySetInnerHTML={{__html: t('MY_PROFILE.PROFILE_SETTINGS.UPLOAD_IMAGE')}}></div>
                               <div className="type--color--tertiary type--wgt--regular" style={{fontSize: "12px"}}>JPG, PNG, JPEG, SVG format</div>
                                {/*<button className="btn btn--base btn--primary mt-2 align--center">{t('MY_PROFILE.PROFILE_SETTINGS.CHOOSE_FILE')}</button>*/}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <div className="field__validation">{errorText ? errorText : ''}</div>
        </>
    );
};

export default UploadFile;
