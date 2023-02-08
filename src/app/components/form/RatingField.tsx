import { FieldProps, useField } from 'formik';
import React, { useEffect, useState } from 'react';

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

    useEffect(() => {
        //remove validation if rating changes
        props.form.setFieldTouched(field.name);
    }, [ratingClass]);

    return (
        <>
            <div>
                <svg
                    width="254"
                    viewBox="0 0 152 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${ratingClass}`}
                >
                    <path
                        className="cur--pointer"
                        onClick={() => onChangeRating('1')}
                        fill="#ededed"
                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                    />
                    <path
                        className="cur--pointer"
                        onClick={() => onChangeRating('2')}
                        fill="#ededed"
                        d="M44 17.27L50.18 21L48.54 13.97L54 9.24L46.81 8.63L44 2L41.19 8.63L34 9.24L39.46 13.97L37.82 21L44 17.27Z"
                    />
                    <path
                        className="cur--pointer"
                        onClick={() => onChangeRating('3')}
                        fill="#ededed"
                        d="M76 17.27L82.18 21L80.54 13.97L86 9.24L78.81 8.63L76 2L73.19 8.63L66 9.24L71.46 13.97L69.82 21L76 17.27Z"
                    />
                    <path
                        className="cur--pointer"
                        onClick={() => onChangeRating('4')}
                        fill="#ededed"
                        d="M108 17.27L114.18 21L112.54 13.97L118 9.24L110.81 8.63L108 2L105.19 8.63L98 9.24L103.46 13.97L101.82 21L108 17.27Z"
                    />
                    <path
                        className="cur--pointer"
                        onClick={() => onChangeRating('5')}
                        fill="#ededed"
                        d="M140 17.27L146.18 21L144.54 13.97L150 9.24L142.81 8.63L140 2L137.19 8.63L130 9.24L135.46 13.97L133.82 21L140 17.27Z"
                    />
                </svg>
            </div>

            <div className="field__validation">
                {errorText ? errorText : ''}
            </div>
        </>
    );
};

export default RatingField;
