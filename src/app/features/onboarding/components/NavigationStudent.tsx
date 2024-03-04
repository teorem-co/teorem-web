import { t } from 'i18next';

const NavigationStudent = () => {
    return (
        <div className="steps">
            <div className="steps__item">
                <div className="steps__item--left active mr-2">1</div>
                <div className="steps__item--right">
                    <div className="steps__title steps__title--primary">{t('REGISTER.NAVIGATION.STEP1.TITLE')}</div>
                    <div className="steps__title steps__title--secondary">{t('REGISTER.NAVIGATION.STEP1.DESC')}</div>
                </div>
            </div>
        </div>
    );
};

export default NavigationStudent;
