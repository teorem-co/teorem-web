import { FieldProps, useField } from 'formik';
import Select, { components } from 'react-select';
import { PROFILE_PATHS } from '../../routes';
import { t } from 'i18next';

export interface OptionType {
    label: string;
    value: string;
    icon?: string;
}

export interface PhoneOptionType {
    label: string;
    prefix: string;
    value: string;
    icon?: string;
}

interface CustomSelectProps extends FieldProps {
    options: any;
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
    isSearchable?: boolean;
    withoutErr?: boolean;
    customValue?: string;
    positionFixed?: boolean;
}

const MySelect = ({
    field,
    form,
    options,
    isMulti = false,
    closeMenuOnSelect,
    placeholder,
    isDisabled,
    className,
    onChangeCustom,
    isLoading,
    customInputField,
    classNamePrefix,
    noOptionsMessage,
    customOption,
    menuIsOpen,
    isSearchable,
    withoutErr,
    customValue,
    positionFixed,
}: CustomSelectProps) => {
    const [formikField, meta] = useField(form.getFieldProps(field.name));

    const onChange = (option: any) => {
        form.setFieldValue(
            field.name,
            isMulti ? (option ? option.map((item: OptionType | PhoneOptionType) => item.value) : '') : (option as OptionType | PhoneOptionType).value
        );

        isMulti
            ? onChangeCustom && onChangeCustom(option && option.map((item: OptionType | PhoneOptionType) => item.value))
            : onChangeCustom && onChangeCustom((option as OptionType | PhoneOptionType).value);
    };

    const getValue = () => {
        if (options && field.value) {
            return isMulti
                ? options.filter((option: any) => field.value.indexOf(option.value) >= 0)
                : options.find((option: any) => option.value === (typeof field.value !== 'string' ? field.value.toString() : field.value));
        } else {
            return isMulti ? [] : ('' as any);
        }
    };

    const customSingleValue = (props: any) => {
        if (props.data.icon) {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span className="input-select__icon">
                            <img src={props.data.icon} alt="item icon" />
                        </span>
                        <span>{props.data.label}</span>
                    </div>
                </components.SingleValue>
            );
        } else {
            return (
                <components.SingleValue {...props} className="input-select">
                    <div className="input-select__option">
                        <span>{props.data.label}</span>
                    </div>
                </components.SingleValue>
            );
        }
    };

    const customOptions = (props: any) => {
        const { innerProps } = props;
        if (props.data.icon) {
            return (
                <components.Option {...innerProps} {...props}>
                    {' '}
                    <div className="input-select">
                        <div className="input-select__option">
                            <span className="input-select__icon">
                                <img src={props.data.icon} alt="item icon" />
                            </span>
                            <span>{props.data.label}</span>
                        </div>
                    </div>
                </components.Option>
            );
        } else {
            return (
                <components.Option {...props} className="input-select">
                    <div className="input-select__option">
                        <span>{props.data.label}</span>
                    </div>
                </components.Option>
            );
        }
    };

    return (
        <>
            <Select
                className={className ?? 'form__type'}
                classNamePrefix={classNamePrefix}
                components={{
                    SingleValue: customInputField ? customInputField : customSingleValue,
                    Option: customOption ? customOption : customOptions,
                }}
                name={field.name}
                value={getValue() ? getValue() : customValue}
                onChange={onChange}
                options={options}
                isMulti={isMulti}
                menuIsOpen={menuIsOpen}
                onBlur={() => form.setFieldTouched(field.name)}
                placeholder={placeholder}
                closeMenuOnSelect={closeMenuOnSelect}
                isDisabled={isDisabled}
                menuPosition={positionFixed ? 'fixed' : 'absolute'}
                isLoading={isLoading}
                noOptionsMessage={() => {
                    if (noOptionsMessage?.toString().includes('childless', 6)) {
                        return (
                            <div>
                                {t('FORM_VALIDATION.CHILDLESS_CALENDAR_1')}
                                <a href={PROFILE_PATHS.MY_PROFILE_CHILD_INFO}> {t('FORM_VALIDATION.CHILDLESS_CALENDAR_2')}</a>.
                            </div>
                        );
                    }
                }}
                isSearchable={isSearchable}
            />
            {withoutErr ? <></> : <div className="field__validation">{meta.error && meta.touched ? meta.error : ''}</div>}
        </>
    );
};

export default MySelect;
