import { t } from 'i18next';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

import call1 from '../../../../assets/images/call-1.jpg';
import chat from '../../../../assets/images/chat.png';
import completedLessons from '../../../../assets/images/completed-lessons.png';
import tutorList from '../../../../assets/images/landing_tutor_list.png';
import { PATHS } from '../../../routes';
import CardsGroup from '../components/CardsGroup';
import FAQGroup from '../components/FAQGroup';
import HeroSection from '../components/HeroSection';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';
import IFAQItem from '../interfaces/IFAQItem';
import profileIllustration2 from './../../../../assets/images/profile-illustration2.jpg';
import profileIllustration3 from './../../../../assets/images/profile-illustration3.jpg';
import profileIllustration1 from './../../../../assets/images/sandra.jpeg';

//add fluid typography
//add trasnlations so text props are passed as translation item
//add image slider
const HowItWorks = () => {
    const cardText1 = {
        text: t('HOW_IT_WORKS.REVIEW_1.TEXT'),
        name: t('HOW_IT_WORKS.REVIEW_1.NAME'),
        role: t('HOW_IT_WORKS.REVIEW_1.OCCUPATION'),
    };
    const cardText2 = {
        text: t('HOW_IT_WORKS.REVIEW_2.TEXT'),
        name: t('HOW_IT_WORKS.REVIEW_2.NAME'),
        role: t('HOW_IT_WORKS.REVIEW_2.OCCUPATION'),
    };
    const cardText3 = {
        text: t('HOW_IT_WORKS.REVIEW_3.TEXT'),
        name: t('HOW_IT_WORKS.REVIEW_3.NAME'),
        role: t('HOW_IT_WORKS.REVIEW_3.OCCUPATION'),
    };

    const FAQContent: IFAQItem[] = [
        {
            id: 'faq-1',
            question: t('HOW_IT_WORKS.FAQ.QUESTION_1'),
            answer: t('HOW_IT_WORKS.FAQ.ANSWER_1'),
        },
        {
            id: 'faq-2',
            question: t('HOW_IT_WORKS.FAQ.QUESTION_2'),
            answer: t('HOW_IT_WORKS.FAQ.ANSWER_2'),
        },
        {
            id: 'faq-3',
            question: t('HOW_IT_WORKS.FAQ.QUESTION_3'),
            answer: t('HOW_IT_WORKS.FAQ.ANSWER_3'),
        },
        {
            id: 'faq-4',
            question: t('HOW_IT_WORKS.FAQ.QUESTION_4'),
            answer: t('HOW_IT_WORKS.FAQ.ANSWER_4'),
        },
    ];

    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <LandingWrapper>
            {/* Content */}
            <HeroSection title={t('HOW_IT_WORKS.HERO.TITLE')} desc={t('HOW_IT_WORKS.HERO.SUBTITLE')} showBtn={false} />
            <div className="landing__section mt-30 w--100">
                <img src={call1} alt="calendar" className="landing__img" />
            </div>

            <div className="type--wgt--bold type--xl type--center mt-30">{t('HOW_IT_WORKS.SUBTITLE_1')}</div>

            <CardsGroup showCreditCards={false} />

            <TextCard className="mt-30" title={t('HOW_IT_WORKS.TEXT_CARD_1.TITLE')} desc={t('HOW_IT_WORKS.TEXT_CARD_1.SUBTITLE')} />
            <div className="landing__section mt-30">
                <img src={tutorList} alt="tutor-list" className="landing__img" />
            </div>
            <ReviewCard img={profileIllustration1} data={cardText1} className="mt-30" />
            <TextCard className="mt-30" title={t('HOW_IT_WORKS.TEXT_CARD_2.TITLE')} desc={t('HOW_IT_WORKS.TEXT_CARD_2.SUBTITLE')} />
            <div className="landing__section mt-30 w--100">
                <img src={chat} alt="calendar" className="landing__img" />
            </div>
            <ReviewCard img={profileIllustration2} data={cardText2} className="mt-30" />
            <TextCard className="mt-30" title={t('HOW_IT_WORKS.TEXT_CARD_3.TITLE')} desc={t('HOW_IT_WORKS.TEXT_CARD_3.SUBTITLE')} />
            <div className="landing__section mt-30 w--100">
                <img src={completedLessons} alt="calendar" className="landing__img" />
            </div>
            <ReviewCard img={profileIllustration3} data={cardText3} className="mt-30" />

            <TextCard className="mt-30" title={t('HOW_IT_WORKS.TEXT_CARD_4.TITLE')} desc={t('HOW_IT_WORKS.TEXT_CARD_4.SUBTITLE')} />
            <CardsGroup showCreditCards />
            <div className="landing__section mt-30">
                <button className="btn btn--primary btn--lg type--md" onClick={() => history.push(PATHS.REGISTER)}>
                    {t('HOW_IT_WORKS.BUTTON_1')}
                </button>
            </div>
            <p className="type--xxl type--wgt--bold mt-30">{t('HOW_IT_WORKS.SUBTITLE_2')}</p>
            <FAQGroup data={FAQContent} />
        </LandingWrapper>
    );
};

export default HowItWorks;
