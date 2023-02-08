import { t } from 'i18next';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

import calendar from '../../../../assets/images/calendar.png';
import earnings from '../../../../assets/images/earnings.png';
import firstAvatar from '../../../../assets/images/user-avatar-1.png';
import secondAvatar from '../../../../assets/images/user-avatar-2.png';
import thirdAvatar from '../../../../assets/images/user-avatar-3.png';
import fourthAvatar from '../../../../assets/images/user-avatar-4.png';
import fifthAvatar from '../../../../assets/images/user-avatar-5.png';
import { PATHS } from '../../../routes';
import FAQGroup from '../components/FAQGroup';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';
import IFAQItem from '../interfaces/IFAQItem';
import grid1 from './../../../../assets/images/grid1.jpg';
import grid2 from './../../../../assets/images/grid2.jpg';
import grid3 from './../../../../assets/images/grid3.jpg';
import grid4 from './../../../../assets/images/grid4.jpg';
import grid5 from './../../../../assets/images/grid5.jpg';
import grid6 from './../../../../assets/images/grid6.jpg';
import profileIllustration1 from './../../../../assets/images/instruktor-ante.jpg';
import profileIllustration2 from './../../../../assets/images/instruktorica-dunja.jpg';

const BecomeTutor = () => {
    const cardText1 = {
        text: t('BECOME_A_TUTOR.REVIEW_1.TEXT'),
        name: t('BECOME_A_TUTOR.REVIEW_1.NAME'),
        role: t('BECOME_A_TUTOR.REVIEW_1.OCCUPATION'),
    };
    const cardText2 = {
        text: t('BECOME_A_TUTOR.REVIEW_2.TEXT'),
        name: t('BECOME_A_TUTOR.REVIEW_2.NAME'),
        role: t('BECOME_A_TUTOR.REVIEW_2.OCCUPATION'),
    };

    const FAQContent: IFAQItem[] = [
        {
            id: 'faq-1',
            question: t('BECOME_A_TUTOR.FAQ.QUESTION_1'),
            answer: t('BECOME_A_TUTOR.FAQ.ANSWER_1'),
        },
        {
            id: 'faq-2',
            question: t('BECOME_A_TUTOR.FAQ.QUESTION_2'),
            answer: t('BECOME_A_TUTOR.FAQ.ANSWER_2'),
        },
        {
            id: 'faq-3',
            question: t('BECOME_A_TUTOR.FAQ.QUESTION_3'),
            answer: t('BECOME_A_TUTOR.FAQ.ANSWER_3'),
        },
        {
            id: 'faq-4',
            question: t('BECOME_A_TUTOR.FAQ.QUESTION_4'),
            answer: t('BECOME_A_TUTOR.FAQ.ANSWER_4'),
        },
        {
            id: 'faq-5',
            question: t('BECOME_A_TUTOR.FAQ.QUESTION_5'),
            answer: t('BECOME_A_TUTOR.FAQ.ANSWER_5'),
        },
        {
            id: 'faq-6',
            question: t('BECOME_A_TUTOR.FAQ.QUESTION_6'),
            answer: t('BECOME_A_TUTOR.FAQ.ANSWER_6'),
        },
    ];

    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <LandingWrapper>
            {/* Content */}

            <div className="landing__hero">
                <div className="landing__hero__title landing--fluid--title w--550--max">{t('BECOME_A_TUTOR.HERO.TITLE')}</div>
                <div className="landing__hero__subtitle landing--fluid--sm type--color--secondary w--400--max">
                    {t('BECOME_A_TUTOR.HERO.SUBTITLE')}
                </div>
                <div className="landing__avatar landing__avatar--first">
                    <img src={firstAvatar} alt="user-1" />
                </div>
                <div className="landing__avatar landing__avatar--second">
                    <img src={secondAvatar} alt="user-2" />
                </div>
                <div className="landing__avatar landing__avatar--third">
                    <img src={thirdAvatar} alt="user-3" />
                </div>
                <div className="landing__avatar landing__avatar--fourth">
                    <img src={fourthAvatar} alt="user-4" />
                </div>
                <div className="landing__avatar landing__avatar--fifth">
                    <img src={fifthAvatar} alt="user-5" />
                </div>
            </div>
            <div className="landing__section mt-30 w--100">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>
            <TextCard className="mt-30" title={t('BECOME_A_TUTOR.TEXT_CARD_1.TITLE')} desc={t('BECOME_A_TUTOR.TEXT_CARD_1.SUBTITLE')} />
            <div className="mt-30">
                <div className="row row--adaptive">
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid1} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">{t('BECOME_A_TUTOR.CARD_1.TITLE')}</div>
                            <div className="type--color--tertiary type--md">{t('BECOME_A_TUTOR.CARD_1.SUBTITLE')}</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid2} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">{t('BECOME_A_TUTOR.CARD_2.TITLE')}</div>
                            <div className="type--color--tertiary type--md">{t('BECOME_A_TUTOR.CARD_2.SUBTITLE')}</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid3} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">{t('BECOME_A_TUTOR.CARD_3.TITLE')}</div>
                            <div className="type--color--tertiary type--md">{t('BECOME_A_TUTOR.CARD_3.SUBTITLE')}</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid4} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">{t('BECOME_A_TUTOR.CARD_4.TITLE')}</div>
                            <div className="type--color--tertiary type--md">{t('BECOME_A_TUTOR.CARD_4.SUBTITLE')}</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid5} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">{t('BECOME_A_TUTOR.CARD_5.TITLE')}</div>
                            <div className="type--color--tertiary type--md">{t('BECOME_A_TUTOR.CARD_5.SUBTITLE')}</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid6} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">{t('BECOME_A_TUTOR.CARD_6.TITLE')}</div>
                            <div className="type--color--tertiary type--md">{t('BECOME_A_TUTOR.CARD_6.SUBTITLE')}</div>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewCard className="mt-30" data={cardText1} img={profileIllustration1} />

            <TextCard className="mt-30" title={t('BECOME_A_TUTOR.TEXT_CARD_1.TITLE')} desc={t('BECOME_A_TUTOR.TEXT_CARD_1.SUBTITLE')} />
            <div className="landing__section mt-30 w--100">
                <img src={earnings} alt="calendar" className="landing__img" />
            </div>
            <p className="landing__title">{t('BECOME_A_TUTOR.SUBTITLE_1')}</p>
            <ReviewCard className="mt-30" data={cardText2} img={profileIllustration2} />
            <p className="landing__title">{t('BECOME_A_TUTOR.SUBTITLE_2')}</p>
            <div className="mt-20">
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item">1</div>
                    <div className="mt-3 ml-6 type--color--secondary type--lg">{t('BECOME_A_TUTOR.STEP_1')}</div>
                </div>
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item">2</div>
                    <div className="mt-3 ml-6 type--color--secondary type--lg">{t('BECOME_A_TUTOR.STEP_2')}</div>
                </div>
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item last">3</div>
                    <div className="mt-3 ml-6 type--color--secondary type--lg">{t('BECOME_A_TUTOR.STEP_3')}</div>
                </div>
            </div>
            <div className="landing__section mt-30">
                <button className="btn btn--primary btn--lg type--md" onClick={() => history.push(PATHS.REGISTER)}>
                    {t('BECOME_A_TUTOR.BUTTON_1')}
                </button>
            </div>
            <p className="landing__title">{t('BECOME_A_TUTOR.SUBTITLE_3')}</p>
            <FAQGroup data={FAQContent} />
        </LandingWrapper>
    );
};

export default BecomeTutor;
