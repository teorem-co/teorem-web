import { kMaxLength } from 'buffer';
import { FieldAttributes, useField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';

type TextFieldType = {
    min?: number;
    password?: boolean;
    className?: string;
} & FieldAttributes<{}>;

//const TextField: React.FC<TextFieldType> = ( { type, placeholder, id, disabled, min, onChange, ...props } ) =>
const TextArea: React.FC<TextFieldType> = (props: any) => {
    const { password, maxLength } = props;
    const [field, meta] = useField(props);
    const [characterCount, setCharacterCount] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const visiblePassToggle = (e: any) => {
        const currentInput = e.target.parentNode.childNodes[0];

        e.target && currentInput.type === 'password'
            ? (currentInput.type = 'text')
            : (currentInput.type = 'password');
    };

    useEffect(() => {
        if (textareaRef.current) {
            const textareaElement = textareaRef.current as HTMLTextAreaElement;
            setCharacterCount(textareaElement.value.length);
        }
    }, [field.value]);

    const handleCharacterCount = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.currentTarget.textContent) {
            const textareaLength = e.currentTarget.textContent.length;
            setCharacterCount(textareaLength);
        }
    };
    
    return (
        <>
            <div className="pos--rel">
                <textarea
                    ref={textareaRef}
                    type={`${password ? 'password' : 'textarea'}`}
                    {...field}
                    {...props}
                    onKeyUp={(e) => handleCharacterCount(e)}
                    className={`${
                        props.className ??
                        'input input--base input--text input--textarea'
                    } ${errorText ? 'input__border--error' : ''}`}
                />
                <div className="input--textarea__counter">
                    {characterCount}/{maxLength}
                </div>
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
