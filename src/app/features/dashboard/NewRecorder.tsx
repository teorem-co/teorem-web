import React, { useState } from 'react';
import * as tus from 'tus-js-client';

export const NewRecorder: React.FC = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            const upload = new tus.Upload(file, {
                uploadUrl: 'https://europe-files.tus.vimeo.com/files/vimeo-prod-src-tus-eu/e91a21cd02c963d970d76384ad22f0b2', // Replace this with Vimeo's TUS endpoint
                retryDelays: [0, 1000, 3000, 5000],
                metadata: {
                    filename: file.name,
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
                    console.log('Download %s from %s', upload.file, upload.url);
                },
            });

            upload.start();
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <p>Upload Progress: {uploadProgress}%</p>
        </div>
    );
};
