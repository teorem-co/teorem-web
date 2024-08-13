import { t } from 'i18next';
import { cloneDeep, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useLazyGetProfileProgressQuery } from '../../../store/services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import availabilityTable from '../../../constants/availabilityTable';
import toastService from '../../../store/services/toastService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IAvailabilityIndex from '../interfaces/IAvailabilityIndex';
import ITutorAvailability from '../interfaces/ITutorAvailability';
import {
    useCreateTutorAvailabilityMutation,
    useLazyGetTutorAvailabilityQuery,
    useUpdateTutorAvailabilityMutation,
} from '../../../store/services/tutorAvailabilityService';
import { setMyProfileProgress } from '../../../store/slices/myProfileSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserId } from '../../../utils/getUserId';
import { TimeZoneSelect } from '../../../components/TimeZoneSelect';
import { useLazyGetUserTimeZoneQuery } from '../../../store/services/userService';
import { setTimeZone } from '../../../store/slices/timeZoneSlice';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

const GeneralAvailability = () => {
    //const { data: profileProgress } = useGetProfileProgressQuery();

    const [getTutorAvailability, { data: tutorAvailability, isUninitialized: availabilityUninitialized, isLoading: availabilityLoading }] =
        useLazyGetTutorAvailabilityQuery();
    const [updateTutorAvailability] = useUpdateTutorAvailabilityMutation();
    const [createTutorAvailability] = useCreateTutorAvailabilityMutation();
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getUserTimeZone, { isSuccess: isTimeZoneSuccess }] = useLazyGetUserTimeZoneQuery();

    const [selectedZone, setSelectedZone] = useState('');
    const [defaultUserZone, setDefaultUserZone] = useState('');
    const [currentAvailabilities, setCurrentAvailabilities] = useState<(string | boolean)[][]>([]);
    const [saveBtnActive, setSaveBtnActive] = useState(false);

    const dispatch = useAppDispatch();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const loading = availabilityUninitialized || availabilityLoading;
    const isMobile = window.innerWidth < 765;
    const renderTableCells = (column: string | boolean, availabilityIndex: IAvailabilityIndex) => {
        if (typeof column === 'boolean') {
            return (
                <td
                    className={`${column ? 'table--availability--check' : 'table--availability--close'}`}
                    onClick={() => handleAvailabilityClick(availabilityIndex.column, availabilityIndex.row, column)}
                    key={availabilityIndex.column}
                >
                    <i className={`icon icon--${isMobile ? 'sm' : 'base'} ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
                </td>
            );
        } else if (column == '') {
            return <td key={availabilityIndex.column}></td>;
        } else if (column == 'Pre 12 pm') {
            return <td key={availabilityIndex.column}>{t(`TUTOR_PROFILE.PRE12`)}</td>;
        } else if (column == '12 - 5 pm') {
            return <td key={availabilityIndex.column}>{t(`TUTOR_PROFILE.ON12`)}</td>;
        } else if (column == 'After 5 pm') {
            return <td key={availabilityIndex.column}>{t(`TUTOR_PROFILE.AFTER5`)}</td>;
        } else {
            return <td key={availabilityIndex.column}>{t(`CONSTANTS.DAYS_SHORT.${column.toUpperCase()}`)}</td>;
        }
    };

    const renderAvailabilityTable = () => {
        const update: boolean = currentAvailabilities.length > 0 && currentAvailabilities[1].length > 1;

        const availabilityToMap = update ? currentAvailabilities : currentAvailabilities;

        return availabilityToMap.map((row: (string | boolean)[], rowIndex: number) => {
            return (
                <tr key={rowIndex}>
                    {row.map((column: string | boolean, columnIndex: number) => {
                        const availabilityIndex: IAvailabilityIndex = {
                            row: rowIndex,
                            column: columnIndex,
                        };
                        return renderTableCells(column, availabilityIndex);
                    })}
                </tr>
            );
        });
    };

    const handleAvailabilityClick = (column: number, row: number, value: boolean) => {
        let cloneState;
        if (currentAvailabilities && currentAvailabilities[1].length > 1) {
            cloneState = cloneDeep(currentAvailabilities);
        } else {
            cloneState = cloneDeep(availabilityTable);
        }

        cloneState[row][column] = !value;

        setCurrentAvailabilities(cloneState);
    };

    const handleSubmit = async () => {
        const toSend: ITutorAvailability[] = [];

        for (let i = 1; i < 8; i++) {
            const obj: any = {};
            const currentDayOfWeek = currentAvailabilities[0][i];
            let lowerCaseDayOfWeek = '';
            if (typeof currentDayOfWeek === 'string') {
                lowerCaseDayOfWeek = currentDayOfWeek.toLowerCase();
            }

            obj.dayOfWeek = lowerCaseDayOfWeek;
            obj.beforeNoon = currentAvailabilities[1][i];
            obj.noonToFive = currentAvailabilities[2][i];
            obj.afterFive = currentAvailabilities[3][i];
            toSend.push(obj);
        }

        if (tutorAvailability && tutorAvailability[1].length > 1) {
            //await updateTutorAvailability({ tutorAvailability: toSend });
            const tutorId = getUserId();
            await updateTutorAvailability({
                tutorId: tutorId ? tutorId : '',
                tutorAvailability: toSend,
                timeZone: selectedZone,
            });
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
            toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.UPDATED'));
        } else {
            await createTutorAvailability({
                tutorAvailability: toSend,
                timeZone: selectedZone,
            });
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
            toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.CREATED'));
        }

        setDefaultUserZone(selectedZone);
        dispatch(setTimeZone(selectedZone));
    };

    const handleUpdateOnRouteChange = () => {
        handleSubmit();
        return true;
    };

    const fetchData = async () => {
        if (userId) {
            const tutorAvailabilityResponse = await getTutorAvailability(userId).unwrap();
            setCurrentAvailabilities(tutorAvailabilityResponse);

            //If there is no state in redux for profileProgress fetch data and save result to redux
            if (profileProgressState.percentage === 0) {
                const progressResponse = await getProfileProgress().unwrap();
                dispatch(setMyProfileProgress(progressResponse));
            }

            const userZone = await getUserTimeZone(userId).unwrap();
            setDefaultUserZone(userZone);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const isLoaded: boolean = tutorAvailability && tutorAvailability.length > 0 && currentAvailabilities.length > 0 ? true : false;

        if (isLoaded) {
            if (isEqual(tutorAvailability, currentAvailabilities) && defaultUserZone === selectedZone && isTimeZoneSuccess) {
                setSaveBtnActive(false);
            } else {
                setSaveBtnActive(true);
            }
        }
    }, [currentAvailabilities, selectedZone, defaultUserZone]);

    //set state to updated tutorAvailabilities for RouterPrompt modal check
    useEffect(() => {
        if (tutorAvailability) {
            setCurrentAvailabilities(tutorAvailability);
        }
    }, [tutorAvailability]);

    return (
        <MainWrapper>
            <RouterPrompt
                when={saveBtnActive}
                onOK={handleUpdateOnRouteChange}
                onCancel={() => {
                    //if you pass "false" router will be blocked and you will stay on the current page
                    return true;
                }}
            />
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-1" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgressState.generalAvailability}
                    additionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
                    payment={profileProgressState.payment}
                />

                {/* AVAILABILITY */}
                {(loading && <LoaderPrimary />) || (
                    <div>
                        {isTimeZoneSuccess && (
                            <div className="card--profile__section">
                                <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.GENERAL_AVAILABILITY.TIME_ZONE')}</div>
                                <TimeZoneSelect defaultUserZone={defaultUserZone} selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
                            </div>
                        )}
                        <div className="card--profile__section">
                            <div>
                                <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</div>
                                <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.GENERAL_AVAILABILITY.DESCRIPTION')}</div>
                                {saveBtnActive ? (
                                    <ButtonPrimaryGradient onClick={() => handleSubmit()} className="btn btn--base mt-4">
                                        {t('MY_PROFILE.SUBMIT')}
                                    </ButtonPrimaryGradient>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                <table className="table table--availability">
                                    <tbody>{renderAvailabilityTable()}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainWrapper>
    );
};

export default GeneralAvailability;
