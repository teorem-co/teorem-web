import { t } from 'i18next';
import { cloneDeep, isEqual } from 'lodash';
import { useEffect, useState } from 'react';

import { useLazyGetProfileProgressQuery } from '../../../../services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import RouterPrompt from '../../../components/RouterPrompt';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import availabilityTable from '../../../constants/availabilityTable';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IAvailabilityIndex from '../interfaces/IAvailabilityIndex';
import ITutorAvailability from '../interfaces/ITutorAvailability';
import {
    useCreateTutorAvailabilityMutation,
    useLazyGetTutorAvailabilityQuery,
    useUpdateTutorAvailabilityMutation,
} from '../services/tutorAvailabilityService';
import { setMyProfileProgress } from '../slices/myProfileSlice';

const GeneralAvailability = () => {
    //const { data: profileProgress } = useGetProfileProgressQuery();
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getTutorAvailability, { data: tutorAvailability, isUninitialized: availabilityUninitialized, isLoading: availabilityLoading }] =
        useLazyGetTutorAvailabilityQuery();
    const [updateTutorAvailability] = useUpdateTutorAvailabilityMutation();
    const [createTutorAvailability] = useCreateTutorAvailabilityMutation();

    const [currentAvailabilities, setCurrentAvailabilities] = useState<(string | boolean)[][]>([]);
    const [saveBtnActive, setSaveBtnActive] = useState(false);

    const dispatch = useAppDispatch();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const loading = availabilityUninitialized || availabilityLoading;

    const renderTableCells = (column: string | boolean, availabilityIndex: IAvailabilityIndex) => {

        if (typeof column === 'boolean') {
            return (
                <td
                    className={`${column ? 'table--availability--check' : 'table--availability--close'}`}
                    onClick={() => handleAvailabilityClick(availabilityIndex.column, availabilityIndex.row, column)}
                    key={availabilityIndex.column}
                >
                    <i className={`icon icon--base ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
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
        }
        else {
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

        // const toSend : ITutorAvailability[] = [
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305308",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "mon",
        //     },
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305309",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "tue",
        //     },
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305310",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "wed",
        //     },
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305311",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "thu",
        //     },
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305312",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "fri",
        //     },
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305313",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "sat",
        //     },
        //     {
        //         id: "e15d58f4-9ebe-4022-ae09-64bc84305314",
        //         tutorId: "28346eca-3bc3-4fc2-8754-a6ec00d21c4e",
        //         afterFive: true,
        //         beforeNoon: true,
        //         noonToFive: true,
        //         dayOfWeek: "sun",
        //     }
        // ];

        if (tutorAvailability && tutorAvailability[1].length > 1) {
            await updateTutorAvailability({ tutorAvailability: toSend });
            toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.UPDATED'));
        } else {
            await createTutorAvailability({ tutorAvailability: toSend });
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
            toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.CREATED'));
        }
    };

    const handleUpdateOnRouteChange = () => {
        handleSubmit();
        return true;
    };

    const fetchData = async () => {
        if (userId) {
            const tutorAvailabilityResponse = await getTutorAvailability(userId).unwrap();
            console.log(tutorAvailabilityResponse);
            setCurrentAvailabilities(tutorAvailabilityResponse);

            //If there is no state in redux for profileProgress fetch data and save result to redux
            if (profileProgressState.percentage === 0) {
                const progressResponse = await getProfileProgress().unwrap();
                dispatch(setMyProfileProgress(progressResponse));
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const isLoaded: boolean = tutorAvailability && tutorAvailability.length > 0 && currentAvailabilities.length > 0 ? true : false;

        if (isLoaded) {
            if (isEqual(tutorAvailability, currentAvailabilities)) {
                setSaveBtnActive(false);
            } else {
                setSaveBtnActive(true);
            }
        }
    }, [currentAvailabilities]);

    //set state to updated tutorAvailabilities for RouterPrompt modal check
    useEffect(() => {
        if (tutorAvailability) {
            setCurrentAvailabilities(tutorAvailability);
        }
    }, [tutorAvailability]);

    console.log(currentAvailabilities);

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
                <ProfileHeader className="mb-8" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgressState.generalAvailability}
                    aditionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
                />

                {/* AVAILABILITY */}
                {(loading && <LoaderPrimary />) || (
                    <div className="card--profile__section">
                        <div>
                            <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</div>
                            <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.GENERAL_AVAILABILITY.DESCRIPTION')}</div>
                            {/*{saveBtnActive ? (*/}
                                <button onClick={() => handleSubmit()} className="btn btn--base btn--primary mt-4">
                                    {t('MY_PROFILE.SUBMIT')}
                                </button>
                            {/*) : (*/}
                            {/*    <></>*/}
                            {/*)}*/}
                        </div>
                        <div>
                            <table className="table table--availability"><tbody>{renderAvailabilityTable()}</tbody></table>
                        </div>
                    </div>
                )}
            </div>
        </MainWrapper>
    );
};

export default GeneralAvailability;
