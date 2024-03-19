import green_check from '../../../../assets/icons/green-check.svg';
import React from 'react';
import { t } from 'i18next';

interface Props {
    setShowPopup: (value: boolean) => void;
}

export const VideoUploadPopup = (props: Props) => {
    const { setShowPopup } = props;

    return (
        <div className="flex flex--col w--60 h--450 m-2 p-6 bg__white video-recorder-container success-modal-animation  flex--jc--center">
            <img src={green_check} alt="#" height={100} />
            <h2>{t('VIDEO_PREVIEW.LOADING.SUCCESS')}</h2>
            <div
                className="icon icon--grey icon--base icon--close"
                onClick={() => setShowPopup(false)}
                style={{ position: 'absolute', top: '5px', right: '5px' }}
            ></div>
        </div>
    );
};
