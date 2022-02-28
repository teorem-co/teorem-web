import { FieldAttributes, useField } from 'formik';
import React from 'react';

type TextFieldType = {
    min?: number;
    password?: boolean;
    className?: string;
    wrapperClassName?: string;
    withoutErr?: boolean;
    additionalValidation?: string;
} & FieldAttributes<{}>;

//const TextField: React.FC<TextFieldType> = ( { type, placeholder, id, disabled, min, onChange, ...props } ) =>
const TextField: React.FC<TextFieldType> = (props: any) => {
    const { password, additionalValidation } = props;
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const visiblePassToggle = (e: any) => {
        const currentInput = e.target.parentNode.childNodes[0];

        e.target && currentInput.type === 'password' ? (currentInput.type = 'text') : (currentInput.type = 'password');
    };

    const displayValidationMessage = () => {
        if (additionalValidation) {
            return errorText || additionalValidation;
        }
        return errorText;
    };

    return (
        <>
            <div className={`pos--rel ${props.wrapperClassName}`}>
                <input
                    type={`${password ? 'password' : 'text'}`}
                    {...field}
                    {...props}
                    className={`${props.className ?? 'input input--base input--text'} ${errorText ? 'input__border--error' : ''}`}
                />
                {
                    /* toggle password visibility */
                    props.password ? (
                        <i className="icon icon--sm icon--visible input--text--password" onClick={(e: any) => visiblePassToggle(e)}></i>
                    ) : (
                        ''
                    )
                }
            </div>
            {props.withoutErr ? <></> : <div className="field__validation">{displayValidationMessage()}</div>}
        </>
    );
};

export default TextField;
