import { t } from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
    setFile: (file: File) => void;
    description: string;
    acceptedTypes: string;
    uploadedSectionTitle: string;
    className?: string;
}

export const VerificationUploadInput = (props: Props) => {
    const [showMaxSizeError, setShowMaxSizeError] = useState(false);
    const maxFileSize = 10 * 1024 * 1024;

    const { setFile, acceptedTypes, description, className } = props;
    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        setShowMaxSizeError(false); // Reset the error message state on each drop attempt
        if (fileRejections.length > 0) {
            setShowMaxSizeError(true);
        }
    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        maxSize: maxFileSize,
    });

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, [acceptedFiles]);

    return (
        <div className={className}>
            <div {...getRootProps()} className={`upload`}>
                <input {...getInputProps()} multiple={false} accept={acceptedTypes} />
                <div className="upload__text" role="presentation">
                    <div className="flex--primary flex--col" style={{ margin: '10px' }}>
                        <i className="icon icon--base icon--upload icon--black"></i>
                        <div
                            className="type--color--secondary type--wgt--bold"
                            dangerouslySetInnerHTML={{ __html: t('MY_PROFILE.PROFILE_SETTINGS.UPLOAD_IMAGE') }}
                        ></div>
                        <div className="type--color--tertiary type--wgt--regular" style={{ fontSize: '12px' }}>
                            {description}
                        </div>
                    </div>
                </div>
            </div>
            {showMaxSizeError && <h1 className={'type--color--error type--sm type--center'}>{t('VIDEO_PREVIEW.FILE_UPLOAD.SIZE_MESSAGE')}</h1>}
            <aside>
                {acceptedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                ))}
            </aside>
        </div>
    );
};
