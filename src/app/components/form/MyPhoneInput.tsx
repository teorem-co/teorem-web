import { FieldProps, useField } from 'formik';
import { FC, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useLazyGetCountriesQuery } from '../../store/services/countryService';
import { ONBOARDING_PATHS, PATHS } from '../../routes';
import 'react-phone-input-2/lib/material.css';
import { t } from 'i18next';

interface TextFieldType extends FieldProps {
    className?: string;
    inputType?: string;
    name: string;
    disabled?: boolean;
    openTooltip?: () => void;
    countryId?: string | null;
}

const MyPhoneInput: FC<TextFieldType> = (props: any) => {
    const { form, className, name, countryId } = props;
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const currentValue = form.values.phoneNumber;

    const [getCountries] = useLazyGetCountriesQuery();
    const [country, setCountry] = useState('hr');

    const updateCountry = async () => {
        const res = await getCountries().unwrap();
        res.forEach((country) => {
            if (country.id === countryId) setCountry(country.abrv.toLowerCase());
        });
    };

    useEffect(() => {
        const selectedFlag = document.getElementsByClassName('selected-flag');
        for (let i = 0; i < selectedFlag.length; i++) {
            const element = selectedFlag[i] as HTMLElement;
            element.tabIndex = -1;
        }
    });

    useEffect(() => {
        if (countryId) updateCountry();
    }, [countryId]);

    useEffect(() => {
        window && window.location.pathname === ONBOARDING_PATHS.ONBOARDING && updateCountry();
    }, [form.values.countryId]);

    // set font size based on device
    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? 'small' : 'medium';

    return (
        <>
            <PhoneInput
                {...field}
                {...props}
                specialLabel={t('REGISTER.FORM.PHONE_NUMBER')}
                name={name}
                country={country}
                value={currentValue}
                className={`${className ?? 'input--text'}`}
                onChange={(phone) => {
                    form.setFieldValue('phoneNumber', phone);
                    // form.setFieldTouched('phoneNumber', true, false);
                    // form.validateField('phoneNumber');
                }}
                onBlur={() => form.setFieldTouched(field.name)}
                disabled={props.disabled}
                onClick={() => {
                    if (props.openTooltip) props.openTooltip();
                }}
                inputStyle={{ width: '100%' }}
                searchStyle={{ fontSize: fontSize }}
                dropdownStyle={{ fontSize: fontSize, textAlign: 'left' }}
                // containerStyle={{textAlign:'left'}}
            />
            <div className="field__validation">{errorText}</div>
        </>
    );
};

export default MyPhoneInput;
