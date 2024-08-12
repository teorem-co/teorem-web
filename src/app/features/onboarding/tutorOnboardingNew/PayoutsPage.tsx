import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLazyGetProfileProgressQuery } from '../../../store/services/tutorService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserId } from '../../../utils/getUserId';
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';
import { AiOutlineLeft } from 'react-icons/ai';
import CircularProgress from '../../my-profile/components/CircularProgress';
import TestTutorProfile from './TestTutorProfile';
import { PayoutFormIndividual } from './PayoutFormIndividual';
import { PayoutFormCompany } from './PayoutFormCompany';
import logo from '../../../../assets/images/teorem_logo_purple.png';

//TODO: add saving to database

type AdditionalProps = {
    nextStep: () => void;
    backStep: () => void;
};

const PayoutsPage = ({ nextStep, backStep }: AdditionalProps) => {
    const isMobile = window.innerWidth < 765;
    const state = useAppSelector((state) => state.onboarding);
    const { yearsOfExperience, currentOccupation, aboutYou, aboutYourLessons } = state;

    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    // const [getProfileData, {
    //   isLoading: isLoadingGetInfo,
    //   isLoading: dataLoading,
    //   isUninitialized: dataUninitialized
    // }] =
    //   useLazyGetTutorByIdQuery();
    // const [updateAditionalInfo, {
    //   isLoading: isUpdatingInfo,
    //   isSuccess: isSuccessUpdateInfo
    // }] = useUpdateAditionalInfoMutation();

    // const isLoading = isLoadingGetInfo || isUpdatingInfo;
    // const pageLoading = dataLoading || dataUninitialized;
    const { t } = useTranslation();
    const tutorId = getUserId();
    const dispatch = useAppDispatch();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const [progressPercentage, setProgressPercentage] = useState(profileProgressState.percentage);
    const user = useAppSelector((state) => state.auth.user);

    const [individual, setIndividual] = useState(true);
    const [business, setBusiness] = useState(false);

    const fetchData = async () => {
        if (tutorId) {
            const progressResponse = await getProfileProgress().unwrap();
            setProgressPercentage(progressResponse.percentage);
            dispatch(setMyProfileProgress(progressResponse));

            if (profileProgressState.percentage === 0) {
                const progressResponse = await getProfileProgress().unwrap();
                dispatch(setMyProfileProgress(progressResponse));
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //check for displaying save button
    // useEffect(() => {
    //   if (isSuccessUpdateInfo) {
    //     if (tutorId) {
    //       getProfileData(tutorId);
    //     }
    //   }
    // }, [isSuccessUpdateInfo]);
    //

    return (
        <>
            <img src={logo} alt="logo" className="mt-5 ml-5 signup-logo" />
            <div className="subject-form-container flex--jc--space-around">
                <div
                    style={{
                        gridColumn: '1/3',
                        top: '0',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    className="align--center profile-preview-wrapper"
                >
                    <div className="flex field__w-fit-content align--center">
                        <div className="flex flex--col flex--jc--center ml-6">
                            <div style={{ margin: '40px' }} className="flex flex--center">
                                <AiOutlineLeft className={`ml-2 mr-6 cur--pointer signup-icon`} color="grey" onClick={backStep} />
                                <div className="flex flex--row flex--jc--center">
                                    <div className="flex flex--center flex--shrink ">
                                        <CircularProgress progressNumber={progressPercentage} size={isMobile ? 65 : 80} />
                                    </div>
                                    <div className="flex flex--col flex--jc--center">
                                        <h4 className="signup-title ml-6 text-align--center">{t('MY_PROFILE.PAYOUTS')}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                className={`font-family__poppins fw-300 level-card flex card--primary cur--pointer scale-hover--scale-110`}
                                style={{
                                    borderRadius: '10px',
                                    height: '60px',
                                    width: 'fit-content',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: individual ? '#7e6cf2' : 'white',
                                    color: individual ? 'white' : 'black',
                                }}
                                onClick={() => {
                                    setIndividual(true);
                                    setBusiness(false);
                                }}
                            >
                                <span className="font__lgr">{t('TUTOR_ONBOARDING.PAYOUTS_BUTTON.PRIVATE')}</span>
                            </div>
                            {user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && (
                                <div
                                    className={`font-family__poppins fw-300 level-card flex card--primary cur--pointer scale-hover--scale-110`}
                                    style={{
                                        borderRadius: '10px',
                                        height: '60px',
                                        width: 'fit-content',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: business ? '#7e6cf2' : 'white',
                                        color: business ? 'white' : 'black',
                                    }}
                                    onClick={() => {
                                        setIndividual(false);
                                        setBusiness(true);
                                    }}
                                >
                                    <span className="font__lgr">{t('TUTOR_ONBOARDING.PAYOUTS_BUTTON.COMPANY')}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            {individual && <PayoutFormIndividual nextStep={nextStep} />}
                            {business && user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && <PayoutFormCompany nextStep={nextStep} />}
                        </div>
                    </div>
                </div>

                <div className="profile-preview-wrapper">
                    <TestTutorProfile
                        occupation={currentOccupation}
                        aboutTutor={aboutYou}
                        aboutLessons={aboutYourLessons}
                        yearsOfExperience={yearsOfExperience}
                    ></TestTutorProfile>
                </div>
            </div>
        </>
    );
};

export default PayoutsPage;
