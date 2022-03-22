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
            question: 'How much does a tutor cost?',
            answer: 'Our tutors set their own prices based on their experience, qualifications and availability. Prices start at $XX. You can see all the tutors who match your budget with the handy price filter on our Tutor Search.',
        },
        {
            id: 'faq-2',
            question: 'How to find a tutor?',
            answer: 'Finding a tutor is easy. After you register an account with Teorem, you can search and filter by subject, level, price, experience and more.',
        },
        {
            id: 'faq-3',
            question: 'Can I change a tutor if I am unhappy?',
            answer: 'Of course! You are free to change a tutor anytime. We’ll take care of the admin, so you don’t have to.',
        },
        {
            id: 'faq-4',
            question: 'Can I get a refund?',
            answer: 'Yes, if you cancel up to 24 hours in advance, we will issue you a full refund for your lesson.',
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
                        <HeroSection
                            title="Get the most value for your money"
                            desc="Teorem helps students of all ages to achieve their academic goals."
                            showBtn={false}
                        />
                    </div>
                </div>
            </div>
            <div className="landing">
                <div className="landing__content">
                    <div className="landing__card--hero">
                        <TextCard
                            title="How much does online tutoring cost?"
                            desc="Teorem’s tutors set their own prices, based on their experience and availability. Lesson prices start from HRK 50, with the average price at around HRK 80. "
                        />
                    </div>
                    <p className="landing__title">Our tutoring process</p>
                    <div className="mt-20 landing__steps__wrapper">
                        <div className="flex mb-30">
                            {useWindowSize().width > 850 && <div className="landing__steps__item long">1</div>}
                            <div className="landing__steps__main">
                                <div className="type--lg type--wgt--bold mb-6">Initial Assessment Complimentary</div>
                                <div className="type--color--secondary type--lg">
                                    During an initial, complimentary call, Teorem’s tutor will determine the student’s needs and choose the ideal
                                    study based on the student’s personality, learning style and requirements.
                                </div>
                            </div>
                        </div>
                        <div className="flex mb-30">
                            {useWindowSize().width > 850 && <div className="landing__steps__item long">2</div>}
                            <div className="landing__steps__main">
                                <div className="type--lg type--wgt--bold mb-6">Trial Lesson</div>
                                <div className="type--color--secondary type--lg">
                                    A trial lesson gives you a chance to see how the tutor teaches and how the Teorem platform works.
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            {useWindowSize().width > 850 && <div className="landing__steps__item long last">3</div>}
                            <div className="landing__steps__main">
                                <div className="type--lg type--wgt--bold mb-6">Collaboration</div>
                                <div className="type--color--secondary type--lg">
                                    Teorem’s tutoring is straightforward and hassle-free. Once you’re registered, you’ll find everything you need on
                                    our platform. You can monitor performance, change lesson times, book new lessons, cancel them, or even contact
                                    your tutor, all in just a few clicks.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="landing__section mt-20">
                        <button className="btn btn--primary btn--lg type--md">Book Your Complementary Lesson</button>
                        <span className="d--b type--center mt-2 type--color--tertiary">Coming soon</span>
                    </div>
                    <p className="landing__title mb-20">Teorem benefits</p>
                    <div className="row row--adaptive">
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid7} alt="grid" />
                                <div className="type--lg type--wgt--bold mb-4">Flexible</div>
                                <div className="type--color--tertiary type--md">Easy, flexible, scheduling adjusted to you.</div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid9} alt="grid" />
                                <div className="type--lg type--wgt--bold mb-4">Virtual Classroom</div>
                                <div className="type--color--tertiary type--md">
                                    Available on all devices, with a built-in recording function, digital whiteboard, and screen and file sharing.
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid8} alt="grid" />
                                <div className="type--lg type--wgt--bold mb-4">Secure Payment</div>
                                <div className="type--color--tertiary type--md">
                                    Secure, safe payment gateway provided by Stripe. No hidden fees, just pay for lessons. Refunds provided.
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="landing__grid__card">
                                <img className="mb-10" src={grid10} alt="grid" />
                                <div className="type--lg type--wgt--bold mb-4">Support</div>
                                <div className="type--color--tertiary type--md">
                                    24/7 access to support. Our dedicated support team is available to you at a moment’s notice.
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="landing__title">Frequently asked questions</p>
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
