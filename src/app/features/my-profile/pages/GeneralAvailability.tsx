import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { cloneDeep, isEqual } from 'lodash';
import { useEffect, useState } from 'react';

import {
    useGetProfileProgressQuery,
    useLazyGetProfileProgressQuery,
} from '../../../../services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import availabilityTable from '../../../constants/availabilityTable';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import IAvailabilityIndex from '../interfaces/IAvailabilityIndex';
import ITutorAvailability from '../interfaces/ITutorAvailability';
import {
    useCreateTutorAvailabilityMutation,
    useLazyGetTutorAvailabilityQuery,
    useUpdateTutorAvailabilityMutation,
} from '../services/tutorAvailabilityService';

const GeneralAvailability = () => {
    const userId = useAppSelector((state) => state.auth.user?.id);

    //const { data: profileProgress } = useGetProfileProgressQuery();
    const [getProfileProgress, { data: profileProgress }] =
        useLazyGetProfileProgressQuery();

    const [getTutorAvailability, { data: tutorAvailability }] =
        useLazyGetTutorAvailabilityQuery();
    const [updateTutorAvailability, { isSuccess: updateSuccess }] =
        useUpdateTutorAvailabilityMutation();
    const [
        createTutorAvailability,
        { isSuccess: createSuccess, status: createStatus },
    ] = useCreateTutorAvailabilityMutation();

    const [currentAvailabilities, setCurrentAvailabilities] = useState<
        (string | boolean)[][]
    >([]);
    const [saveBtnActive, setSaveBtnActive] = useState(false);

    const renderTableCells = (
        column: string | boolean,
        availabilityIndex: IAvailabilityIndex
    ) => {
        if (typeof column === 'boolean') {
            return (
                <td
                    onClick={() =>
                        handleAvailabilityClick(
                            availabilityIndex.column,
                            availabilityIndex.row,
                            column
                        )
                    }
                    className={`${
                        column
                            ? 'table--availability--check'
                            : 'table--availability--close'
                    }`}
                >
                    <i
                        className={`icon icon--base ${
                            column
                                ? 'icon--check icon--primary'
                                : 'icon--close icon--grey'
                        }`}
                    ></i>
                </td>
            );
        } else {
            return <td>{column}</td>;
        }
    };

    const renderAvailabilityTable = () => {
        const update: boolean =
            currentAvailabilities.length > 0 &&
            currentAvailabilities[1].length > 1;

        const availabilityToMap = update
            ? currentAvailabilities
            : availabilityTable;

        return availabilityToMap.map(
            (row: (string | boolean)[], rowIndex: number) => {
                return (
                    <tr>
                        {row.map(
                            (column: string | boolean, columnIndex: number) => {
                                const availabilityIndex: IAvailabilityIndex = {
                                    row: rowIndex,
                                    column: columnIndex,
                                };
                                return renderTableCells(
                                    column,
                                    availabilityIndex
                                );
                            }
                        )}
                    </tr>
                );
            }
        );
    };

    const handleAvailabilityClick = (
        column: number,
        row: number,
        value: boolean
    ) => {
        let cloneState;
        if (currentAvailabilities && currentAvailabilities[1].length > 1) {
            cloneState = cloneDeep(currentAvailabilities);
        } else {
            cloneState = cloneDeep(availabilityTable);
        }

        cloneState[row][column] = !value;

        setCurrentAvailabilities(cloneState);
    };

    const handleSubmit = () => {
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
            updateTutorAvailability({ tutorAvailability: toSend });
        } else {
            createTutorAvailability({ tutorAvailability: toSend });
        }
    };

    useEffect(() => {
        //  if (userId) {
        //      setTimeout(() => {
        //          getTutorAvailability(userId);
        //      }, 2000);
        //  }
        if (createSuccess || updateSuccess) {
            toastService.success('Availability updated');
        }
    }, [updateSuccess, createSuccess]);

    useEffect(() => {
        if (userId) {
            getTutorAvailability(userId);
            getProfileProgress();
        }
    }, []);

    useEffect(() => {
        if (tutorAvailability) {
            setCurrentAvailabilities(tutorAvailability);
        }
    }, [tutorAvailability]);

    useEffect(() => {
        const isLoaded: boolean =
            tutorAvailability &&
            tutorAvailability.length > 0 &&
            currentAvailabilities.length > 0
                ? true
                : false;

        if (isLoaded) {
            if (isEqual(tutorAvailability, currentAvailabilities)) {
                setSaveBtnActive(false);
            } else {
                setSaveBtnActive(true);
            }
        }
    }, [currentAvailabilities]);

    useEffect(() => {
        if (createStatus === QueryStatus.fulfilled) {
            getProfileProgress();
        }
    }, [createStatus]);

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgress?.generalAvailability}
                    aditionalInformation={
                        profileProgress?.additionalInformation
                    }
                    myTeachings={profileProgress?.myTeachings}
                    percentage={profileProgress?.percentage}
                />

                {/* AVAILABILITY */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            General Availability
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your availability information
                        </div>
                        {saveBtnActive ? (
                            <button
                                onClick={() => handleSubmit()}
                                className="btn btn--base btn--primary mt-4"
                            >
                                Save
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div>
                        <table className="table table--availability">
                            {renderAvailabilityTable()}
                        </table>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default GeneralAvailability;
