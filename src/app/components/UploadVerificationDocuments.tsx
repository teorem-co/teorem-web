import React, { useState } from 'react';
import { IVerificationDocument, useUploadVerificationDocumentMutation } from '../features/my-profile/services/stripeService';

export const UploadVerificationDocuments: React.FC = () => {
    // States to store each document
    const [frontDocument, setFrontDocument] = useState<File | null>(null);
    const [backDocument, setBackDocument] = useState<File | null>(null);
    const [uploadVerificationDocument] = useUploadVerificationDocumentMutation();

    const validateAndSetFile = (file: File, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        const validTypes = ['image/jpeg', 'application/pdf', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Only JPG, PDF, and PNG are allowed.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds the maximum limit of 10MB.');
            return;
        }

        if (file.type !== 'application/pdf') {
            // For image files, check dimensions
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width > 8000 || img.height > 8000) {
                    alert('Image dimensions exceed the maximum limit of 8000x8000 pixels.');
                } else {
                    // If the image passes all checks, update the state
                    setFile(file);
                }
                URL.revokeObjectURL(img.src);
            };
        } else {
            // If the file is a PDF and passes all checks, update the state
            setFile(file);
        }
    };

    const handleFrontDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) validateAndSetFile(file, setFrontDocument);
    };

    const handleBackDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) validateAndSetFile(file, setBackDocument);
    };

    function onSubmit() {
        if (frontDocument && backDocument) {
            const submit: IVerificationDocument = {
                front: frontDocument,
                back: backDocument,
            };
            uploadVerificationDocument(submit);
        }
    }

    return (
        <>
            <div>
                <label>Front Document:</label>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFrontDocumentChange} />
                {frontDocument && <p>{frontDocument.name}</p>}
            </div>
            <div>
                <label>Back Document:</label>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleBackDocumentChange} />
                {backDocument && <p>{backDocument.name}</p>}
            </div>
            <button onClick={onSubmit}>Submit</button>
        </>
    );
};
