import { Form, FormikProvider, useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import TextField from '../../../components/form/TextField';

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
}

interface Values {
    cardFirstName: string;
    cardLastName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
}

const AddCreditCard = (props: Props) => {
    const { sideBarIsOpen, closeSidebar } = props;

    const initialValues: Values = {
        cardFirstName: '',
        cardLastName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipCode: '',
    };

    const handleSubmit = (values: Values) => {
        const test = values;
    };

    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            cardFirstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cardLastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cardNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cvv: Yup.string()
                .max(3, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
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
                    <div className="type--color--secondary">ADD NEW CARD</div>
                    <div>
                        <i
                            className="icon icon--base icon--close icon--grey"
                            onClick={closeSidebar}
                        ></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">
                    <FormikProvider value={formik}>
                        <Form>
                            <div className="field">
                                <label
                                    htmlFor="cardFirstName"
                                    className="field__label"
                                >
                                    First Name*
                                </label>
                                <TextField
                                    name="cardFirstName"
                                    id="cardFirstName"
                                    placeholder="Enter First Name"
                                    withoutErr={
                                        formik.errors.cardFirstName &&
                                        formik.touched.cardFirstName
                                            ? false
                                            : true
                                    }
                                />
                            </div>
                            <div className="field">
                                <label
                                    htmlFor="cardLastName"
                                    className="field__label"
                                >
                                    Last Name*
                                </label>
                                <TextField
                                    name="cardLastName"
                                    id="cardLastName"
                                    placeholder="Enter Last Name"
                                    withoutErr={
                                        formik.errors.cardLastName &&
                                        formik.touched.cardLastName
                                            ? false
                                            : true
                                    }
                                />
                            </div>
                            <div className="field">
                                <label
                                    htmlFor="cardNumber"
                                    className="field__label"
                                >
                                    Card Number*
                                </label>
                                <TextField
                                    type="number"
                                    name="cardNumber"
                                    id="cardNumber"
                                    placeholder="**** **** **** ****"
                                />
                            </div>
                            <div className="field field__file">
                                <div className="flex">
                                    <div className="field w--100 mr-6">
                                        <label
                                            htmlFor="expiryDate"
                                            className="field__label"
                                        >
                                            Expiry date*
                                        </label>
                                        <TextField
                                            type="number"
                                            name="expiryDate"
                                            id="expiryDate"
                                            placeholder="MM / YY"
                                        />
                                    </div>

                                    <div className="field w--100">
                                        <label
                                            htmlFor="cvv"
                                            className="field__label"
                                        >
                                            CVV*
                                        </label>
                                        <TextField
                                            max={3}
                                            maxLength={3}
                                            type="number"
                                            name="cvv"
                                            id="cvv"
                                            placeholder="***"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label
                                    htmlFor="zipCode"
                                    className="field__label"
                                >
                                    ZIP / Postal Code*
                                </label>
                                <TextField
                                    type="number"
                                    name="zipCode"
                                    id="zipCode"
                                    placeholder="Enter ZIP / Postal Code"
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
                            Add New Card
                        </button>
                        <button className="btn btn--clear type--color--error type--wgt--bold">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCreditCard;
