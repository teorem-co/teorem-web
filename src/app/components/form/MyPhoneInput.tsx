import { FieldProps, useField } from 'formik';
import { FC, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';

import { useLazyGetCountriesQuery } from '../../features/onboarding/services/countryService';
import { PATHS } from '../../routes';

interface TextFieldType extends FieldProps {
    className?: string;
    inputType?: string;
    name: string;
    disabled?: boolean;
    openTooltip?: () => void;
}

const MyPhoneInput: FC<TextFieldType> = (props: any) => {
    const { form, className, name } = props;
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const currentValue = form.values.phoneNumber;

    const [getCountries] = useLazyGetCountriesQuery();
    const [country, setCountry] = useState('pl');

    const updateCountry = async () => {
        const res = await getCountries().unwrap();
        res.forEach(country => {
            country.id === form.values.countryId &&
                setCountry((country.abrv.toLowerCase()));
        });
    };

    useEffect(()=>{
        window && window.location.pathname === PATHS.ONBOARDING && updateCountry();
    }, [form.values.countryId]);

    return (
        <>
            <PhoneInput
                {...field}
                {...props}
                name={name}
                country={country}
                value={currentValue}
                className={`${className ?? 'input input--base input--text'}`}
                onChange={(phone) => form.setFieldValue('phoneNumber', phone)}
                onBlur={() => form.setFieldTouched(field.name)}
                disabled={props.disabled}
                onClick={() => props.openTooltip()}
            />
            <div className="field__validation">{errorText}</div>
        </>
    );
};

export default MyPhoneInput;
