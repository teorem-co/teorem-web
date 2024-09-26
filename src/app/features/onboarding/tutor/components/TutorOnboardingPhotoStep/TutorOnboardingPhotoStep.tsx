import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPhotoStep.module.scss';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useSetTutorProfileImageMutation } from '../../../../../store/services/userService';
import { Button, IconButton } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import PhotoUploadArea from './components/PhotoUploadArea';
import CheckBox from '@mui/icons-material/CheckBox';
import Close from '@mui/icons-material/Close';
import OnboardingLayout from '../../../components/OnboardingLayout';
import CtaButton from '../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../constants/questionArticles';
import QuestionListItem from '../../../components/QuestionListItem';
import { useAppSelector } from '../../../../../store/hooks';
import useMount from '../../../../../utils/useMount';

export default function TutorOnboardingPhotoStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [updateUserInformation, { isLoading: isLoadingUserUpdate }] = useSetTutorProfileImageMutation();
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    useMount(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' });
        }, 237);
    });

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.imageLink);
    }, [formik.errors.imageLink, setNextDisabled]);

    const uploadImage = useCallback(
        (image: File) => {
            setNextDisabled?.(true);
            if (!image) {
                return;
            }
            const options = {
                maxSizeMB: 5,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };
            imageCompression(image, options)
                .then((compressedImage) => {
                    const toSend: any = {};
                    toSend['profileImage'] = compressedImage;

                    return updateUserInformation(toSend)
                        .unwrap()
                        .then((res) => {
                            console.log({ res });
                            formik.setFieldValue('imageLink', res);
                        });
                })
                .finally(() => {
                    setNextDisabled?.(false);
                });
        },
        [formik, setNextDisabled, updateUserInformation]
    );

    const handleDelete = () => {
        formik.setFieldValue('imageLink', '');
    };

    return (
        <OnboardingLayout
            header={
                <Button
                    variant="outlined"
                    color="secondary"
                    className={onboardingStyles.questions}
                    onClick={() => setIsSidebarOpen(true)}
                >
                    {t('ONBOARDING.QUESTIONS')}
                </Button>
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext} disabled={nextDisabled}>
                    {t('ONBOARDING.NEXT')}
                </CtaButton>
            }
            isSidebarOpen={isSidebarOpen}
            onSidebarClose={() => setIsSidebarOpen(false)}
            sidebar={QUESTION_ARTICLES.PHOTO[countryAbrv ?? '']?.map((article) => (
                <QuestionListItem
                    key={article.title}
                    description={article.description}
                    title={article.title}
                    link={article.link}
                    image={article.image}
                />
            ))}
        >
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.PHOTO.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.PHOTO.SUBTITLE')}
            >
                {formik.values.imageLink?.length ? (
                    <div className={styles.imgContainer}>
                        <img src={formik.values.imageLink} alt="profile image" />
                        <IconButton className={styles.delete} onClick={handleDelete}>
                            <Delete />
                        </IconButton>
                    </div>
                ) : (
                    <PhotoUploadArea
                        setFieldValue={(_, value) => uploadImage(value)}
                        id="imageLink"
                        name="imageLink"
                        value={formik.values.imageLink ?? ''}
                        disabled={false}
                        removePreviewOnUnmount={true}
                        title={t('ONBOARDING.TUTOR.PHOTO.DRAG_TITLE')}
                        description={t('ONBOARDING.TUTOR.PHOTO.DRAG_DESCRIPTION')}
                        cta={t('ONBOARDING.TUTOR.PHOTO.BROWSE')}
                    />
                )}
                {formik.errors?.imageLink && formik.values.imageLink ? (
                    <div className="field__validation">{formik.errors.imageLink}</div>
                ) : null}
                <div className={styles.points}>
                    <div className={styles.point}>
                        <CheckBox className={styles.icon} />
                        <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_SMILE')}</span>
                    </div>
                    <div className={styles.point}>
                        <CheckBox className={styles.icon} />
                        <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_FRAME')}</span>
                    </div>
                    <div className={styles.point}>
                        <CheckBox className={styles.icon} />
                        <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_FACE')}</span>
                    </div>
                    <div className={styles.point}>
                        <CheckBox className={styles.icon} />
                        <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_PERSON')}</span>
                    </div>
                    <div className={styles.point}>
                        <Close className={styles.icon} />
                        <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_LOGO')}</span>
                    </div>
                </div>
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
