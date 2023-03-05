import { Form, FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import TextField from '../../../components/form/TextField';
import MySelectField, { OptionType } from '../../../components/form/MySelectField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import MySelect from '../../../components/form/MySelectField';
import { ICountry, useLazyGetCountriesQuery } from '../../onboarding/services/countryService';
import { useEffect, useState } from 'react';

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    handleSubmit: (values: Values) => void;
}

export interface Values {
    cardFirstName: string;
    cardLastName: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
}

const AddCreditCard = (props: Props) => {
    const { sideBarIsOpen, closeSidebar } = props;

    const countryOptions = [
        { label: 'Argentina', value: 'AR' },
        { label: 'Australia', value: 'AU' },
        { label: 'Austria', value: 'AT' },
        { label: 'Belgium', value: 'BE' },
        { label: 'Bolivia', value: 'BO' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Bulgaria', value: 'BG' },
        { label: 'Canada', value: 'CA' },
        { label: 'Chile', value: 'CL' },
        { label: 'Colombia', value: 'CO' },
        { label: 'Costa Rica', value: 'CR' },
        { label: 'Croatia', value: 'HR' },
        { label: 'Cyprus', value: 'CY' },
        { label: 'Czech Republic', value: 'CZ' },
        { label: 'Denmark', value: 'DK' },
        { label: 'Dominican Republic', value: 'DO' },
        { label: 'Estonia', value: 'EE' },
        { label: 'Finland', value: 'FI' },
        { label: 'France', value: 'FR' },
        { label: 'Germany', value: 'DE' },
        { label: 'Greece', value: 'GR' },
        { label: 'Hong Kong SAR China', value: 'HK' },
        { label: 'Hungary', value: 'HU' },
        { label: 'Iceland', value: 'IS' },
        { label: 'India', value: 'IN' },
        { label: 'Indonesia', value: 'ID' },
        { label: 'Ireland', value: 'IE' },
        { label: 'Israel', value: 'IL' },
        { label: 'Italy', value: 'IT' },
        { label: 'Japan', value: 'JP' },
        { label: 'Latvia', value: 'LV' },
        { label: 'Liechtenstein', value: 'LI' },
        { label: 'Lithuania', value: 'LT' },
        { label: 'Luxembourg', value: 'LU' },
        { label: 'Malta', value: 'MT' },
        { label: 'Mexico ', value: 'MX' },
        { label: 'Netherlands', value: 'NL' },
        { label: 'New Zealand', value: 'NZ' },
        { label: 'Norway', value: 'NO' },
        { label: 'Paraguay', value: 'PY' },
        { label: 'Peru', value: 'PE' },
        { label: 'Poland', value: 'PL' },
        { label: 'Portugal', value: 'PT' },
        { label: 'Romania', value: 'RO' },
        { label: 'Singapore', value: 'SG' },
        { label: 'Slovakia', value: 'SK' },
        { label: 'Slovenia', value: 'SI' },
        { label: 'Spain', value: 'ES' },
        { label: 'Sweden', value: 'SE' },
        { label: 'Switzerland', value: 'CH' },
        { label: 'Thailand', value: 'TH' },
        { label: 'Trinidad & Tobago', value: 'TT' },
        { label: 'United Arab Emirates', value: 'AE' },
        { label: 'United Kingdom', value: 'GB' },
        { label: 'United States', value: 'US' },
        { label: 'Uruguay', value: 'UY' }
    ];

    const initialValues: Values = {
        cardFirstName: '',
        cardLastName: '',
        city: '',
        country: '',
        line1: '',
        line2: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipCode: '',
    };

    const handleSubmit = (values: Values) => {
        props.handleSubmit(values);
    };

    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            cardFirstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cardLastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            city: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            country: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            line1: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            line2: Yup.string(),
            cardNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cvv: Yup.string().max(3, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
            zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    return (
        <div>
            <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={closeSidebar}></div>

            <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{t('ACCOUNT.NEW_CARD.ADD')}</div>
                    <div>
                        <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">
                    <FormikProvider value={formik}>
                        <Form>
                            <div className="field">
                                <label htmlFor="cardFirstName" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.NAME')}
                                </label>
                                <TextField name="cardFirstName" id="cardFirstName" placeholder={t('ACCOUNT.NEW_CARD.NAME_PLACEHOLDER')} />
                            </div>
                            <div className="field">
                                <label htmlFor="cardLastName" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.SURNAME')}
                                </label>
                                <TextField name="cardLastName" id="cardLastName" placeholder={t('ACCOUNT.NEW_CARD.SURNAME_PLACEHOLDER')} />
                            </div>
                            <div className="field">
                                <label htmlFor="city" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.CITY')}
                                </label>
                                <TextField name="city" id="city" placeholder={t('ACCOUNT.NEW_CARD.CITY_PLACEHOLDER')} />
                            </div>
                            <div className="field">
                                <label htmlFor="country" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.COUNTRY')}
                                </label>
                                <MySelect
                                    form={formik}
                                    field={formik.getFieldProps('country')}
                                    meta={formik.getFieldMeta('country')}
                                    isMulti={false}
                                    classNamePrefix="onboarding-select"
                                    options={countryOptions}
                                    placeholder={t('ACCOUNT.NEW_CARD.COUNTRY_PLACEHOLDER')}
                                    customInputField={countryInput}
                                    customOption={countryOption}
                                    isDisabled={countryOptions.length < 1}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="line1" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.ADDRESS1')}
                                </label>
                                <TextField
                                    name="line1"
                                    id="line1"
                                    placeholder={t('ACCOUNT.NEW_CARD.ADDRESS1_PLACEHOLDER')}
                                    withoutErr={formik.errors.line1 && formik.touched.line1 ? false : true}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="line2" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.ADDRESS2')}
                                </label>
                                <TextField name="line2" id="line2" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS2_PLACEHOLDER')} />
                            </div>
                            <div className="field">
                                <label htmlFor="cardNumber" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.CARD_NUMBER')}
                                </label>
                                <TextField
                                    type="number"
                                    name="cardNumber"
                                    id="cardNumber"
                                    placeholder={t('ACCOUNT.NEW_CARD.CARD_NUMBER_PLACEHOLDER')}
                                />
                            </div>
                            <div className="field field__file">
                                <div className="flex">
                                    <div className="field w--100 mr-6">
                                        <label htmlFor="expiryDate" className="field__label">
                                            {t('ACCOUNT.NEW_CARD.EXPIRY')}
                                        </label>
                                        <TextField
                                            type="text"
                                            name="expiryDate"
                                            id="expiryDate"
                                            placeholder={t('ACCOUNT.NEW_CARD.EXPIRY_PLACEHOLDER')}
                                            mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                                        />
                                    </div>

                                    <div className="field w--100">
                                        <label htmlFor="cvv" className="field__label">
                                            {t('ACCOUNT.NEW_CARD.CVV')}
                                        </label>
                                        <TextField
                                            max={3}
                                            maxLength={3}
                                            type="number"
                                            name="cvv"
                                            id="cvv"
                                            placeholder={t('ACCOUNT.NEW_CARD.CVV_PLACEHOLDER')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="zipCode" className="field__label">
                                    {t('ACCOUNT.NEW_CARD.ZIP')}
                                </label>
                                <TextField type="number" name="zipCode" id="zipCode" placeholder={t('ACCOUNT.NEW_CARD.ZIP_PLACEHOLDER')} />
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--clear type--wgt--bold" onClick={() => formik.handleSubmit()}>
                            {t('ACCOUNT.NEW_CARD.ADD_BUTTON')}
                        </button>
                        <button onClick={() => closeSidebar()} className="btn btn--clear type--color--error type--wgt--bold">
                            {t('ACCOUNT.NEW_CARD.CANCEL_BUTTON')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCreditCard;
