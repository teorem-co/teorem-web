import { Form, FormikProvider, useFormik } from 'formik';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Select, { components, MenuProps } from 'react-select';

import IParams from '../../../interfaces/IParams';
import { useLazyGetLevelOptionsQuery } from '../../../services/levelService';
import { useLazyGetSubjectOptionsByLevelQuery } from '../../../services/subjectService';
import { useLazyGetAvailableTutorsQuery } from '../../../services/tutorService';
import CustomCheckbox from '../../components/form/CustomCheckbox';
import MySelect, { OptionType } from '../../components/form/MySelectField';
import ImageCircle from '../../components/ImageCircle';
import LoaderTutor from '../../components/loaders/LoaderTutor';
import MainWrapper from '../../components/MainWrapper';
import { SortDirection } from '../../lookups/sortDirection';
import { PATHS } from '../../routes';
import getUrlParams from '../../utils/getUrlParams';
import CustomSubjectList from './components/CustomSubjectList';
import PriceSort from './components/PriceSort';
import TutorItem from './components/TutorItem';

interface Values {
    subject: string;
    level: string;
    dayOfWeek: string[];
    timeOfDay: string[];
}

const SearchTutors = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const [params, setParams] = useState<IParams>({});
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [dayOfWeekArray, setDayOfWeekArray] = useState<string[]>([]);
    const [timeOfDayArray, setTimeOfDayArray] = useState<string[]>([]);
    const [priceSortDirection, setPriceSortDirection] = useState<SortDirection>(
        SortDirection.None
    );

    //initialSubject is not reset on initial level change
    const [isInitialSubject, setIsInitialSubject] = useState<boolean>(false);

    //storing subjects in state so it can reset on Reset Filter
    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);

    const [
        getAvailableTutors,
        { data: availableTutors, isLoading: isLoadingAvailableTutors },
    ] = useLazyGetAvailableTutorsQuery();

    const [
        getLevelOptions,
        { data: levelOptions, isLoading: isLoadingLevels },
    ] = useLazyGetLevelOptionsQuery();

    const [
        getSubjectOptionsByLevel,
        {
            data: subjectsData,
            isLoading: isLoadingSubjects,
            isSuccess: isSuccessSubjects,
            isFetching: isFetchingSubjects,
        },
    ] = useLazyGetSubjectOptionsByLevelQuery();

    const levelDisabled = !levelOptions || isLoadingLevels;

    const initialValues: Values = {
        subject: '',
        level: '',
        dayOfWeek: [],
        timeOfDay: [],
    };

    useEffect(() => {
        getLevelOptions();
        const urlQueries: IParams = getUrlParams(
            history.location.search.replace('?', '')
        );

        if (Object.keys(urlQueries).length > 0) {
            urlQueries.subject &&
                formik.setFieldValue('subject', urlQueries.subject) &&
                setIsInitialSubject(true);
            urlQueries.level && formik.setFieldValue('level', urlQueries.level);
            urlQueries.dayOfWeek &&
                setDayOfWeekArray(urlQueries.dayOfWeek.split(','));
            urlQueries.timeOfDay &&
                setTimeOfDayArray(urlQueries.timeOfDay.split(','));

            setParams(urlQueries);

            //set sort direction if params.price is already in URL
            if (urlQueries.price) {
                setPriceSortDirection(urlQueries.price as SortDirection);
            }
        } else {
            getAvailableTutors(params);
        }

        setInitialLoad(false);
    }, []);

    useEffect(() => {
        if (!initialLoad) {
            const filterParams = new URLSearchParams();
            if (
                Object.keys(params).length !== 0 &&
                params.constructor === Object
            ) {
                for (const [key, value] of Object.entries(params)) {
                    filterParams.append(key, value);
                }
                history.push({ search: filterParams.toString() });
            } else {
                history.push({ search: filterParams.toString() });
            }

            getAvailableTutors({ ...params });
        }
    }, [params]);

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: () => {
            //no submit
        },
    });

    const resetFilterDisabled =
        formik.values.level == '' &&
        formik.values.subject == '' &&
        formik.values.dayOfWeek.length == 0 &&
        formik.values.timeOfDay.length == 0;

    useEffect(() => {
        if (formik.values.level !== '') {
            getSubjectOptionsByLevel(formik.values.level);

            if (isInitialSubject) {
                setIsInitialSubject(false);
            } else {
                formik.setFieldValue('subject', '');
                const paramsObj = { ...params };
                delete paramsObj.subject;
                setParams({ ...paramsObj, level: formik.values.level });
            }
        }
    }, [formik.values.level]);

    useEffect(() => {
        if (priceSortDirection === SortDirection.None) {
            const paramsObj = { ...params };
            delete paramsObj.price;
            setParams({ ...paramsObj });
        } else {
            if (params.price) {
                const paramsObj = { ...params };
                delete paramsObj.price;
                setParams({ ...paramsObj, price: priceSortDirection });
            } else {
                setParams({ ...params, price: priceSortDirection });
            }
        }
    }, [priceSortDirection]);

    const handleResetFilter = () => {
        //can't delete all params because reset button couldn't affect price sort
        const paramsObj = { ...params };
        delete paramsObj.dayOfWeek;
        delete paramsObj.level;
        delete paramsObj.subject;
        delete paramsObj.timeOfDay;
        setParams(paramsObj);

        setSubjectOptions([]);
        setDayOfWeekArray([]);
        setTimeOfDayArray([]);
        formik.setValues(initialValues);
    };

    useEffect(() => {
        if (
            subjectsData &&
            isSuccessSubjects &&
            formik.values.level !== '' &&
            !isFetchingSubjects
        ) {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData, isFetchingSubjects]);

    useEffect(() => {
        if (formik.values.level !== '' && formik.values.subject !== '') {
            setParams({ ...params, subject: formik.values.subject });
        }
    }, [formik.values.subject]);

    const handleMenuClose = () => {
        const paramsObj: IParams = { ...params };
        if (formik.values.dayOfWeek.length !== 0) {
            const dayOfWeekString = formik.values.dayOfWeek.toString();
            paramsObj.dayOfWeek = dayOfWeekString;
        } else {
            delete paramsObj.dayOfWeek;
        }
        if (formik.values.timeOfDay.length !== 0) {
            const timeOfDayString = formik.values.timeOfDay.toString();
            paramsObj.timeOfDay = timeOfDayString;
        } else {
            delete paramsObj.timeOfDay;
        }
        setParams(paramsObj);
    };

    const CustomMenu = (props: MenuProps) => {
        return (
            <components.Menu className="react-select--availability" {...props}>
                <div>
                    <div className="type--uppercase type--color--tertiary mb-4">
                        {t('SEARCH_TUTORS.TUTOR_AVAILABLE')}
                    </div>
                    <div>
                        <CustomCheckbox
                            id="beforeNoon"
                            customChecks={timeOfDayArray}
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.BEFORE_NOON'
                            )}
                            handleCustomCheck={handleCustomTimeOfDay}
                        />
                        <CustomCheckbox
                            customChecks={timeOfDayArray}
                            id="noonToFive"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.NOON_TO_FIVE'
                            )}
                            handleCustomCheck={handleCustomTimeOfDay}
                        />
                        <CustomCheckbox
                            customChecks={timeOfDayArray}
                            id="afterFive"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.AFTER_FIVE'
                            )}
                            handleCustomCheck={handleCustomTimeOfDay}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="type--uppercase type--color--tertiary mb-4">
                        {t('SEARCH_TUTORS.TUTOR_AVAILABLE')}
                    </div>
                    <div>
                        <CustomCheckbox
                            id="mon"
                            customChecks={dayOfWeekArray}
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.MON'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                        <CustomCheckbox
                            customChecks={dayOfWeekArray}
                            id="tue"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.TUE'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                        <CustomCheckbox
                            customChecks={dayOfWeekArray}
                            id="wed"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.WED'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                        <CustomCheckbox
                            customChecks={dayOfWeekArray}
                            id="thu"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.THU'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                        <CustomCheckbox
                            customChecks={dayOfWeekArray}
                            id="fri"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.FRI'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                        <CustomCheckbox
                            customChecks={dayOfWeekArray}
                            id="sat"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SAT'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                        <CustomCheckbox
                            customChecks={dayOfWeekArray}
                            id="sun"
                            label={t(
                                'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SUN'
                            )}
                            handleCustomCheck={(id: string) => {
                                handleCustomDayOfWeek(id);
                            }}
                        />
                    </div>
                </div>
            </components.Menu>
        );
    };

    const handleCustomDayOfWeek = (id: string) => {
        const ifExist = dayOfWeekArray.find((item) => item === id);

        if (ifExist) {
            const filteredList = dayOfWeekArray.filter((item) => item !== id);
            setDayOfWeekArray(filteredList);
        } else {
            setDayOfWeekArray([...dayOfWeekArray, id]);
        }
    };

    const handleCustomTimeOfDay = (id: string) => {
        const ifExist = timeOfDayArray.find((item) => item === id);

        if (ifExist) {
            const filteredList = timeOfDayArray.filter((item) => item !== id);
            setTimeOfDayArray(filteredList);
        } else {
            setTimeOfDayArray([...timeOfDayArray, id]);
        }
    };

    useEffect(() => {
        formik.setFieldValue('dayOfWeek', dayOfWeekArray);
    }, [dayOfWeekArray]);

    useEffect(() => {
        formik.setFieldValue('timeOfDay', timeOfDayArray);
    }, [timeOfDayArray]);

    return (
        <MainWrapper>
            <div className="card--secondary">
                <div className="card--secondary__head">
                    <div className="type--lg type--wgt--bold">
                        {t('SEARCH_TUTORS.TUTOR_LIST')}
                    </div>
                    <div className="flex flex--center">
                        <FormikProvider value={formik}>
                            <Form className="flex" noValidate>
                                <MySelect
                                    field={formik.getFieldProps('level')}
                                    form={formik}
                                    meta={formik.getFieldMeta('level')}
                                    classNamePrefix="react-select--search-tutor"
                                    isMulti={false}
                                    options={levelOptions ? levelOptions : []}
                                    isDisabled={levelDisabled}
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.LEVEL'
                                    )}
                                ></MySelect>
                                <MySelect
                                    field={formik.getFieldProps('subject')}
                                    form={formik}
                                    meta={formik.getFieldMeta('subject')}
                                    isMulti={false}
                                    className="ml-6"
                                    classNamePrefix="react-select--search-tutor"
                                    options={subjectOptions}
                                    isDisabled={
                                        levelDisabled || isLoadingSubjects
                                    }
                                    noOptionsMessage={() =>
                                        t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')
                                    }
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.SUBJECT'
                                    )}
                                ></MySelect>
                                <Select
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.AVAILABILITY'
                                    )}
                                    components={{
                                        Menu: CustomMenu,
                                    }}
                                    className="ml-6"
                                    onMenuClose={handleMenuClose}
                                    isSearchable={false}
                                ></Select>
                            </Form>
                        </FormikProvider>
                        <button
                            className="btn btn--clear ml-6"
                            onClick={handleResetFilter}
                            disabled={resetFilterDisabled}
                        >
                            {t('SEARCH_TUTORS.RESET_FILTER')}
                        </button>
                    </div>
                </div>
                <div className="card--secondary__body">
                    <div className="mb-10 flex--primary">
                        <div>
                            <span className="type--uppercase type--color--tertiary">
                                {t('SEARCH_TUTORS.TUTOR_AVAILABLE')}
                            </span>
                            <span className="tag--primary d--ib ml-2">
                                {availableTutors ? availableTutors.count : '0'}
                            </span>
                        </div>
                        <PriceSort
                            sortDirection={priceSortDirection}
                            handleActiveSort={(sortDirection: SortDirection) =>
                                setPriceSortDirection(sortDirection)
                            }
                        />
                    </div>
                    <div className="tutor-list">
                        {isLoadingAvailableTutors ? (
                            // Here goes loader
                            <div className="loader--sceleton">
                                <LoaderTutor />
                                <LoaderTutor />
                                <LoaderTutor />
                            </div>
                        ) : availableTutors && availableTutors.count !== 0 ? (
                            availableTutors.rows.map((tutor) => (
                                <TutorItem key={tutor.userId} tutor={tutor} />
                            ))
                        ) : (
                            <div className="tutor-list__no-results">
                                <h1 className="tutor-list__no-results__title">
                                    {t('SEARCH_TUTORS.NO_RESULT.TITLE')}
                                </h1>
                                <p className="tutor-list__no-results__subtitle">
                                    {t('SEARCH_TUTORS.NO_RESULT.DESC')}
                                </p>
                                <button
                                    className="btn btn--clear ml-6 type--wgt--bold"
                                    onClick={handleResetFilter}
                                    disabled={resetFilterDisabled}
                                >
                                    {t('SEARCH_TUTORS.RESET_FILTER')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default SearchTutors;
