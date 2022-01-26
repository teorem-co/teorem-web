import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import IParams from '../../../../interfaces/IParams';
import { useLazyGetLevelOptionsQuery } from '../../../../services/levelService';
import { useLazyGetSubjectOptionsByLevelQuery } from '../../../../services/subjectService';
import MySelect from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import getUrlParams from '../../../utils/getUrlParams';

interface Values {
    level: string;
    subject: string;
    price: string;
}

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
}

const EditSubjectSidebar = (props: Props) => {
    const { closeSidebar, sideBarIsOpen } = props;

    //get level and subject name from user subject with mapping
    const history = useHistory();

    const [params, setParams] = useState<IParams>({});

    useEffect(() => {
        if (sideBarIsOpen) {
            const urlQueries: IParams = getUrlParams(
                history.location.search.replace('?', '')
            );

            if (Object.keys(urlQueries).length > 0) {
                setParams(urlQueries);
                if (urlQueries.level) {
                    formik.setFieldValue('level', urlQueries.level);
                }
                urlQueries.subject &&
                    formik.setFieldValue('subject', urlQueries.subject);
                urlQueries.price &&
                    formik.setFieldValue('price', urlQueries.price);
            }
        } else {
            setParams({});
        }
    }, [sideBarIsOpen]);

    useEffect(() => {
        const filterParams = new URLSearchParams();
        if (Object.keys(params).length !== 0 && params.constructor === Object) {
            for (const [key, value] of Object.entries(params)) {
                filterParams.append(key, value);
            }
            history.push({ search: filterParams.toString() });
        } else {
            history.push({ search: filterParams.toString() });
        }
    }, [params]);

    const initialValues: Values = {
        level: '',
        subject: '',
        price: '',
    };

    const { t } = useTranslation();

    const handleSubmit = (values: Values) => {
        const test = values;
        debugger;
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            price: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

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
                                    options={[]}
                                    isDisabled={true}
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
                                    options={[]}
                                    isDisabled={true}
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
                        <button className="btn btn--clear type--color--error type--wgt--bold">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSubjectSidebar;
