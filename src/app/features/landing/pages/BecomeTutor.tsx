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
import profileIllustration2 from './../../../../assets/images/profile-illustration2.jpg';
import profileIllustration3 from './../../../../assets/images/profile-illustration3.jpg';

const BecomeTutor = () => {
    const cardText1 = {
        text: 'Teorem helps me worry less about my child’s grades. Their expert tutors helped my kids achieve better grades which was followed by a boost in their confidence!',
        name: 'John',
        role: 'Father of three',
    };
    const cardText2 = {
        text: 'The complimentary video call has allowed me to chat with several tutors before deciding on one that best fits my child’s needs. I couldn’t be happier!',
        name: 'Renata',
        role: 'Single mother',
    };

    const FAQContent: IFAQItem[] = [
        {
            id: 'faq-1',
            question: 'How do I become an online tutor?',
            answer: 'If you want to know how to get into tutoring, you’ve come to the right place! Just create an account, book your interview and we’ll help you get set up!',
        },
        {
            id: 'faq-2',
            question: 'What are the requirements for tutors?',
            answer: 'We ideally require our tutors to commit a minimum of 6 lessons per week. You must be qualified at high school diploma level or above. You need to have a laptop (or PC) and a stable internet connection to teach online.',
        },
        {
            id: 'faq-3',
            question: 'How long does it take before I can start teaching?',
            answer: 'As the registration process consists of a few simple steps, it usually only takes a day until you are verified and can begin teaching.',
        },
        {
            id: 'faq-4',
            question: 'What does the employment relationship look like?',
            answer: 'You offer independent tutoring via Teorem’s platform. There is no employment relationship. You are responsible for any taxes and National Insurance contributions.',
        },
        {
            id: 'faq-5',
            question: 'What makes Teorem different from other portals?',
            answer: 'We guarantee you a steady stream of students. We also take care of everything so that you can focus 100% on teaching.',
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
                <div className="landing__hero__title landing--fluid--title w--550--max">Start tutoring online</div>
                <div className="landing__hero__subtitle landing--fluid--sm type--color--secondary w--260--max">
                    Give lessons whenever you want, from the comfort of your home.
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
            <TextCard
                className="mt-30"
                title="Teorem’s online tutoring makes your life easier"
                desc="We’ll provide you with everything you need to teach online. We help you find students and manage lessons."
            />
            <div className="mt-30">
                <div className="row row--adaptive">
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid1} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Fully remote</div>
                            <div className="type--color--tertiary">All you need is a laptop and wifi</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid2} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Tools you need</div>
                            <div className="type--color--tertiary">Booking system, chat, video calls & more.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid3} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Secure Income</div>
                            <div className="type--color--tertiary">We make sure you get paid.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid4} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Set Your Price</div>
                            <div className="type--color--tertiary">No limitations on what you can earn.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid5} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">24/7 Support</div>
                            <div className="type--color--tertiary">We make sure all your issues are solved.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid6} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Improve Your Teaching</div>
                            <div className="type--color--tertiary">We take care of administration, you just focus on the lessons.</div>
                        </div>
                    </div>
                </div>
            </div>
            <ReviewCard className="mt-30" data={cardText1} img={profileIllustration3} />

            <TextCard
                className="mt-30"
                title="Set your own price and availability!"
                desc="Use our tools to track how much you’re making and increase your client base!"
            />
            <div className="landing__section mt-30 w--100">
                <img src={earnings} alt="calendar" className="landing__img" />
            </div>
            <p className="landing__title">We are here to help you grow!</p>
            <ReviewCard className="mt-30" data={cardText2} img={profileIllustration2} />
            <p className="landing__title">How to become an online tutor on Teorem</p>
            <div className="mt-20">
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item">1</div>
                    <div className="mt-5 ml-6 type--color--secondary type--md">Create your account and fill in the information.</div>
                </div>
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item">2</div>
                    <div className="mt-5 ml-6 type--color--secondary type--md">Upload a short video to prove your identity.</div>
                </div>
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item last">3</div>
                    <div className="mt-5 ml-6 type--color--secondary type--md">Complete your profile and start tutoring!</div>
                </div>
            </div>
            <div className="landing__section mt-30">
                <button className="btn btn--primary btn--lg type--md" onClick={() => history.push(PATHS.REGISTER)}>
                    Get started
                </button>
            </div>
            <p className="landing__title">Frequently asked questions</p>
            <FAQGroup data={FAQContent} />
        </LandingWrapper>
    );
};

export default BecomeTutor;
