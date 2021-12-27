import { useField } from 'formik';

const RRInput = ({ ...props }) => {
    const [field, meta] = useField(props.name);
    return (
        <>
            <input {...field} {...props} className={`${props.className} ${meta.touched && meta.error ? 'validate' : ''}`} />
            {meta.touched && meta.error ? (
                <div className="field__validation">{meta.error}</div>
            ) : null}
        </>
    )
};

export default RRInput;