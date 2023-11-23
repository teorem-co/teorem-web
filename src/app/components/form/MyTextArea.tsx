import { FieldAttributes, useField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {t} from "i18next";

type TextFieldType = {
    min?: number;
    password?: boolean;
    className?: string;
} & FieldAttributes<{}>;

//const MyTextField: React.FC<TextFieldType> = ( { type, placeholder, id, disabled, min, onChange, ...props } ) =>
const TextArea: React.FC<TextFieldType> = (props: any) => {
    const { password, maxLength, minLength } = props;
    const [field, meta] = useField(props);
    const [characterCount, setCharacterCount] = useState<number>(0);
    const [tooLong, setTooLong] = useState(false);
    const [tooShort, setTooShort] = useState(false);
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
            const numOfWords = e.currentTarget.textContent.trim().split(" ").length;
            if(numOfWords >= 50) {
              setTooShort(false);
            } else {
              setTooShort(true);
            }
        }
        if(characterCount >= maxLength) {
          setTooLong(true);
        } else {
          setTooLong(false);
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
              {!errorText && tooLong ? t('FORM_VALIDATION.MAX_LIMIT') + " " + maxLength : ''}
              {!errorText && minLength && tooShort ? t('FORM_VALIDATION.MIN_LIMIT') + " " + minLength : ''}
            </div>
        </>
    );
};

export default TextArea;
