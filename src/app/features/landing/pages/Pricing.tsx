import { t } from 'i18next';
import { useEffect } from 'react';

import useWindowSize from '../../../utils/useWindowSize';
import FAQGroup from '../components/FAQGroup';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import Navigation from '../components/Navigation';
import TextCard from '../components/TextCard';
import IFAQItem from '../interfaces/IFAQItem';
import grid7 from './../../../../assets/images/grid7.jpg';
import grid8 from './../../../../assets/images/grid8.jpg';
import grid9 from './../../../../assets/images/grid9.jpg';
import grid10 from './../../../../assets/images/grid10.jpg';

const Pricing = () => {
    const FAQContent: IFAQItem[] = [
        {
            id: 'faq-1',
            question: t('PRICING.FAQ.QUESTION_1'),
            answer: t('PRICING.FAQ.ANSWER_1'),
        },
        {
            id: 'faq-2',
            question: t('PRICING.FAQ.QUESTION_2'),
            answer: t('PRICING.FAQ.ANSWER_2'),
        },
        {
            id: 'faq-3',
            question: t('PRICING.FAQ.QUESTION_3'),
            answer: t('PRICING.FAQ.ANSWER_3'),
        },
        {
            id: 'faq-4',
            question: t('PRICING.FAQ.QUESTION_4'),
            answer: t('PRICING.FAQ.ANSWER_4'),
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navigation />
            <div className="landing__hero--primary">
                <div className="landing">
                    <div className="landing__content">
                        <HeroSection title={t('PRICING.HERO.TITLE')} desc={t('PRICING.HERO.SUBTITLE')} showBtn={false} />
                    </div>
                </div>
            </div>
            <div className="landing">
                <div className="landing__content">
                    <div className="landing__card--hero">
                        <TextCard title={t('PRICING.TEXT_CARD_1.TITLE')} desc={t('PRICING.TEXT_CARD_1.SUBTITLE')} />
                    </div>
                    <p className="landing__title">{t('PRICING.SUBTITLE_1')}</p>
                    <div className="mt-20 landing__steps__wrapper">
                        <div className="flex mb-20">
                            {useWindowSize().width > 850 && <div className="landing__steps__item long">1</div>}
                            <div className="landing__steps__main">
                                <div className="type--lg type--wgt--bold mb-6">{t('PRICING.STEP_1.TITLE')}</div>
                                <div className="type--color--secondary type--md">{t('PRICING.STEP_1.SUBTITLE')}</div>
                            </div>
                        </div>
                        <div className="flex mb-20">
                            {useWindowSize().width > 850 && <div className="landing__steps__item long">2</div>}
                            <div className="landing__steps__main">
                                <div className="type--lg type--wgt--bold mb-6">{t('PRICING.STEP_2.TITLE')}</div>
                                <div className="type--color--secondary type--md">{t('PRICING.STEP_2.SUBTITLE')}</div>
                            </div>
                        </div>
                        <div className="flex">
                            {useWindowSize().width > 850 && <div className="landing__steps__item long last">3</div>}
                            <div className="landing__steps__main">
                                <div className="type--lg type--wgt--bold mb-6">{t('PRICING.STEP_3.TITLE')}</div>
                                <div className="type--color--secondary type--md">{t('PRICING.STEP_3.SUBTITLE')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="landing__section mt-20">
                        <button className="btn btn--primary btn--lg type--md">{t('PRICING.BUTTON_1')}</button>
                        <span className="d--b type--center mt-2 type--color--tertiary">{t('DASHBOARD.COMING_SOON.TITLE')}</span>
                    </div>
                    <p className="landing__title mb-20">{t('PRICING.SUBTITLE_2')}</p>
                    <div className="row row--adaptive">
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid7} alt="grid" />
                                <div className="type--md type--wgt--bold mb-4">{t('PRICING.CARD_1.TITLE')}</div>
                                <div className="type--color--tertiary type--base">{t('PRICING.CARD_1.SUBTITLE')}</div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid9} alt="grid" />
                                <div className="type--md type--wgt--bold mb-4">{t('PRICING.CARD_2.TITLE')}</div>
                                <div className="type--color--tertiary type--base">{t('PRICING.CARD_2.SUBTITLE')}</div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid8} alt="grid" />
                                <div className="type--md type--wgt--bold mb-4">{t('PRICING.CARD_3.TITLE')}</div>
                                <div className="type--color--tertiary type--base">{t('PRICING.CARD_3.SUBTITLE')}</div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid10} alt="grid" />
                                <div className="type--md type--wgt--bold mb-4">{t('PRICING.CARD_4.TITLE')}</div>
                                <div className="type--color--tertiary type--base">{t('PRICING.CARD_4.SUBTITLE')}</div>
                            </div>
                        </div>
                    </div>
                    <p className="landing__title">{t('PRICING.SUBTITLE_3')}</p>
                    <FAQGroup data={FAQContent} />
                </div>
            </div>
            {/* FOOTER */}
            <Footer />
            {/* Content */}
        </>
    );
};

export default Pricing;
