import { FieldProps, useField } from 'formik';
import { FC } from 'react';
import PhoneInput from 'react-phone-input-2';

interface TextFieldType extends FieldProps {
    className?: string;
    inputType?: string;
    name: string;
}

const MyPhoneInput: FC<TextFieldType> = (props: any) => {
    const { form, className, name } = props;
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const currentValue = form.values.phoneNumber;

    return (
        <>
            <PhoneInput
                {...field}
                {...props}
                name={name}
                country={'pl'}
                value={currentValue}
                className={`${className ?? 'input input--base input--text'}`}
                onChange={(phone) => form.setFieldValue('phoneNumber', phone)}
                onBlur={() => form.setFieldTouched(field.name)}
            />
            <div className="field__validation">{errorText}</div>
        </>
    );
};

export default MyPhoneInput;
