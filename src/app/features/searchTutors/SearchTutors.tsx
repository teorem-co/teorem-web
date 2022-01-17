import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Select, { components, MenuProps } from 'react-select';

import IParams from '../../../interfaces/IParams';
import { useLazyGetLevelOptionsQuery } from '../../../services/levelService';
import { useLazyGetSubjectOptionsByLevelQuery } from '../../../services/subjectService';
import { useLazyGetAvailableTutorsQuery } from '../../../services/tutorService';
import MainWrapper from '../../components/MainWrapper';
import MySelect, { OptionType } from '../../components/MySelectField';
import getUrlParams from '../../utils/getUrlParams';

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
                formik.setFieldValue(
                    'dayOfWeek',
                    urlQueries.dayOfWeek.split(',')
                );
            urlQueries.timeOfDay &&
                formik.setFieldValue(
                    'timeOfDay',
                    urlQueries.timeOfDay.split(',')
                );

            setParams(urlQueries);
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

    const handleResetFilter = () => {
        setParams({});
        setSubjectOptions([]);
        formik.setValues(initialValues);
    };

    useEffect(() => {
        if (subjectsData && isSuccessSubjects) {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData, subjectOptions]);

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
            <div>
                <components.Menu {...props}>
                    <FormikProvider value={formik}>
                        <Form style={{ height: '150px' }}>
                            <div>
                                {t(
                                    'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.LABEL'
                                )}
                            </div>
                            <div role="group" aria-labelledby="checkbox-group">
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="timeOfDay"
                                        value="beforeNoon"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.BEFORE_NOON'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="timeOfDay"
                                        value="noonToFive"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.NOON_TO_FIVE'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="timeOfDay"
                                        value="afterFive"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.AFTER_FIVE'
                                    )}
                                </label>
                            </div>
                            <div>
                                {t(
                                    'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.LABEL'
                                )}
                            </div>
                            <div role="group" aria-labelledby="checkbox-group">
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="mon"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.MON'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="tue"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.TUE'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="wed"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.WED'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="thu"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.THU'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="fri"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.FRI'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="sat"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SAT'
                                    )}
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="sun"
                                    />
                                    {t(
                                        'SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SUN'
                                    )}
                                </label>
                            </div>
                        </Form>
                    </FormikProvider>
                </components.Menu>
            </div>
        );
    };

    return (
        <MainWrapper>
            <div className="card--search">
                <div className="card--search__head">
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
                                    classNamePrefix="search-tutor"
                                    menuIsOpen={true}
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
                                    classNamePrefix="search-tutor"
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
                <div className="card--search__body">
                    <div className="mb-10">
                        <span className="type--uppercase type--color--tertiary">
                            {t('SEARCH_TUTORS.TUTOR_AVAILABLE')}
                        </span>
                        <span className="tag--primary d--ib ml-2">
                            {availableTutors ? availableTutors.count : '0'}
                        </span>
                    </div>
                    <div className="tutor-list">
                        {isLoadingAvailableTutors ? (
                            // Here goes loader
                            <div>Loading tutors....</div>
                        ) : availableTutors && availableTutors.count !== 0 ? (
                            availableTutors.rows.map((tutor) => (
                                <div className="tutor-list__item">
                                    <div className="tutor-list__item__img">
                                        <img
                                            src="https://source.unsplash.com/random/300×300/?face"
                                            alt="tutor-list"
                                        />
                                    </div>
                                    <div className="tutor-list__item__info">
                                        <div className="type--md mb-1">
                                            {tutor.User.firstName &&
                                            tutor.User.lastName
                                                ? `${tutor.User.firstName} ${tutor.User.lastName}`
                                                : ''}
                                        </div>
                                        <div className="type--color--brand mb-4">
                                            {tutor.currentOccupation
                                                ? tutor.currentOccupation
                                                : ''}
                                        </div>
                                        <div
                                            className={`type--color--secondary ${
                                                tutor.Subjects.length > 0
                                                    ? 'mb-6'
                                                    : ''
                                            } w--632--max`}
                                        >
                                            {tutor.aboutTutor
                                                ? tutor.aboutTutor
                                                : ''}
                                        </div>
                                        <div>
                                            {tutor.Subjects
                                                ? tutor.Subjects.map(
                                                      (subject) => (
                                                          <span className="tag tag--primary">
                                                              {subject.name}
                                                          </span>
                                                      )
                                                  )
                                                : ''}
                                        </div>
                                    </div>
                                    <div className="tutor-list__item__details">
                                        <div className="flex--grow mb-6">
                                            <div className="flex flex--center mb-3">
                                                <i className="icon icon--star icon--base icon--grey"></i>
                                                <span className="d--ib ml-4">
                                                    {/* Add later */}
                                                    4.9
                                                </span>
                                            </div>
                                            <div className="flex flex--center">
                                                <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                                <span className="d--ib ml-4">
                                                    {/* Add later */}
                                                    15 completed lessions
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn btn--primary btn--base w--100">
                                                {/* Add on click later */}
                                                View profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No results</div>
                        )}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default SearchTutors;
