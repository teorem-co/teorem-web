import React, { useEffect, useState } from 'react';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { TextField } from '@mui/material';
import { t } from 'i18next';
import green_check from '../../assets/icons/green-check.svg';
import { BookingChatMessageDTO, useSendBookingInfoMessageMutation } from '../features/chat/services/chatService';
import { ButtonPrimaryGradient } from './ButtonPrimaryGradient';

interface BookingInfoForm {
    curriculum: string;
    textbook: string;
    grade: string;
    notes: string;
}

interface Props {
    setShowPopup: (value: boolean) => void;
    tutorId: string;
    startTime: string;
    subjectId: string;
    levelId: string;
}

export const BookingPopupForm = (props: Props) => {
    const [sendBookingChatInfoMessage] = useSendBookingInfoMessageMutation();
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

    const initialValues: BookingInfoForm = {
        curriculum: '',
        textbook: '',
        grade: '',
        notes: '',
    };

    function handleSubmit(values: BookingInfoForm) {
        const toSend: BookingChatMessageDTO = {
            defaultMessage: false,
            tutorId: props.tutorId,
            startTime: props.startTime,
            subjectId: props.subjectId,
            levelId: props.levelId,

            curriculum: values.curriculum.trim(),
            textbook: values.textbook.trim(),
            grade: values.grade.trim(),
            notes: values.notes.trim(),
        };

        sendBookingChatInfoMessage(toSend);
        props.setShowPopup(false);
    }

    function handleSkip() {
        const toSend: BookingChatMessageDTO = {
            defaultMessage: true,
            tutorId: props.tutorId,
            startTime: props.startTime,
            subjectId: props.subjectId,
            levelId: props.levelId,
        };

        sendBookingChatInfoMessage(toSend);
        props.setShowPopup(false);
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
    });

    useEffect(() => {
        //check if any of the values are empty
        if (
            formik.values.grade.trim().length == 0 || //todo check if we want this to be mandatory
            formik.values.textbook.trim().length == 0 ||
            formik.values.curriculum.trim().length == 0
        ) {
            setSubmitButtonDisabled(true);
        } else {
            setSubmitButtonDisabled(false);
        }
    }, [formik.values]);
    return (
        <div className="modal__overlay">
            <div className="flex flex--col text-align--center flex--gap-20  p-6 pb-1 w--350 bg__white modal--parent success-modal-animation">
                <div className="leading-content">
                    {/*ICON*/}
                    <img src={green_check} alt="#" />
                    <div className="div">
                        <h3 className="mb-2 font__lg">{t('BOOKING_POPUP.TITLE')}</h3>
                        <p className="type--color--secondary">{t('BOOKING_POPUP.DESCRIPTION')}</p>
                    </div>
                </div>

                <FormikProvider value={formik}>
                    <Form className="flex--gap-20 flex flex--col w--100">
                        <Field
                            as={TextField}
                            name="curriculum"
                            type="text"
                            fullWidth
                            error={formik.touched.curriculum && !!formik.errors.curriculum}
                            helperText={formik.touched.curriculum && formik.errors.curriculum}
                            id="curriculum"
                            label={t('BOOKING_POPUP.CURRICULUM_PLACEHOLDER')}
                            variant="outlined"
                            color="secondary"
                            InputProps={{
                                style: {
                                    textAlign: 'end',
                                    fontFamily: "'Lato', sans-serif",
                                    backgroundColor: 'white',
                                    fontSize: '0.8rem',
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: '0.8rem',
                                },
                            }}
                            FormHelperTextProps={{
                                style: { color: 'red' }, // Change the color of the helper text here
                            }}
                            inputProps={{
                                maxLength: 100,
                            }}
                            onBlur={(e: any) => {
                                formik.handleBlur(e);
                            }}
                        />

                        <Field
                            as={TextField}
                            name="textbook"
                            type="text"
                            fullWidth
                            error={formik.touched.textbook && !!formik.errors.textbook}
                            helperText={formik.touched.textbook && formik.errors.textbook}
                            id="textbook"
                            label={t('BOOKING_POPUP.TEXTBOOK_PLACEHOLDER')}
                            variant="outlined"
                            color="secondary"
                            InputProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    backgroundColor: 'white',
                                    fontSize: '0.8rem',
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: '0.8rem',
                                },
                            }}
                            FormHelperTextProps={{
                                style: { color: 'red' }, // Change the color of the helper text here
                            }}
                            inputProps={{
                                maxLength: 100,
                            }}
                            onBlur={(e: any) => {
                                formik.handleBlur(e);
                            }}
                        />

                        <Field
                            as={TextField}
                            name="grade"
                            type="text"
                            fullWidth
                            error={formik.touched.grade && !!formik.errors.grade}
                            helperText={formik.touched.grade && formik.errors.grade}
                            id="grade"
                            label={t('BOOKING_POPUP.GRADE_PLACEHOLDER')}
                            variant="outlined"
                            color="secondary"
                            InputProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    backgroundColor: 'white',
                                    fontSize: '0.8rem',
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: '0.8rem',
                                },
                            }}
                            FormHelperTextProps={{
                                style: { color: 'red' }, // Change the color of the helper text here
                            }}
                            inputProps={{
                                maxLength: 100,
                            }}
                            onBlur={(e: any) => {
                                formik.handleBlur(e);
                            }}
                        />

                        <Field
                            as={TextField}
                            name="notes"
                            type="text"
                            fullWidth
                            error={formik.touched.notes && !!formik.errors.notes}
                            helperText={formik.touched.notes && formik.errors.notes}
                            id="notes"
                            label={t('BOOKING_POPUP.NOTES_PLACEHOLDER')}
                            variant="outlined"
                            color="secondary"
                            InputProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    backgroundColor: 'white',
                                    fontSize: '0.8rem',
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: '0.8rem',
                                },
                            }}
                            FormHelperTextProps={{
                                style: { color: 'red' }, // Change the color of the helper text here
                            }}
                            inputProps={{
                                maxLength: 100,
                            }}
                            onBlur={(e: any) => {
                                formik.handleBlur(e);
                            }}
                        />

                        <div className="div-3">
                            <ButtonPrimaryGradient disabled={submitButtonDisabled} className="btn btn--lg w--100 p-2" type={'submit'}>
                                {t('BOOKING_POPUP.BUTTON.COMPLETE')}
                            </ButtonPrimaryGradient>
                            <button className={'btn btn--sm btn--tertiary mb-1'} onClick={handleSkip} type={'button'}>
                                {t('BOOKING_POPUP.BUTTON.SKIP')}
                            </button>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
        </div>
    );
};
