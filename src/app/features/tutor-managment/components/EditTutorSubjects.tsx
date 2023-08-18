import * as React from 'react';
import { useEffect, useState } from 'react';
import EditSubjectSidebar from '../../my-profile/components/EditSubjectSidebar';
import AddSubjectSidebar from '../../my-profile/components/AddSubjectSidebar';
import {
  useLazyGetTutorByIdQuery,
} from '../../../../services/tutorService';
import SubjectList from '../../my-profile/components/SubjectList';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function EditTutorSubjects({tutorId}: any) {
    const history = useHistory();
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [currency, setCurrency] = useState('');
    const [getProfileData, { data: myTeachingsData }] =
        useLazyGetTutorByIdQuery();
    const fetchData = async () => {
        if (tutorId) {
            getProfileData(tutorId);
            const tutorCurrency = (await getProfileData(tutorId).unwrap()).User.Country.currencyCode;
            setCurrency(tutorCurrency);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tutorId]);

    return (
        <>
            <div>
                <div className="dash-wrapper dash-wrapper--adaptive flex--grow">
                    <div className="dash-wrapper__item">
                        <div className="dash-wrapper__item__element" onClick={() => setAddOpen(true)}>
                            <div className="flex--primary cur--pointer">
                                <div>
                                    <div className="type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.ADD_NEW')}</div>
                                    <div>{t('MY_PROFILE.MY_TEACHINGS.ADD_DESC')}</div>
                                </div>
                                <div>
                                    <i className="icon icon--base icon--plus icon--primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Map through subjects here */}
                    {/* Test fields */}
                    <SubjectList
                        handleSendId={(subjectId) => {
                            history.push(`?subjectId=${subjectId}`);
                            setEditOpen(true);
                        }}
                        tutorSubjects={myTeachingsData && myTeachingsData.TutorSubjects ? myTeachingsData.TutorSubjects : []}
                        currency={currency}
                        key={myTeachingsData && myTeachingsData.TutorSubjects.length}
                    />
                </div>
            </div>
            <EditSubjectSidebar
                sideBarIsOpen={editOpen}
                closeSidebar={() => setEditOpen(false)}
                handleGetData={() => getProfileData(tutorId ? tutorId : '')}
                tutorId={tutorId}
            />
            <AddSubjectSidebar
                key={myTeachingsData?.TutorSubjects.length}
                sideBarIsOpen={addOpen}
                closeSidebar={() => setAddOpen(false)}
                handleGetData={() => getProfileData(tutorId ? tutorId : '')}
                tutorId={tutorId}
            />
        </>
    );
}
