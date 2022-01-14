import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
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

//ADD TRANSLATIONS !!
const SearchTutors = () => {
    const history = useHistory();

    const [params, setParams] = useState<IParams>({});
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    //initialSubject is not reset on initial level change
    const [isInitialSubject, setIsInitialSubject] = useState<boolean>(false);

    //storing subjects in state so it can reset on Reset Filter
    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);

    //use isLoadingAvailableTutors to show loader
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
        onSubmit: (values) => {
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
        }
        if (formik.values.timeOfDay.length !== 0) {
            const timeOfDayString = formik.values.timeOfDay.toString();
            paramsObj.timeOfDay = timeOfDayString;
        }
        setParams(paramsObj);
    };

    const CustomMenu = (props: MenuProps) => {
        return (
            <div>
                <components.Menu {...props}>
                    <FormikProvider value={formik}>
                        <Form style={{ height: '150px' }}>
                            <div>TIME OF DAY</div>
                            <div role="group" aria-labelledby="checkbox-group">
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="timeOfDay"
                                        value="beforeNoon"
                                    />
                                    PRE 12 PM
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="timeOfDay"
                                        value="noonToFive"
                                    />
                                    12 - 5 PM
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="timeOfDay"
                                        value="afterFive"
                                    />
                                    AFTER 5 PM
                                </label>
                            </div>
                            <div>DAY OF WEEK</div>
                            <div role="group" aria-labelledby="checkbox-group">
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="mon"
                                    />
                                    MON
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="tue"
                                    />
                                    TUE
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="wed"
                                    />
                                    WED
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="thu"
                                    />
                                    THU
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="fri"
                                    />
                                    FRI
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="sat"
                                    />
                                    SAT
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="dayOfWeek"
                                        value="sun"
                                    />
                                    SUN
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
                    <div className="type--lg type--wgt--bold">Tutor list</div>
                    <div className="flex flex--center">
                        <FormikProvider value={formik}>
                            <Form className="flex" noValidate>
                                <MySelect
                                    field={formik.getFieldProps('level')}
                                    form={formik}
                                    meta={formik.getFieldMeta('level')}
                                    isMulti={false}
                                    options={levelOptions}
                                    isDisabled={levelDisabled}
                                    //add translations
                                    placeholder="Level"
                                ></MySelect>
                                <MySelect
                                    field={formik.getFieldProps('subject')}
                                    form={formik}
                                    meta={formik.getFieldMeta('subject')}
                                    isMulti={false}
                                    options={subjectOptions}
                                    isDisabled={
                                        levelDisabled || isLoadingSubjects
                                    }
                                    className="ml-6"
                                    noOptionsMessage={() =>
                                        'Please select level first'
                                    }
                                    //add translations
                                    placeholder="Subject"
                                ></MySelect>
                                <Select
                                    placeholder="Custom availability"
                                    components={{
                                        Menu: CustomMenu,
                                    }}
                                    className="ml-6"
                                    classNamePrefix="tutorSearch"
                                    onMenuClose={handleMenuClose}
                                ></Select>
                            </Form>
                        </FormikProvider>
                        <button
                            className="btn btn--clear ml-6"
                            onClick={handleResetFilter}
                            disabled={resetFilterDisabled}
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>
                <div className="card--search__body">
                    <div className="mb-10">
                        <span className="type--uppercase type--color--tertiary">
                            Tutor Available
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
                                        Slika
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
                                        <div className="type--color--secondary mb-6 w--632--max">
                                            {tutor.aboutTutor
                                                ? tutor.aboutTutor
                                                : ''}
                                        </div>
                                        <div>
                                            {tutor.Subjects
                                                ? tutor.Subjects.map(
                                                      (subject) => (
                                                          <span>
                                                              {subject.name}
                                                          </span>
                                                      )
                                                  )
                                                : ''}
                                        </div>
                                    </div>
                                    <div className="tutor-list__item__details">
                                        <div className="flex--grow">
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
