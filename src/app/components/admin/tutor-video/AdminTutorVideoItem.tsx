import {
    IAdminTutorVideoInformation,
    IDeclineTutorVideo,
    useLazyApproveTutorVideoQuery,
    useLazyDeclineTutorVideoQuery,
} from '../../../../services/tutorService';
import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import { TutorItemVideoPopup } from '../../../features/searchTutors/components/TutorItemVideoPopup';
import { useHistory } from 'react-router';
import { PATHS } from '../../../routes';

export interface Props {
    tutorVideoInfo: IAdminTutorVideoInformation;
    fetchData: () => void;
}

export const AdminTutorVideoItem = (props: Props) => {
    const { tutorVideoInfo, fetchData } = props;
    const [deleteVideo] = useLazyDeclineTutorVideoQuery();
    const [approveVideo, { isError: approveError }] = useLazyApproveTutorVideoQuery();
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessagePopup, setShowMessagePopup] = useState(false);

    const history = useHistory();

    async function onApproveVideo() {
        await approveVideo(tutorVideoInfo.tutorId).unwrap();
        fetchData();
    }

    async function onDeleteVideo() {
        if (!message || message.trim().length === 0) {
            return;
        }

        const params: IDeclineTutorVideo = {
            tutorId: tutorVideoInfo.tutorId,
            message: encodeURIComponent(message.trim()),
        };

        await deleteVideo(params).unwrap();
        setShowMessagePopup(false);
        fetchData();
    }

    function redirectToTutorProfile() {
        history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutorVideoInfo.tutorSlug));
    }

    useEffect(() => {
        console.log('message: ', message.trim());
    }, [message]);

    return (
        <>
            <tr key={tutorVideoInfo.tutorId}>
                <td onClick={redirectToTutorProfile}>{tutorVideoInfo.firstName}</td>
                <td onClick={redirectToTutorProfile}>{tutorVideoInfo.lastName}</td>
                <td onClick={redirectToTutorProfile}>{tutorVideoInfo.email}</td>
                <td onClick={redirectToTutorProfile}>{tutorVideoInfo.phoneNumber}</td>
                <td className={'type--center'}>
                    <button className={'btn btn--base btn--ghost'} onClick={() => setShowVideoPopup(true)}>
                        {t('TUTOR_MANAGMENT.ACTIONS.PLAY_VIDEO')}
                    </button>
                </td>

                <td className={'flex flex--jc--space-around approve-deny'}>
                    {!tutorVideoInfo.videoApproved && (
                        <button className="btn btn--base btn--clear" onClick={onApproveVideo}>
                            {t('TUTOR_MANAGMENT.ACTIONS.APPROVE')}
                        </button>
                    )}
                    <button className="btn btn--base btn--ghost" onClick={() => setShowMessagePopup(true)}>
                        {t('TUTOR_MANAGMENT.ACTIONS.DECLINE')}
                    </button>
                </td>
            </tr>

            {showVideoPopup && tutorVideoInfo.videoUrl && (
                <TutorItemVideoPopup
                    videoUrl={tutorVideoInfo.videoUrl}
                    onClose={() => {
                        setShowVideoPopup(false);
                    }}
                />
            )}

            {showMessagePopup && (
                <div className={'video-modal__overlay'}>
                    <div className="flex flex--col flex--jc--space-between p-10 background-red modal dash-border confirm-modal">
                        <h2 className={'align-self-center'}>{tutorVideoInfo.firstName + ' ' + tutorVideoInfo.lastName}</h2>
                        <p className={'align-self-center mt-2'}> {t('TUTOR_MANAGMENT.VIDEO_PREVIEW.MESSAGE_TITLE')}</p>
                        <textarea
                            value={message}
                            name="message"
                            id="id-message"
                            cols={30}
                            rows={10}
                            onChange={(event) => setMessage(event.target.value)}
                        ></textarea>
                        <button
                            disabled={message.length === 0}
                            onClick={onDeleteVideo}
                            className="btn btn--error--primary btn--md field__w-fit-content align-self-center mt-2"
                        >
                            {t('TUTOR_MANAGMENT.VIDEO_PREVIEW.DECLINE_AND_SEND_BUTTON')}
                        </button>

                        <i
                            className="icon icon--grey icon--base icon--close"
                            style={{ position: 'absolute', top: '5px', right: '5px' }}
                            onClick={() => setShowMessagePopup(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
