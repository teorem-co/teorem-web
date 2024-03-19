import * as tus from 'tus-js-client';
import Webcam from 'react-webcam';

export async function uploadToVimeo(
    file: File | Blob,
    uploadUrl: string,
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
    triggerSuccess: () => void,
    webcamRef: Webcam | null
) {
    const upload = new tus.Upload(file, {
        uploadUrl: uploadUrl,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
            filetype: file.type,
        },
        onError: (error) => {
            console.log('Failed because: ' + error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(bytesUploaded, bytesTotal, `${percentage}%`);
            setUploadProgress(parseFloat(percentage));
        },
        onSuccess: () => {
            triggerSuccess();
            webcamRef?.stream?.getTracks().forEach((track) => {
                track.stop();
            });
        },
    });

    upload.start();
}
