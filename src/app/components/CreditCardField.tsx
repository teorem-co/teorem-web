import { FieldAttributes, useField } from 'formik';
import React, { useRef } from 'react';

type TextFieldType = {
    className?: string;
    wrapperClassName?: string;
} & FieldAttributes<{}>;

//const MyTextField: React.FC<TextFieldType> = ( { type, placeholder, id, disabled, min, onChange, ...props } ) =>
const CreditCardfield: React.FC<TextFieldType> = (props: any) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFormat = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        const currentTarget = inputRef.current as HTMLInputElement;
        if (String.fromCharCode(e.which ? e.which : e.keyCode).match(/[^0-9]/g)) {
            e.currentTarget.value = '';
        } else {
            const formatedString = currentValue + '-';

            if (currentValue.length === 4) {
                currentTarget.value = formatedString;
            } else if (currentValue.length === 9) {
                currentTarget.value = formatedString;
            } else if (currentValue.length === 14) {
                currentTarget.value = formatedString;
            }
        }
    };

    return (
        <>
            <div className={`pos--rel ${props.wrapperClassName}`}>
                <input
                    maxlength={19}
                    ref={inputRef}
                    onKeyUp={(e) => handleFormat(e)}
                    type={`text`}
                    {...field}
                    {...props}
                    className={`${props.className ?? 'input input--base input--text'} ${errorText ? 'input__border--error' : ''}`}
                />
            </div>
            <div className="field__validation">{errorText ? errorText : ''}</div>
        </>
    );
};

export default CreditCardfield;
