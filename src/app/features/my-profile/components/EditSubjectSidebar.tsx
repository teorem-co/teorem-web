import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import IParams from '../../../../interfaces/IParams';
import {
    useGetLevelOptionsQuery,
    useLazyGetLevelOptionsQuery,
} from '../../../../services/levelService';
import {
    useDeleteSubjectMutation,
    useLazyGetSubjectOptionsByLevelQuery,
    useLazyGetSubjectsByLevelAndSubjectQuery,
    useUpdateSubjectMutation,
} from '../../../../services/subjectService';
import { useLazyGetTutorProfileDataQuery } from '../../../../services/tutorService';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import getUrlParams from '../../../utils/getUrlParams';

interface Values {
    level: string;
    subject: string;
    price: string;
}

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    handleGetData: () => void;
}

const EditSubjectSidebar = (props: Props) => {
    const { closeSidebar, sideBarIsOpen, handleGetData } = props;

    //get level and subject name from user subject with mapping
    const history = useHistory();
    const tutorId = useAppSelector((state) => state.auth.user?.id);

    const { data: levelOptions, isLoading: isLoadingLevels } =
        useGetLevelOptionsQuery();

    const [
        deleteSubject,
        {
            isLoading: isLoadingDeleteSubject,
            isSuccess: isSuccessDeleteSubject,
        },
    ] = useDeleteSubjectMutation();

    const [
        getProfileData,
        {
            data: myTeachingsData,
            isSuccess: isSuccessMyTeachings,
            isLoading: isLoadingMyTeachings,
        },
    ] = useLazyGetTutorProfileDataQuery({
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

    const [updateSubject, { isSuccess: isSuccessUpdateSubject }] =
        useUpdateSubjectMutation();

    useEffect(() => {
        getProfileData(tutorId ? tutorId : '');
    }, []);

    const urlQueries = getUrlParams(history.location.search.replace('?', ''));

    const selectedSubject =
        myTeachingsData.tutorSubjects &&
        myTeachingsData.tutorSubjects.find(
            (x) => x.subjectId === urlQueries.subjectId
        );

    const [
        getSubjectOptionsByLevel,
        {
            data: subjectsData,
            isLoading: isLoadingSubjects,
            isSuccess: isSuccessSubjects,
        },
    ] = useLazyGetSubjectsByLevelAndSubjectQuery();

    const levelDisabled = !levelOptions || isLoadingLevels;

    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);

    const handleDeleteSubject = (objectId: string) => {
        deleteSubject(objectId);
    };

    useEffect(() => {
        if (subjectsData && isSuccessSubjects && formik.values.level !== '') {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData]);

    useEffect(() => {
        if (sideBarIsOpen) {
            if (
                selectedSubject?.levelId &&
                selectedSubject.subjectId &&
                selectedSubject.price
            ) {
                formik.setFieldValue('level', selectedSubject.levelId);
                formik.setFieldValue('subject', selectedSubject.subjectId);
                formik.setFieldValue('price', selectedSubject.price);
            }
        }
    }, [sideBarIsOpen]);

    // useEffect(() => {
    //     const filterParams = new URLSearchParams();
    //     if (Object.keys(params).length !== 0 && params.constructor === Object) {
    //         for (const [key, value] of Object.entries(params)) {
    //             filterParams.append(key, value);
    //         }
    //         history.push({ search: filterParams.toString() });
    //     } else {
    //         history.push({ search: filterParams.toString() });
    //     }
    // }, [params]);

    const initialValues: Values = {
        level: '',
        subject: '',
        price: '',
    };

    const { t } = useTranslation();

    const handleSubmit = (values: Values) => {
        updateSubject({
            subjectId: values.subject,
            price: Number(values.price),
            objectId: selectedSubject?.id,
        });
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            price: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    useEffect(() => {
        if (selectedSubject?.levelId && selectedSubject.subjectId) {
            getSubjectOptionsByLevel({
                levelId: selectedSubject.levelId,
                subjectId: selectedSubject.subjectId,
            });
        }
    }, [selectedSubject?.levelId]);

    useEffect(() => {
        if (isSuccessUpdateSubject) {
            toastService.success('Subject updated');
            closeSidebar();
            handleGetData();
        }
    }, [isSuccessUpdateSubject]);

    useEffect(() => {
        if (isSuccessDeleteSubject) {
            toastService.success('Subject deleted');
            closeSidebar();
            handleGetData();
        }
    }, [isSuccessDeleteSubject]);

    return (
        <div>
            <div
                className={`cur--pointer sidebar__overlay ${
                    !sideBarIsOpen ? 'sidebar__overlay--close' : ''
                }`}
                onClick={closeSidebar}
            ></div>

            <div
                className={`sidebar sidebar--secondary sidebar--secondary ${
                    !sideBarIsOpen ? 'sidebar--secondary--close' : ''
                }`}
            >
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">
                        EDIT SUBJECT DETAILS
                    </div>
                    <div>
                        <i
                            className="icon icon--base icon--close icon--grey"
                            onClick={closeSidebar}
                        ></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">
                    <FormikProvider value={formik}>
                        <Form noValidate>
                            <div>
                                <label htmlFor="level">
                                    Select subject you teach*
                                </label>
                                <MySelect
                                    field={formik.getFieldProps('level')}
                                    form={formik}
                                    meta={formik.getFieldMeta('level')}
                                    isMulti={false}
                                    options={levelOptions}
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.LEVEL'
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor="subject">
                                    Select levels that you are able to teach*
                                </label>
                                <MySelect
                                    field={formik.getFieldProps('subject')}
                                    form={formik}
                                    meta={formik.getFieldMeta('subject')}
                                    isMulti={false}
                                    options={subjectOptions}
                                    noOptionsMessage={() =>
                                        t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')
                                    }
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.SUBJECT'
                                    )}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="price" className="field__label">
                                    Pricing
                                </label>
                                <TextField
                                    name="price"
                                    id="price"
                                    placeholder="$0/hr"
                                    withoutErr={
                                        formik.errors.price &&
                                        formik.touched.price
                                            ? false
                                            : true
                                    }
                                />
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button
                            className="btn btn--clear type--wgt--bold"
                            onClick={() => formik.handleSubmit()}
                        >
                            Save information
                        </button>
                        <button
                            className="btn btn--clear type--color--error type--wgt--bold"
                            onClick={() =>
                                handleDeleteSubject(
                                    selectedSubject ? selectedSubject.id : ''
                                )
                            }
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSubjectSidebar;
