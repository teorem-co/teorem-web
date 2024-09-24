import { FieldAttributes, useField } from 'formik';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { resetTutorImageUploadState, setFile } from '../../../../../../../store/slices/tutorImageUploadSlice';
import styles from './PhotoUploadArea.module.scss';
import addPhotoImg from './assets/add-photo.png';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';

interface IUploadFileProps {
    setFieldValue: (field: string, value: any) => void;
    removePreviewOnUnmount?: boolean;
    title?: string;
    description?: string;
    cta?: string;
}

export default function PhotoUploadArea({
    setFieldValue,
    removePreviewOnUnmount,
    title,
    description,
    cta,
    ...props
}: IUploadFileProps & FieldAttributes<{}>) {
    const dispatch = useAppDispatch();
    const [t] = useTranslation();

    const [field, meta, helper] = useField<{}>(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    const [sizeError, setSizeError] = useState(false);

    const { file } = useAppSelector((state) => state.uploadFile);

    useEffect(() => {
        if (file) {
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
        },
        onDropRejected: (rejections) => {
            rejections.forEach(({ errors }) => {
                if (errors.some((e) => e.code === 'file-too-large')) {
                    setSizeError(true);
                }
            });
        },
    });

    return (
        <>
            <div {...getRootProps({ className: styles.container })}>
                {isDragActive ? <div className={styles.dragOverlay}></div> : ''}
                <input {...getInputProps()} />
                <img className={styles.photoIcon} src={addPhotoImg} />
                <div className={styles.title}>{title}</div>
                <Typography variant="body2">{description}</Typography>
                {cta ? <div className={styles.cta}>{cta}</div> : null}
            </div>
            {sizeError ? <Alert severity="error">{t('FORM_VALIDATION.IMAGE_SIZE')}</Alert> : null}
        </>
    );
}
