import { FieldProps, useField } from 'formik';
import { components } from 'react-select';
import Select from 'react-select';

export interface OptionType {
    label: string;
    value: string;
    icon?: string;
}

interface CustomSelectProps extends FieldProps {
    options: any;
    isMulti?: boolean;
    closeMenuOnSelect?: boolean;
    placeholder?: string;
    isDisabled?: boolean;
    className?: string;
    onChangeCustom?: (e: any) => void;
    isLoading?: boolean;
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
}: CustomSelectProps) => {
    const [formikField, meta] = useField(form.getFieldProps(field.name));

    const onChange = (option: any) => {
        form.setFieldValue(
            field.name,
            isMulti
                ? option
                    ? option.map((item: OptionType) => item.value)
                    : ''
                : (option as OptionType).value
        );

        isMulti
            ? onChangeCustom &&
              onChangeCustom(
                  option && option.map((item: OptionType) => item.value)
              )
            : onChangeCustom && onChangeCustom((option as OptionType).value);
    };

    const getValue = () => {
        if (options && field.value) {
            return isMulti
                ? options.filter(
                      (option: any) => field.value.indexOf(option.value) >= 0
                  )
                : options.find(
                      (option: any) =>
                          option.value ===
                          (typeof field.value !== 'string'
                              ? field.value.toString()
                              : field.value)
                  );
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

    const customOption = (props: any) => {
        console.log(formikField);
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
                classNamePrefix="react-select--dropdown"
                components={{
                    SingleValue: customSingleValue,
                    Option: customOption,
                }}
                name={field.name}
                value={getValue()}
                onChange={onChange}
                options={options}
                isMulti={isMulti}
                onBlur={() => form.setFieldTouched(field.name)}
                placeholder={placeholder}
                closeMenuOnSelect={closeMenuOnSelect}
                isDisabled={isDisabled}
                isLoading={isLoading}
            />
            <div className="field__validation">
                {meta.error && meta.touched ? meta.error : ''}
            </div>
        </>
    );
};

export default MySelect;
