import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPriceStep.module.scss';
import { useEffect, useState } from 'react';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ExpandLess } from '@mui/icons-material';
import Divider from '../../../../../../../components/Divider';
import clsx from 'clsx';
import Modal from '../../../../../../../components/Modal';
import { useAppSelector } from '../../../../../../../store/hooks';

const FEE_PERCENTAGE = 0.15;

export default function TutorOnboardingPriceStep() {
    const [t, i18n] = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [earned, setEarned] = useState(0);
    const [fee, setFee] = useState(0);
    const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
    const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

    useEffect(() => {
        const price = parseFloat(formik.values.price + '' || '0');
        setEarned((price || 0) * (1 - FEE_PERCENTAGE));
        setFee((price || 0) * FEE_PERCENTAGE);

        setNextDisabled?.(!!formik.errors.price);
    }, [setNextDisabled, formik.values.price, formik.errors.price]);

    const marketAbrv = countries.find((c) => c.id === user?.countryId)?.abrv;

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
        >
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.PRICE.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.PRICE.SUBTITLE')}
            >
                <div className={styles.container}>
                    <div className={styles.priceRow}>
                        <div className={styles.currency}>{t('CURRENCY.' + marketAbrv)}</div>
                        <input
                            className={styles.input}
                            type="tel"
                            placeholder="10.00"
                            maxLength={5}
                            value={formik.values.price}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value || '0');
                                // Check if the value is a number
                                if (isNaN(value)) {
                                    return;
                                }
                                formik.setFieldValue('price', e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.breakdown}>
                    {showDetailedBreakdown ? (
                        <>
                            <div className={styles.breakdownContainer}>
                                <div className={styles.row}>
                                    <span>{t('ONBOARDING.TUTOR.PRICE.PRICE_BREAKDOWN_BASE')}</span>
                                    <span>
                                        {t('CURRENCY.' + marketAbrv)}
                                        {parseFloat('0' + formik.values.price).toLocaleString(i18n.language, {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <div className={styles.row}>
                                    <span>{t('ONBOARDING.TUTOR.PRICE.PRICE_BREAKDOWN_FEE')}</span>
                                    <span>
                                        -{t('CURRENCY.' + marketAbrv)}
                                        {parseFloat(fee + '' || '0').toLocaleString(i18n.language, {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <Divider />
                                <div className={styles.row}>
                                    <span>{t('ONBOARDING.TUTOR.PRICE.PRICE_BREAKDOWN_EARNED')}</span>
                                    <span>
                                        {t('CURRENCY.' + marketAbrv)}
                                        {parseFloat(earned + '' || '0').toLocaleString(i18n.language, {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className={clsx(styles.paidContainer, styles.row)}>
                                <span>{t('ONBOARDING.TUTOR.PRICE.PRICE_BREAKDOWN_PAID')}</span>
                                <span>
                                    {t('ONBOARDING.TUTOR.PRICE.CURRENCY')}
                                    {parseFloat('0' + formik.values.price).toLocaleString(i18n.language, {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <button className={styles.expandButton} onClick={() => setShowDetailedBreakdown((v) => !v)}>
                                {t('ONBOARDING.TUTOR.PRICE.SHOW_LESS')} <ExpandLess />
                            </button>
                        </>
                    ) : (
                        <button className={styles.expandButton} onClick={() => setShowDetailedBreakdown((v) => !v)}>
                            {t('ONBOARDING.TUTOR.PRICE.PRICE_BREAKDOWN_SHORT')} {t('CURRENCY.' + marketAbrv)}
                            {parseFloat('0' + earned).toLocaleString(i18n.language, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}{' '}
                            <ExpandMore />
                        </button>
                    )}
                </div>
                {formik.touched?.price && formik.errors?.price ? (
                    <div className="field__validation">{formik.errors.price}</div>
                ) : null}
                <button className={styles.learnMoreButton} onClick={() => setShowLearnMoreModal(true)}>
                    {t('ONBOARDING.TUTOR.PRICE.LEARN_MORE_LABEL')}
                </button>
                <Modal
                    open={showLearnMoreModal}
                    title={t('ONBOARDING.TUTOR.PRICE.LEARN_MORE.TITLE')}
                    onClose={() => setShowLearnMoreModal(false)}
                    onBackdropClick={() => setShowLearnMoreModal(false)}
                >
                    <div className={styles.learnMore}>
                        <p>{t('ONBOARDING.TUTOR.PRICE.LEARN_MORE.DESCRIPTION_1')}</p>
                        <p>
                            <strong>{t('ONBOARDING.TUTOR.PRICE.LEARN_MORE.BULLET_1')}</strong>
                        </p>
                        <p>{t('ONBOARDING.TUTOR.PRICE.LEARN_MORE.DESCRIPTION_2')}</p>
                        <p>
                            <strong>{t('ONBOARDING.TUTOR.PRICE.LEARN_MORE.BULLET_2')}</strong>
                        </p>
                        <p>{t('ONBOARDING.TUTOR.PRICE.LEARN_MORE.DESCRIPTION_3')}</p>
                    </div>
                </Modal>
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
