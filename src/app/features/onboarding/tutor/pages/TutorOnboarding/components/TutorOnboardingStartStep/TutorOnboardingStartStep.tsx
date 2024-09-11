import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingStartStep.module.scss';
import point1Image from './assets/point-1.png';
import point2Image from './assets/point-2.png';
import point3Image from './assets/point-3.png';
import Divider from '../../../../../../../components/Divider';
import Typography from '@mui/material/Typography';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';

export default function TutorOnboardingStartStep() {
    const { t } = useTranslation();
    const { onNext, onBack, step, substep, maxSubstep } = useTutorOnboarding();

    return (
        <OnboardingLayout
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext}>
                    {t('ONBOARDING.GET_STARTED')}
                </CtaButton>
            }
        >
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <Typography variant="h1" className={styles.title}>
                        {t('ONBOARDING.TUTOR.START.TITLE')}
                    </Typography>
                </div>
                <div className={styles.pointsContainer}>
                    <div className={styles.point}>
                        <div className={styles.pointNumber}>1</div>
                        <div className={styles.pointBody}>
                            <div className={styles.pointTitle}>{t('ONBOARDING.TUTOR.START.POINT_1.TITLE')}</div>
                            <Typography variant="body2" className={styles.pointDescription}>
                                {t('ONBOARDING.TUTOR.START.POINT_1.DESCRIPTION')}
                            </Typography>
                        </div>
                        <img className={styles.pointImage} src={point1Image} alt="point1" />
                    </div>
                    <Divider />
                    <div className={styles.point}>
                        <div className={styles.pointNumber}>2</div>
                        <div className={styles.pointBody}>
                            <div className={styles.pointTitle}>{t('ONBOARDING.TUTOR.START.POINT_2.TITLE')}</div>
                            <Typography variant="body2" className={styles.pointDescription}>
                                {t('ONBOARDING.TUTOR.START.POINT_2.DESCRIPTION')}
                            </Typography>
                        </div>
                        <img className={styles.pointImage} src={point2Image} alt="point2" />
                    </div>
                    <Divider />
                    <div className={styles.point}>
                        <div className={styles.pointNumber}>3</div>
                        <div className={styles.pointBody}>
                            <div className={styles.pointTitle}>{t('ONBOARDING.TUTOR.START.POINT_3.TITLE')}</div>
                            <Typography variant="body2" className={styles.pointDescription}>
                                {t('ONBOARDING.TUTOR.START.POINT_3.DESCRIPTION')}
                            </Typography>
                        </div>
                        <img className={styles.pointImage} src={point3Image} alt="point3" />
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
}
