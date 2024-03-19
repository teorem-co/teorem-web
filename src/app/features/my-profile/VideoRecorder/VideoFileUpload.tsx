import { t } from 'i18next';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Component that allows users to upload files with specified constraints.
 *
 * @param {number} [maxSize] - (Optional) The maximum file size allowed for upload in MEGAbytes.
 */
interface Props {
    setFile: (file: File) => void;
    description: string;
    acceptedTypes: string;
    uploadedSectionTitle: string;
    maxSize?: number;
    className?: string;
}

export const VideoFileUpload = (props: Props) => {
    const { setFile, acceptedTypes, description, className, maxSize } = props;
    const [showMaxSizeError, setShowMaxSizeError] = useState(false);
    const [showMaxDurationError, setShowMaxDurationError] = useState(false);

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        setShowMaxSizeError(false); // Reset the error message state on each drop attempt

        if (fileRejections.length > 0) {
            setShowMaxSizeError(true);
        } else if (acceptedFiles.length > 0) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(acceptedFiles[0]);

            video.addEventListener('loadedmetadata', function () {
                // Duration is in seconds
                const maxDurationInSeconds = 120 + 5;
                const duration = video.duration;
                if (duration >= maxDurationInSeconds) {
                    setShowMaxDurationError(true);
                } else {
                    setFile(acceptedFiles[0]);
                }

                URL.revokeObjectURL(video.src);
            });
        }
    }, []);

    const maxFileSize = maxSize || 10 * 1024 * 1024;
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        maxSize: maxFileSize,
    });

    return (
        <div>
            <div className={className}>
                <div {...getRootProps()} className={`upload`}>
                    <input {...getInputProps()} multiple={false} accept={acceptedTypes} />
                    <div className="upload__text" role="presentation">
                        <div className="flex--primary flex--col" style={{ margin: '10px' }}>
                            <i className="icon icon--base icon--upload icon--black"></i>
                            <div
                                className="type--color--secondary type--wgt--bold type--center"
                                dangerouslySetInnerHTML={{ __html: t('MY_PROFILE.PROFILE_SETTINGS.UPLOAD_IMAGE') }}
                            ></div>
                            <div className="type--color--tertiary type--wgt--regular" style={{ fontSize: '12px' }}>
                                {description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showMaxSizeError && <h1 className={'type--color--error type--sm type--center'}>{t('VIDEO_PREVIEW.FILE_UPLOAD.SIZE_MESSAGE')}</h1>}
            {showMaxDurationError && (
                <h1 className={'type--color--error type--sm type--center'}>{t('VIDEO_PREVIEW.FILE_UPLOAD.DURATION_MESSAGE')}</h1>
            )}
        </div>
    );
};
