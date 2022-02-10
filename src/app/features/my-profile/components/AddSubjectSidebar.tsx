import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { useGetLevelOptionsQuery } from '../../../../services/levelService';
import {
    useCreateSubjectMutation,
    useLazyGetSubjectOptionsByLevelQuery,
    useLazyGetSubjectsByLevelAndSubjectQuery,
} from '../../../../services/subjectService';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import toastService from '../../../services/toastService';

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    handleGetData: () => void;
}

interface Values {
    level: string;
    subject: string;
    price: string;
}

const AddSubjectSidebar = (props: Props) => {
    const { closeSidebar, sideBarIsOpen, handleGetData } = props;

    const history = useHistory();

    const { data: levelOptions, isLoading: isLoadingLevels } =
        useGetLevelOptionsQuery();

    const [createSubject, { isSuccess: isSuccessCreateSubject }] =
        useCreateSubjectMutation();

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

    useEffect(() => {
        if (subjectsData && isSuccessSubjects && formik.values.level !== '') {
            setSubjectOptions(subjectsData);
        }
    }, [subjectsData]);

    const { t } = useTranslation();

    const initialValues: Values = {
        level: '',
        subject: '',
        price: '',
    };

    const handleSubmit = (values: Values) => {
        createSubject({
            subjectId: values.subject,
            price: Number(values.price),
        });
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            level: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            subject: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            price: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    useEffect(() => {
        formik.setFieldValue('subject', '');
        if (formik.values.level !== '') {
            getSubjectOptionsByLevel({
                levelId: formik.values.level,
            });
        }
    }, [formik.values.level]);

    useEffect(() => {
        if (isSuccessCreateSubject) {
            toastService.success('Subject created');
            closeSidebar();
            handleGetData();
            formik.resetForm();
        }
    }, [isSuccessCreateSubject]);

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
                        ADD NEW SUBJECT
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
                                    options={levelOptions ? levelOptions : []}
                                    isDisabled={levelDisabled}
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.LEVEL'
                                    )}
                                    classNamePrefix="onboarding-select"
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
                                    isDisabled={
                                        levelDisabled || isLoadingSubjects
                                    }
                                    noOptionsMessage={() =>
                                        t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')
                                    }
                                    placeholder={t(
                                        'SEARCH_TUTORS.PLACEHOLDER.SUBJECT'
                                    )}
                                    classNamePrefix="onboarding-select"
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
                                    type="number"
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
                            onClick={closeSidebar}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSubjectSidebar;
