import { Field, Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import React, { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import Lottie from 'react-lottie-player';
import checkmark from '../../../../assets/animations/checkmark.json';
import RatingField from '../../../components/form/RatingField';
import IAddReview from '../../myReviews/interfaces/IAddReview';
import { IReviewInfo, useAddReviewMutation, useLazyGetReviewInfoQuery } from '../../myReviews/services/myReviewsService';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';
import { useHistory } from 'react-router';
import CustomSubjectList from '../../searchTutors/components/CustomSubjectList';
import { TextField } from '@mui/material';

interface Props {
    id?: string;
    handleClose: () => void;
    onCompletedReview: (lessonId: string) => void;
    bookingId: string;
    fetchCompletedLessons: () => void;
}

interface InitialValues {
    overallMark: string;
    punctualityMark: string;
    knowledgeMark: string;
    communicationMark: string;
    review: string;
}

const ReviewModal: FC<Props> = (props: Props) => {
    const { handleClose, onCompletedReview, bookingId, id, fetchCompletedLessons } = props;

    const history = useHistory();
    const [reviewInfo] = useLazyGetReviewInfoQuery();
    const [infoData, setInfoData] = useState<IReviewInfo | null>();

    const [addNewReview, { data: postResonse, isSuccess }] = useAddReviewMutation();

    const [showThanksText, setShowThanksText] = useState(false);
    const [initialValues, setInitialValues] = useState<InitialValues>({
        overallMark: '',
        punctualityMark: '',
        knowledgeMark: '',
        communicationMark: '',
        review: '',
    });

    useEffect(() => {
        if (bookingId) {
            reviewInfo(bookingId)
                .unwrap()
                .then((res) => {
                    setInfoData(res);
                })
                .catch((err) => {
                    console.log('Error: ', err);
                    handleClose();
                    history.push(t('PATHS.COMPLETED_LESSONS'));
                });
        }
    }, []);

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            overallMark: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            punctualityMark: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            knowledgeMark: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            communicationMark: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            review: Yup.string().required(t('FORM_VALIDATION.REQUIRED')).min(10, t('FORM_VALIDATION.MIN_10_CHARS')),
        }),
    });

    const handleSubmit = async (values: InitialValues) => {
        if (infoData) {
            const toSend: IAddReview = {
                subjectId: infoData.subject.id,
                tutorId: infoData.tutorId,
                studentId: infoData.studentId,
                mark: Number(values.overallMark),
                punctualityMark: Number(values.punctualityMark),
                knowledgeMark: Number(values.knowledgeMark),
                communicationMark: Number(values.communicationMark),
                comment: values.review.trim(),
            };

            if (toSend.comment.length < 10) {
                formik.setErrors({ review: t('FORM_VALIDATION.MIN_10_CHARS') });
                return;
            }
            await addNewReview(toSend).unwrap();
            fetchCompletedLessons();
            if (id) onCompletedReview(id);
        }
    };

    return (
        <>
            <div className="modal__overlay">
                <div className="modal review-modal ">
                    {!isSuccess && (
                        <div className="modal__head flex flex--col flex--center">
                            <i className={'icon icon--xxl icon--review-modal icon--primary cur--default'}></i>
                            <div className="type--md type--wgt--bold">{t('WRITE_REVIEW.SECTION_TITLE')}</div>
                            <p className={'type--center type--base type--color--secondary'}>{t('WRITE_REVIEW.SUBTITLE')}</p>
                        </div>
                    )}
                    {/*<i onClick={closeModal} className="modal__close icon icon--base icon--close icon--grey"></i>*/}

                    {isSuccess && (
                        <div className={'modal__body'}>
                            <>
                                <Lottie
                                    loop={false}
                                    speed={0.7}
                                    animationData={checkmark}
                                    play
                                    onComplete={() => {
                                        setShowThanksText(true);
                                    }}
                                ></Lottie>

                                {showThanksText && <p className={'type--center type--md'}>{t('WRITE_REVIEW.THANKS_MESSAGE')}</p>}
                            </>
                        </div>
                    )}

                    {!isSuccess && (
                        <>
                            <div className={'mt-5 flex flex--row'}>
                                <img
                                    className="mr-3 lessons-list__item__img lessons-list__item__img__search-tutor"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        border: 'none',
                                    }}
                                    src={infoData?.profileImage}
                                    alt=""
                                />

                                <div className="flex flex--row flex--jc--space-between flex--ai--start flex--grow">
                                    {infoData?.listOfSubjects && (
                                        <div className="flex flex--col flex--ai--start">
                                            <h3>{infoData?.tutorName}</h3>
                                            <CustomSubjectList subjects={infoData?.listOfSubjects} />
                                        </div>
                                    )}

                                    {infoData?.averageGrade && infoData?.averageGrade > 0 && infoData.totalNumberOfReviews > 0 ? (
                                        <div className="flex flex--col flex--ai--end">
                                            <div className="flex flex--row flex--ai--center">
                                                <i className="icon icon--sm icon--star cur--default"></i>
                                                <span className={'type--wgt--extra-bold'}>{infoData?.averageGrade.toFixed(1)}</span>
                                            </div>
                                            <span className={'type--sm'}>
                                                {infoData?.totalNumberOfReviews}&nbsp;{t('TUTOR_PROFILE.REVIEWS')}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex--col flex--ai--end">
                                            <div>{t('WRITE_REVIEW.NEW_TUTOR')}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className={'type--center type--color--secondary mb-2 mt-2'}>
                                {t('WRITE_REVIEW.COMPLETED_LESSONS.PART_1') +
                                    ' ' +
                                    infoData?.totalNumberOfLessons +
                                    ' ' +
                                    t('WRITE_REVIEW.COMPLETED_LESSONS.PART_2')}
                            </p>

                            <div className="modal__body flex flex--col flex--jc--space-between">
                                <FormikProvider value={formik}>
                                    <Form id="review-form">
                                        <div className={'ml-2 mr-2'}>
                                            <div className="field flex flex--grow flex--jc--space-between">
                                                <label htmlFor="overallMark" className="field__label type--md">
                                                    {t('WRITE_REVIEW.OVERALL')}*
                                                </label>
                                                <RatingField
                                                    form={formik}
                                                    field={formik.getFieldProps('overallMark')}
                                                    meta={formik.getFieldMeta('overallMark')}
                                                />
                                            </div>
                                            <div className="field flex flex--jc--space-between">
                                                <label htmlFor="punctualityMark" className="field__label">
                                                    {t('WRITE_REVIEW.PUNCTUALITY')}*
                                                </label>
                                                <RatingField
                                                    form={formik}
                                                    field={formik.getFieldProps('punctualityMark')}
                                                    meta={formik.getFieldMeta('punctualityMark')}
                                                />
                                            </div>
                                            <div className="field flex flex--jc--space-between">
                                                <label htmlFor="knowledgeMark" className="field__label">
                                                    {t('WRITE_REVIEW.KNOWLEDGE')}*
                                                </label>
                                                <RatingField
                                                    form={formik}
                                                    field={formik.getFieldProps('knowledgeMark')}
                                                    meta={formik.getFieldMeta('knowledgeMark')}
                                                />
                                            </div>
                                            <div className="field flex flex--jc--space-between">
                                                <label htmlFor="communicationMark" className="field__label">
                                                    {t('WRITE_REVIEW.COMMUNICATION')}*
                                                </label>
                                                <RatingField
                                                    form={formik}
                                                    field={formik.getFieldProps('communicationMark')}
                                                    meta={formik.getFieldMeta('communicationMark')}
                                                />
                                            </div>
                                        </div>

                                        <div className={'mt-4'}>
                                            <Field
                                                as={TextField}
                                                multiline
                                                name="review"
                                                id="review"
                                                type="text"
                                                fullWidth
                                                required
                                                label={t('WRITE_REVIEW.COMMENT_LABEL')}
                                                variant="outlined"
                                                error={formik.touched.review && !!formik.errors.review}
                                                helperText={formik.touched.review && formik.errors.review}
                                                color="secondary"
                                                InputProps={{
                                                    style: {
                                                        fontFamily: "'Lato', sans-serif",
                                                        backgroundColor: 'white',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    style: { fontFamily: "'Lato', sans-serif" },
                                                }}
                                                FormHelperTextProps={{
                                                    style: { color: 'red' }, // Change the color of the helper text here
                                                }}
                                                inputProps={{
                                                    maxLength: 300,
                                                }}
                                            />
                                            <span className={'type--right d--b'}>{formik.values.review.length}/300</span>
                                        </div>
                                    </Form>
                                </FormikProvider>
                            </div>
                            <div className="modal__footer">
                                <ButtonPrimaryGradient
                                    type="submit"
                                    form="review-form"
                                    className="btn btn--base w--100"
                                    disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                                >
                                    {t('WRITE_REVIEW.SUBMIT')}
                                </ButtonPrimaryGradient>
                                <button onClick={handleClose} className="btn btn--base btn--clear w--100">
                                    {t('WRITE_REVIEW.CANCEL')}
                                </button>
                            </div>
                        </>
                    )}
                    {isSuccess && showThanksText && (
                        <button onClick={handleClose} className="btn btn--base btn--clear w--100">
                            {t('WRITE_REVIEW.CLOSE')}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReviewModal;
