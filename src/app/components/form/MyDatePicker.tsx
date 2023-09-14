import { FieldProps, useField } from 'formik';
import DatePicker from 'react-date-picker';

interface CustomSelectProps extends FieldProps {
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  isLoading?: boolean;
  classNamePrefix?: string;
}

const MyDatePicker = ({ field, form }: CustomSelectProps) => {
  const [formikField, meta] = useField(form.getFieldProps(field.name));
  const errorText = meta.error && meta.touched ? meta.error : '';

  const onChange = (date: any) => {
    form.setFieldValue(field.name, date);
  };

  return (
    <>
      <div className="date-picker-container">
        <DatePicker
        {...field}
        onChange={(value: any) => onChange(value ?? '')}
        name={field.name}
        dayPlaceholder="DD"
        monthPlaceholder="MM"
        yearPlaceholder="YYYY"
        calendarClassName={'onboarding-calendar'}
        clearIcon={null}
        format="d/M/y"
        openCalendarOnFocus={false}
        minDate={new Date(1900, 0, 1)}
        onCalendarClose={() => form.setFieldTouched(field.name)}
        className="bg__white date-picker-container"
      />

      <div className="field__validation">{errorText ? errorText : ''}</div>
      </div>
    </>
  );
};

export default MyDatePicker;
