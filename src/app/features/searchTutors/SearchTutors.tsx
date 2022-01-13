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
    availability: string[];
}

//ADD TRANSLATIONS !!
//add params to tutor search service
const SearchTutors = () => {
    const history = useHistory();

    const [params, setParams] = useState<IParams>({});
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

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
        { data: subjectOptions, isLoading: isLoadingSubjects },
    ] = useLazyGetSubjectOptionsByLevelQuery();

    const levelDisabled = !levelOptions || isLoadingLevels;

    // const resetFilterDisabled

    const initialValues: Values = {
        subject: '',
        level: '',
        availability: [],
    };

    useEffect(() => {
        const urlQueries: IParams = getUrlParams(
            history.location.search.replace('?', '')
        );

        if (Object.keys(urlQueries).length > 0) {
            urlQueries.level &&
                getSubjectOptionsByLevel(urlQueries.level) &&
                formik.setFieldValue('level', urlQueries.level);
            urlQueries.subject &&
                formik.setFieldValue('subject', urlQueries.subject);
            urlQueries.availability &&
                formik.setFieldValue(
                    'availability',
                    urlQueries.availability.split(',')
                );
            setParams(urlQueries);
        } else {
            getAvailableTutors(params);
        }

        getLevelOptions();
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

    useEffect(() => {
        if (formik.values.level !== '') {
            //this line causes problem on initial load, handle it later
            //it sets subject to empty even if it exists
            formik.setFieldValue('subject', '');
            getSubjectOptionsByLevel(formik.values.level);
            const paramsObj = { ...params };
            delete paramsObj.subject;
            setParams({ ...paramsObj, level: formik.values.level });
        }
    }, [formik.values.level]);

    const handleResetFilter = () => {
        //add query clear when reseting filter
        //set subject disabled
        //clear query (params object) set params to empty object
        formik.setValues(initialValues);
    };

    useEffect(() => {
        if (formik.values.level !== '' && formik.values.subject !== '') {
            setParams({ ...params, subject: formik.values.subject });
        }
    }, [formik.values.subject]);

    const handleMenuClose = () => {
        if (formik.values.availability.length !== 0) {
            const availabilityString = formik.values.availability.toString();
            setParams({ ...params, availability: availabilityString });
        }
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
                                        name="availability"
                                        value="beforeNoon"
                                    />
                                    PRE 12 PM
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
                                        value="noonToFive"
                                    />
                                    12 - 5 PM
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
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
                                        name="availability"
                                        value="mon"
                                    />
                                    MON
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
                                        value="tue"
                                    />
                                    TUE
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
                                        value="wed"
                                    />
                                    WED
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
                                        value="thu"
                                    />
                                    THU
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
                                        value="fri "
                                    />
                                    FRI
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
                                        value="sat"
                                    />
                                    SAT
                                </label>
                                <label>
                                    <Field
                                        type="checkbox"
                                        name="availability"
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
                            //add disabled logic
                            disabled={true}
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
                        <div className="tutor-list__item">
                            <div className="tutor-list__item__img">slika</div>
                            <div className="tutor-list__item__info">
                                <div className="type--md mb-1">Maria Diaz</div>
                                <div className="type--color--brand mb-4">
                                    Primary School Teacher
                                </div>
                                <div className="type--color--secondary mb-6 w--632--max">
                                    Keen and enthusiastic palaeontology student
                                    looking forward to helping you with any
                                    challenging topics in Biology and/or
                                    Geology!
                                </div>
                                <div>
                                    <span className="tag--primary">
                                        Geology
                                    </span>
                                    <span className="tag--primary">
                                        Biology
                                    </span>
                                </div>
                            </div>
                            <div className="tutor-list__item__details">
                                <div className="flex--grow">
                                    <div className="flex flex--center mb-3">
                                        <i className="icon icon--star icon--base icon--grey"></i>
                                        <span className="d--ib ml-4">
                                            4.9 rating
                                        </span>
                                    </div>
                                    <div className="flex flex--center">
                                        <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                        <span className="d--ib ml-4">
                                            15 completed lessions
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn--primary btn--base w--100">
                                        View profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default SearchTutors;
