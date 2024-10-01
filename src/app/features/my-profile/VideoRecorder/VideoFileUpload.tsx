import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Component that allows users to upload files with specified constraints.
 *
 * @param {number} [maxSize] - (Optional) The maximum file size allowed for upload in MEGAbytes.
 */
interface IVideoFileUploadProps {
    setFile: (file: File) => void;
    description: string;
    acceptedTypes: string;
    maxSize?: number;
    className?: string;
    setShowMaxSizeError: (show: boolean) => void;
    setShowMaxDurationError: (show: boolean) => void;
}

export default function VideoFileUpload({
    setFile,
    acceptedTypes,
    description,
    className,
    maxSize,
    setShowMaxDurationError,
    setShowMaxSizeError,
}: Readonly<IVideoFileUploadProps>) {
    const onDrop = useCallback(
        (acceptedFiles, fileRejections) => {
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
        },
        [setFile, setShowMaxDurationError, setShowMaxSizeError]
    );

    const maxFileSize = maxSize || 10 * 1024 * 1024;
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        maxSize: maxFileSize,
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} multiple={false} accept={acceptedTypes} />
            <button className={className}>{description}</button>
        </div>
    );
}
