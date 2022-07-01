import { FieldAttributes, useField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import MaskedInput from 'react-text-mask';

type TextFieldType = {
    min?: number;
    password?: boolean;
    className?: string;
    wrapperClassName?: string;
    withoutErr?: boolean;
    additionalValidation?: string;
    mask?: any[];
} & FieldAttributes<{}>;

//const TextField: React.FC<TextFieldType> = ( { type, placeholder, id, disabled, min, onChange, ...props } ) =>
const TextField: React.FC<TextFieldType> = (props: any) => {
    const { password, additionalValidation, maxLength } = props;
    const [field, meta] = useField(props);
    const [characterCount, setCharacterCount] = useState<number>(0);
    const textInputRef = useRef<HTMLTextAreaElement>(null);
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

    useEffect(() => {
        if (textInputRef.current) {
            const textInputElement = textInputRef.current as HTMLTextAreaElement;
            setCharacterCount(textInputElement.value.length);
        }
    }, [field.value]);

    const handleCharacterCount = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.currentTarget.textContent) {
            const textareaLength = e.currentTarget.textContent.length;
            setCharacterCount(textareaLength);
        }
    };
    return (
        <>
            <div className={`pos--rel ${props.wrapperClassName}`}>
                {props.mask ? (
                    <MaskedInput
                        type={props.text}
                        id={props.id}
                        placeholder={props.placeholder}
                        mask={props.mask}
                        keepCharPositions={true}
                        guide={false}
                        {...field}
                        {...props}
                        className={`${props.className ?? 'input input--base input--text'} ${errorText ? 'input__border--error' : ''}`}
                    />
                ) : (
                    <input
                        ref={textInputRef}
                        onKeyUp={(e) => handleCharacterCount(e)}
                        type={`${password ? 'password' : 'text'}`}
                        {...field}
                        {...props}
                        className={`${props.className ?? 'input input--base input--text'} ${errorText ? 'input__border--error' : ''}`}
                    />
                )}
                {maxLength && (
                    <div className="input--textarea__counter">
                        {characterCount}/{maxLength}
                    </div>
                )}
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
