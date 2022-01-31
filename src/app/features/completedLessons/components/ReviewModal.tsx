import { Form, FormikProvider, useFormik } from 'formik';
import { FC, useState } from 'react';
import * as Yup from 'yup';

import TextArea from '../../../components/form/MyTextArea';
import TextField from '../../../components/form/TextField';

interface Props {
    tutorId: string;
    handleClose: () => void;
}

interface InitialValues {
    title: string;
    rating: number;
    review: string;
}

const ReviewModal: FC<Props> = (props: Props) => {
    const { tutorId, handleClose } = props;

    const [initialValues, setInitialValues] = useState<InitialValues>({
        title: '',
        rating: 0,
        review: '',
    });

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            title: Yup.string().required('required'),
            rating: Yup.string().required('required'),
            review: Yup.string().required('required'),
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
                            Write a review
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
                                        Title*
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
                                        Rating*
                                    </label>
                                    <TextField
                                        name="rating"
                                        id="rating"
                                        placeholder="rating"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        htmlFor="review"
                                        className="field__label"
                                    >
                                        Review*
                                    </label>
                                    <TextArea
                                        name="review"
                                        id="review"
                                        placeholder="Describe your overall expirience with this lesson"
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
                            Post
                        </button>
                        <button
                            onClick={handleClose}
                            className="btn btn--base btn--clear w--100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewModal;
