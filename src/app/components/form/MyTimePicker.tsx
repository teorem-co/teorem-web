import { FieldProps, useField } from 'formik';
import moment, { Moment } from 'moment';
import TimePicker from 'rc-time-picker';

interface CustomTimePickerProps extends FieldProps {
    isMulti?: boolean;
    closeMenuOnSelect?: boolean;
    placeholder?: string;
    isDisabled?: boolean;
    menuIsOpen?: boolean;
    className?: string;
    onChangeCustom?: (e: any) => void;
    isLoading?: boolean;
    classNamePrefix?: string;
    customInputField?: (props: any) => JSX.Element;
    customOption?: (props: any) => JSX.Element;
    noOptionsMessage?: () => string;
    withoutErr?: boolean;
    defaultValue: Moment;
}

const MyTimePicker = ({ field, form, placeholder, className, withoutErr, defaultValue, isDisabled, onChangeCustom }: CustomTimePickerProps) => {
    const [formikField, meta] = useField(form.getFieldProps(field.name));

    const onChange = (option: any) => {
        option.preventDefault();
        form.setFieldValue(field.name, moment(option._d).format('HH:mm'));
    };

    return (
        <>
            <TimePicker
                className={className ?? 'form__type'}
                name={field.name}
                onChange={(e) => onChange(e)}
                placeholder={placeholder}
                defaultValue={moment(defaultValue)}
                minuteStep={15}
                showSecond={false}
                disabled={isDisabled ? isDisabled : false}
                onClose={onChangeCustom}
            />
            {withoutErr ? <></> : <div className="field__validation">{meta.error && meta.touched ? meta.error : ''}</div>}
        </>
    );
};

export default MyTimePicker;
