import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    useLazyGetTutorAvailabilityQuery, useUpdateTutorAvailabilityAdminMutation,
} from '../../my-profile/services/tutorAvailabilityService';
import IAvailabilityIndex from '../../my-profile/interfaces/IAvailabilityIndex';
import { t } from 'i18next';
import { cloneDeep } from 'lodash';
import availabilityTable from '../../../constants/availabilityTable';
import ITutorAvailability from '../../my-profile/interfaces/ITutorAvailability';
import toastService from '../../../services/toastService';
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';
import { useLazyGetProfileProgressQuery } from '../../../../services/tutorService';

export function EditTutorAvailability({tutorId}: any) {

    const [opened, setOpened] = useState(false);
    const [getTutorAvailability, { data: tutorAvailability, isUninitialized: availabilityUninitialized, isLoading: availabilityLoading }] = useLazyGetTutorAvailabilityQuery();
    const [updateTutorAvailability] = useUpdateTutorAvailabilityAdminMutation();
    const [currentAvailabilities, setCurrentAvailabilities] = useState<(string | boolean)[][]>([]);

    const fetchData = async () => {
        if (tutorId) {
            const tutorAvailabilityResponse = await getTutorAvailability(tutorId).unwrap();
            setCurrentAvailabilities(tutorAvailabilityResponse);
        }
    };
    useEffect(() => {
        fetchData();
    }, [tutorId]);

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

        if (tutorAvailability && tutorAvailability[1].length > 1) {
            await updateTutorAvailability({ tutorId, tutorAvailability: toSend });
            toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.UPDATED'));
            setOpened(false);
        }
    };

    return (
        <>
            {opened && (
                <div className="modal__overlay">
                    <div className="modal" style={{minWidth: 600}}>
                        <div className="modal__head">
                            <div className="type--md type--wgt--bold">Edit availability</div>
                            <i onClick={() =>{setOpened(false);}} className="modal__close icon icon--base icon--close icon--grey"></i>
                        </div>
                        <div className="modal__separator"></div>
                        <div className="modal__body">
                            <div className="row">
                                <table className="table table--availability"><tbody>{renderAvailabilityTable()}</tbody></table>
                            </div>
                            <div className="flex mt-6">
                                <button className="btn btn--base btn--primary w--100" onClick={handleSubmit}>
                                    Save
                                </button>
                                <button onClick={() => {
                                    setOpened(false);
                                }} className="btn btn--base btn--clear w--100">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button
                className="btn btn--base btn--ghost w--100 type--center flex flex--center flex--jc--center mt-2"
                onClick={() => setOpened(true)}
            >
                Edit Availability
            </button>
        </>
    );
}