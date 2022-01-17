import { FieldAttributes, useField } from 'formik';
import { FC } from 'react';

type TextFieldType = {
    className?: string;
    inputType?: string;
} & FieldAttributes<{}>;

const MyTextField: FC<TextFieldType> = (props: any) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    return (
        <>
            <input
                type={props.inputType ?? ''}
                {...field}
                {...props}
                className={`${
                    props.className ?? 'input input--base input--text'
                }`}
            />
            <div className="field__validation">
                {errorText ? errorText : ''}
            </div>
        </>
    );
};

export default MyTextField;
