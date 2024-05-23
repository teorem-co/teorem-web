import { FieldProps, useField } from 'formik';
import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';

interface IRatingField extends FieldProps {
    className?: string;
}

const RatingField: React.FC<IRatingField> = (props: IRatingField) => {
    const [field, meta] = useField(props.field);
    const [ratingClass, setRatingClass] = useState<string>('');

    const errorText = meta.error && meta.touched ? meta.error : '';

    const onChangeRating = (rating: string) => {
        const currentRatingClass = 'star--' + rating;
        setRatingClass(currentRatingClass);
        props.form.setFieldValue(props.field.name, rating);
    };

    const handleRating = (rate: number) => {
        onChangeRating(rate.toString());
        // other logic
    };

    useEffect(() => {
        //remove validation if rating changes
        props.form.setFieldTouched(field.name);
    }, [ratingClass]);

    return (
        <div className={'flex flex--col'}>
            <div className={'flex flex--col'}>
                <Rating onClick={handleRating} fillColor={'black'} size={20} />
            </div>

            {/*<div className="field__validation">{errorText ? errorText : ''}</div>*/}
        </div>
    );
};

export default RatingField;
