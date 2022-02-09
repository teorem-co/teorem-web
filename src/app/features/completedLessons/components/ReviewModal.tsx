import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { FC, useState } from 'react';
import * as Yup from 'yup';

import TextArea from '../../../components/form/MyTextArea';
import RatingField from '../../../components/form/RatingField';
import TextField from '../../../components/form/TextField';

interface Props {
    tutorId: string;
    handleClose: () => void;
}

interface InitialValues {
    title: string;
    rating: string;
    review: string;
}

const ReviewModal: FC<Props> = (props: Props) => {
    const { tutorId, handleClose } = props;

    const [initialValues, setInitialValues] = useState<InitialValues>({
        title: '',
        rating: '',
        review: '',
    });

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            title: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            rating: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            review: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: InitialValues) => {
        alert(JSON.stringify(values, null, 2));
    };

    return (
        <>
            <div className="modal__overlay">
                <div className="modal">
                    <div className="modal__head">
                        <div className="type--md type--wgt--bold">
                            {t('WRITE_REVIEW.SECTION_TITLE')}
                        </div>
                        <div className="type--color--secondary">
                            Maria Diaz, Mathematics, A level
                        </div>
                        <i
                            onClick={handleClose}
                            className="modal__close icon icon--base icon--close icon--grey"
                        ></i>
                    </div>
                    <div className="modal__separator"></div>
                    <div className="modal__body">
                        <FormikProvider value={formik}>
                            <Form id="review-form">
                                <div className="field">
                                    <label
                                        htmlFor="title"
                                        className="field__label"
                                    >
                                        {t('WRITE_REVIEW.TITLE')}*
                                    </label>
                                    <TextField
                                        name="title"
                                        id="title"
                                        placeholder="Write title of your review"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        htmlFor="rating"
                                        className="field__label"
                                    >
                                        {t('WRITE_REVIEW.RATING')}*
                                    </label>
                                    <RatingField
                                        form={formik}
                                        field={formik.getFieldProps('rating')}
                                        meta={formik.getFieldMeta('rating')}
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        htmlFor="review"
                                        className="field__label"
                                    >
                                        {t('WRITE_REVIEW.REVIEW')}*
                                    </label>
                                    <TextArea
                                        name="review"
                                        id="review"
                                        placeholder="Describe your overall expirience with this lesson"
                                        maxLength={2500}
                                    />
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="modal__footer">
                        <button
                            form="review-form"
                            type="submit"
                            className="btn btn--base btn--primary w--100 mb-4"
                        >
                            {t('WRITE_REVIEW.SUBMIT')}
                        </button>
                        <button
                            onClick={handleClose}
                            className="btn btn--base btn--clear w--100"
                        >
                            {t('WRITE_REVIEW.CANCEL')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewModal;
