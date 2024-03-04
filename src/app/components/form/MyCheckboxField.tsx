import { FieldAttributes, useField } from 'formik';

type TextFieldType = {
    labelText: string;
} & FieldAttributes<{}>;

const MyCheckboxField: React.FC<TextFieldType> = (props: any) => {
    const [field] = useField(props);

    return (
        <div>
            <input type="checkbox" className="input input--checkbox" id={props.name} {...field} {...props} checked={field.value} />
            <label className="input--checkbox__label" htmlFor={props.name}>
                {props.labelText}
            </label>
        </div>
    );
};

export default MyCheckboxField;
