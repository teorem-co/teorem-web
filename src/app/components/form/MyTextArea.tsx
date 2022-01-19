import { FieldAttributes, useField } from 'formik';
import React from 'react';

type TextFieldType = {
    min?: number;
    password?: boolean;
    className?: string;
} & FieldAttributes<{}>;

//const TextField: React.FC<TextFieldType> = ( { type, placeholder, id, disabled, min, onChange, ...props } ) =>
const TextArea: React.FC<TextFieldType> = (props: any) => {
    const { password } = props;
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const visiblePassToggle = (e: any) => {
        const currentInput = e.target.parentNode.childNodes[0];

        e.target && currentInput.type === 'password'
            ? (currentInput.type = 'text')
            : (currentInput.type = 'password');
    };

    return (
        <>
            <div className="pos--rel">
                <textarea
                    type={`${password ? 'password' : 'textarea'}`}
                    {...field}
                    {...props}
                    className={`${
                        props.className ??
                        'input input--base input--text input--textarea'
                    } ${errorText ? 'input__border--error' : ''}`}
                />
                {
                    /* toggle password visibility */
                    props.password ? (
                        <i
                            className="icon icon--sm icon--visible input--text--password"
                            onClick={(e: any) => visiblePassToggle(e)}
                        ></i>
                    ) : (
                        ''
                    )
                }
            </div>

            <div className="field__validation">
                {errorText ? errorText : ''}
            </div>
        </>
    );
};

export default TextArea;
