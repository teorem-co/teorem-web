import { t } from 'i18next';

interface IProps {
    step: number;
}

const NavigationParent: React.FC<IProps> = (props: IProps) => {
    const { step } = props;
    return (
        <div className="steps">
            <div className="steps__item steps__item__line--sm mb-10">
                <div className={`steps__item--left active ${step === 2 || step === 3 ? 'steps__item--left--completed' : ''} mr-2`}>
                    {step === 2 || step === 3 ? <i className="icon icon--check icon--base icon--white"></i> : 1}
                </div>
                <div className="steps__item--right">
                    <div className="steps__title steps__title--primary">{t('REGISTER.NAVIGATION.STEP1.TITLE')}</div>
                    <div className="steps__title steps__title--secondary">{t('REGISTER.NAVIGATION.STEP1.DESC')}</div>
                </div>
            </div>

            <div className="steps__item mb-10">
                <div className={`steps__item--left ${step === 3 ? 'steps__item--left--completed active' : step === 2 ? 'active' : ''} mr-2`}>
                    {step === 3 ? <i className="icon icon--check icon--base icon--white"></i> : 2}
                </div>
                <div className="steps__item--right">
                    <div className="steps__title steps__title--primary">{t('REGISTER.NAVIGATION.STEP2.TITLE')}</div>
                    <div className="steps__title steps__title--secondary">{t('REGISTER.NAVIGATION.STEP2.DESC')}</div>
                </div>
            </div>
        </div>
    );
};

export default NavigationParent;
