import React, { useEffect, useState } from 'react';
import { IVerificationDocument, useUploadVerificationDocumentMutation } from '../features/my-profile/services/stripeService';
import { VerificationUploadInput } from './VerificationUploadInput';
import { useAppSelector } from '../hooks';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { updateStateOfVerificationDocument } from '../../slices/authSlice';
import {SyncLoader } from 'react-spinners';
import { t } from 'i18next';

export const UploadVerificationDocuments: React.FC = () => {
    // States to store each document
    const [frontDocument, setFrontDocument] = useState<File>();
    const [backDocument, setBackDocument] = useState<File>();
    const [uploadVerificationDocument] = useUploadVerificationDocumentMutation();
    const loggedinUser = useAppSelector((state) => state.auth.user);
    const documentDispatch = useDispatch();
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [remaningDays, setRemaningDays] = useState<number>();



  useEffect(() => {
    if(loggedinUser?.stripeVerificationDeadline){
      const now = moment();
      const end = moment.unix(loggedinUser?.stripeVerificationDeadline);
      setRemaningDays(end.diff(now, 'days'));
    }
  }, []);


    async function onSubmit() {
        if (frontDocument && backDocument) {
            const submit: IVerificationDocument = {
                front: frontDocument,
                back: backDocument,
            };

          setShowLoader(true);
          const response = await uploadVerificationDocument(submit).unwrap();
          setShowLoader(false);
          documentDispatch(updateStateOfVerificationDocument(response));
        }
    }

    return (
        <>
            <div>
                <div className="mb-2 type--wgt--bold">{t('ID_VERIFICATION.ID_SECTION')}</div>
                <div className="type--color--tertiary mb-4">{t('ID_VERIFICATION.ID_SECTION_DESCRIPTION')}</div>
                <div className="flex flex--row w--200--max">
                    {!showLoader && loggedinUser && loggedinUser.stripeVerifiedStatus !== 'verified' && !loggedinUser.stripeVerificationDocumentsUploaded && (
                        <button
                            type={'button'}
                            className={'btn btn--primary btn--lg mt-6'}
                            disabled={!(frontDocument && backDocument)}
                            onClick={onSubmit}
                        >
                            {t('ID_VERIFICATION.FORM.SUBMIT')}
                        </button>
                    )}
                    <SyncLoader color={'#7e6cf2'} loading={showLoader} size={12} />
                </div>
            </div>

            <div className={'w--550 flex flex--col'}>
                {loggedinUser && loggedinUser.stripeVerifiedStatus === 'verified' && (
                    <div className="flex flex-row flex-gap-2">
                        <i className={'icon icon--check icon--base icon--primary'} />
                        <div className="type--color--secondary mb-4">{t('ID_VERIFICATION.ACCOUNT_VERIFIED')}</div>
                    </div>
                )}

                {loggedinUser && loggedinUser.stripeVerifiedStatus !== 'verified' && (
                    <div>
                        <div className={`${loggedinUser.stripeVerificationDocumentsUploaded ? 'type--color--secondary' : 'type--color--secondary'}`}>
                            {loggedinUser.stripeVerificationDocumentsUploaded
                                ? t('ID_VERIFICATION.DOCUMENTS_PROVIDED')
                                : t('ID_VERIFICATION.DOCUMENTS_REQUIRED')}
                        </div>
                    </div>
                )}
                {loggedinUser && loggedinUser.stripeVerifiedStatus !== 'verified' && loggedinUser.stripeVerificationDeadline && (
                    <div className={'flex flex-row flex--ai--center'}>
                        <i className={'icon icon--base icon--error icon--red'}></i>

                        {remaningDays && remaningDays > 0 ? (
                            <p
                              className={`${remaningDays && remaningDays < 14 ? 'type--color--error' : ''} ml-1`}>
                              {t('ID_VERIFICATION.DAYS_REMAINING.P_1') + remaningDays + t('ID_VERIFICATION.DAYS_REMAINING.P_2')}
                            </p>
                        ):
                          (
                          <div>
                            <p className={'type--color--error ml-1'}>{t('ID_VERIFICATION.DISABLED_PAYOUTS.PART_1')}</p>
                            <p className={'ml-1 type--color--secondary'}>{t('ID_VERIFICATION.DISABLED_PAYOUTS.PART_2')}</p>
                          </div>)
                        }
                    </div>
                )}

              {loggedinUser &&
                loggedinUser.stripeVerifiedStatus !== 'verified' &&
                    !loggedinUser.stripeVerificationDeadline &&
                    !loggedinUser.stripeVerificationDocumentsUploaded && (
                        <div className={'flex flex-row flex--ai--center'}>
                            <div>{t('ID_VERIFICATION.DISABLED_PAYOUTS.SOON')}</div>
                        </div>
                    )}

                {loggedinUser && loggedinUser.stripeVerifiedStatus !== 'verified' && !loggedinUser.stripeVerificationDocumentsUploaded && (
                    <div className={'mt-3'}>
                        <div className={'flex flex-row flex-gap-5'}>
                            <div>
                                <h4 className={'type--center type--wgt--regular'}>{t('ID_VERIFICATION.FORM.FRONT')}</h4>
                                <VerificationUploadInput
                                    className={'mb-4 w--300--max'}
                                    setFile={setFrontDocument}
                                    description={'JPG, PNG format'}
                                    acceptedTypes={'image/jpg, image/png'}
                                    uploadedSectionTitle={''}
                                />
                            </div>

                            <div>
                                <h4 className={'type--center type--wgt--regular'}>{t('ID_VERIFICATION.FORM.BACK')}</h4>

                                <VerificationUploadInput
                                    className={'mb-4  w--300--max'}
                                    setFile={setBackDocument}
                                    description={'JPG, PNG format'}
                                    acceptedTypes={'image/jpg, image/png'}
                                    uploadedSectionTitle={''}
                                />
                            </div>
                        </div>

                        <ul>
                            <li>{t('ID_VERIFICATION.FORM.TIP_1')}</li>
                            <li>{t('ID_VERIFICATION.FORM.TIP_2')}</li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};
