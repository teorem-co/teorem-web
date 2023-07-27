import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import { useGetLevelOptionsQuery } from '../../../../services/levelService';
import { useDeleteSubjectMutation, useLazyGetSubjectsByLevelAndSubjectQuery, useUpdateSubjectMutation } from '../../../../services/subjectService';
import { useLazyGetProfileProgressQuery, useLazyGetTutorProfileDataQuery } from '../../../../services/tutorService';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { useLazyGetCountriesQuery } from '../../../features/onboarding/services/countryService';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import getUrlParams from '../../../utils/getUrlParams';
import { setMyProfileProgress } from '../slices/myProfileSlice';

interface Values {
    level: string;
    subject: string;
    price: string;
}

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    handleGetData: () => void;
    tutorId?: string;
}

const EditSubjectSidebar = (props: Props) => {
    const { closeSidebar, sideBarIsOpen, handleGetData } = props;

    const { data: levelOptions, isLoading: isLoadingLevels } = useGetLevelOptionsQuery();
    const [updateSubject, { isSuccess: isSuccessUpdateSubject }] = useUpdateSubjectMutation();
    const [deleteSubject] = useDeleteSubjectMutation();
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getSubjectOptionsByLevel, { data: subjectsData, isSuccess: isSuccessSubjects }] = useLazyGetSubjectsByLevelAndSubjectQuery();
    const countryId = useAppSelector((state) => state?.user?.user?.countryId);
    const [getCountries] = useLazyGetCountriesQuery();
    const [getProfileData, { data: myTeachingsData }] = useLazyGetTutorProfileDataQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                occupation: data?.currentOccupation,
                yearsOfExperience: data?.yearsOfExperience,
                tutorSubjects: data?.TutorSubjects,
            },
            isSuccess,
            isLoading,
        }),
    });

    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
    const [initialValues, setInitialValues] = useState<Values>({
        level: '',
        subject: '',
        price: '',
    });
    const [currency, setCurrency] = useState('PZL');
    const [minPrice, setMinPrice] = useState(47);
    const getCurrency = async () => {
        const res = await getCountries().unwrap();
        res.forEach(c => {
            if (c.id === countryId) {
                setCurrency(c.currencyCode);
                if (c.currencyCode == "EUR")
                    setMinPrice(10);
                if (c.currencyCode == "PLZ")
                    setMinPrice(47);
            }
        });
    };

    //get level and subject name from user subject with mapping
    const history = useHistory();
    const dispatch = useAppDispatch();
    const tutorId = useAppSelector((state) => state.auth.user?.id);
    const urlQueries = getUrlParams(history.location.search.replace('?', ''));
    const selectedSubject = myTeachingsData.tutorSubjects && myTeachingsData.tutorSubjects.find((x) => x.subjectId === urlQueries.subjectId);
    const levelDisabled = !levelOptions || isLoadingLevels;
    const { t } = useTranslation();

    const handleDeleteSubject = async (objectId: string) => {
        await deleteSubject(objectId);
        handleGetData();
        closeSidebar();
        toastService.success(t('MY_PROFILE.MY_TEACHINGS.DELETED'));

        //handle profile progress
        if (myTeachingsData.tutorSubjects?.length === 1) {
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
        }
    };

    const handleSubmit = (values: Values) => {
        updateSubject({
            subjectId: values.subject,
            price: Number(values.price),
            objectId: selectedSubject?.id,
            tutorId: props.tutorId || '',
        });
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            price: Yup.number().required(t('FORM_VALIDATION.REQUIRED')).min(minPrice, t('FORM_VALIDATION.PRICE') + minPrice),
        }),
    });

    useEffect(() => {
        if (!isEqual(formik.values.level, initialValues.level)) {
            formik.setFieldValue('subject', '');
        } else {
            formik.setFieldValue('subject', selectedSubject?.subjectId);
        }
        if (selectedSubject?.subjectId) {
            getSubjectOptionsByLevel({
                levelId: formik.values.level,
                subjectId: selectedSubject?.subjectId,
            });
        }
    }, [formik.values.level, initialValues.subject]);

    useEffect(() => {
        if (isSuccessUpdateSubject) {
            toastService.success('Subject updated');
            closeSidebar();
            handleGetData();
        }
    }, [isSuccessUpdateSubject]);

    useEffect(() => {
        if (subjectsData && isSuccessSubjects && formik.values.level !== '') {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData]);

    useEffect(() => {
        getProfileData(props.tutorId ? props.tutorId : tutorId ? tutorId : "");
    }, []);

    useEffect(() => {
        if (sideBarIsOpen) {
            if (selectedSubject?.levelId && selectedSubject.subjectId && selectedSubject.price) {
                formik.setFieldValue('level', selectedSubject.levelId);
                formik.setFieldValue('subject', selectedSubject.subjectId);
                formik.setFieldValue('price', selectedSubject.price);
            }
        }
    }, [sideBarIsOpen]);

    useEffect(() => {
        if (sideBarIsOpen) {
            if (selectedSubject?.levelId && selectedSubject.subjectId && selectedSubject.price) {
                const values: Values = {
                    level: selectedSubject.levelId,
                    subject: selectedSubject.subjectId,
                    price: selectedSubject.price.toString(),
                };
                console.log("SETTING INITIAL VALUES", values);
                setInitialValues(values);
                // initialValues.level = selectedSubject.levelId;
                // initialValues.subject = selectedSubject.subjectId;
                // initialValues.price = selectedSubject.price.toString();
            }
        }
    }, [sideBarIsOpen]);

    useEffect(() => {
        getCurrency();
    }, []);

    return (
        <div>
            <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={closeSidebar}></div>

            <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{t('MY_PROFILE.MY_TEACHINGS.EDIT_TITLE')}</div>
                    <div>
                        <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">
                    <FormikProvider value={formik}>
                        <Form noValidate>
                            <div>
                                <label htmlFor="level">{t('MY_PROFILE.MY_TEACHINGS.LEVEL')}*</label>
                                <MySelect
                                    field={formik.getFieldProps('level')}
                                    form={formik}
                                    meta={formik.getFieldMeta('level')}
                                    isMulti={false}
                                    options={subjectsData}
                                    noOptionsMessage={() => t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')}
                                    placeholder={t('SEARCH_TUTORS.PLACEHOLDER.LEVEL')}
                                    classNamePrefix="onboarding-select"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject">{t('MY_PROFILE.MY_TEACHINGS.SUBJECT')}*</label>
                                <MySelect
                                    field={formik.getFieldProps('subject')}
                                    form={formik}
                                    meta={formik.getFieldMeta('subject')}
                                    isMulti={false}
                                    options={levelOptions}
                                    placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
                                    classNamePrefix="onboarding-select"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="price" className="field__label">
                                    {t('MY_PROFILE.MY_TEACHINGS.PRICING')} ({currency})*
                                </label>
                                <TextField
                                    name="price"
                                    id="price"
                                    placeholder={`€0/${t('MY_PROFILE.MY_TEACHINGS.HOUR_ABRV')}`}
                                    withoutErr={!(formik.errors.price && formik.touched.price)}
                                    type="number"
                                />
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--primary btn--base type--wgt--bold" onClick={() => formik.handleSubmit()}>
                            {t('MY_PROFILE.MY_TEACHINGS.SAVE')}
                        </button>
                        <button
                            className="btn btn--clear type--color--error type--wgt--bold"
                            onClick={() => handleDeleteSubject(selectedSubject ? selectedSubject.id : '')}
                        >
                            {t('MY_PROFILE.MY_TEACHINGS.DELETE')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSubjectSidebar;
