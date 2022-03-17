import { useEffect } from 'react';
import { useHistory } from 'react-router';

import call1 from '../../../../assets/images/call-1.jpg';
import call2 from '../../../../assets/images/call-2.jpg';
import chat from '../../../../assets/images/chat.jpg';
import tutorList from '../../../../assets/images/landing_tutor_list.jpg';
import { PATHS } from '../../../routes';
import CardsGroup from '../components/CardsGroup';
import FAQGroup from '../components/FAQGroup';
import HeroSection from '../components/HeroSection';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';
import IFAQItem from '../interfaces/IFAQItem';
import profileIllustration1 from './../../../../assets/images/profile-illustration.jpg';
import profileIllustration2 from './../../../../assets/images/profile-illustration2.jpg';
import profileIllustration3 from './../../../../assets/images/profile-illustration3.jpg';

//add fluid typography
//add trasnlations so text props are passed as translation item
//add image slider
const HowItWorks = () => {
    const cardText1 = {
        text: 'Teorem helps me worry less about my child’s grades. Their expert tutors helped my kids achieve better grades which was followed by a boost in their confidence!',
        name: 'Emma',
        role: 'Mother of one',
    };
    const cardText2 = {
        text: 'The complimentary video call has allowed me to chat with several tutors before deciding on one that best fits my child’s needs. I couldn’t be happier!',
        name: 'Renata',
        role: 'Single mother',
    };
    const cardText3 = {
        text: 'Teorem’s virtual classroom helped my son understand tricky concepts through interactive exercises and fun design. It also allows me to rewatch the lessons and make sure my son kept focus!',
        name: 'John',
        role: 'Father of three',
    };

    const FAQContent: IFAQItem[] = [
        {
            id: 'faq-1',
            question: 'Why One-to-one tutoring?',
            answer: 'One-to-one online tutoring gives kids the opportunity to learn at their own pace and in a way that matches their learning style. Teens are often too shy to put their hand up in class – especially if they’re struggling. The reassurance of one-to-one tutoring means they can ask all the questions they want, and go over topics as much as they need until they get it.',
        },
        {
            id: 'faq-2',
            question: 'What are the benefits of online tutoring?',
            answer: 'Teorem’s online tutoring lets kids unleash their full potential. Our digital whiteboard allows tutors to explain complex concepts in an easy and thoughtful manner. Whatever your child needs help with, their tutor will guide them through. In addition, the online model removes geographic constraints of finding a high-quality tutor.',
        },
        {
            id: 'faq-3',
            question: 'What qualifications do the tutors have?',
            answer: 'Applicants undergo multiple tests before becoming tutors on our platform. They are tested on their subject knowledge and personal and teaching skills. A very small number of applicants who apply are selected.',
        },
        {
            id: 'faq-4',
            question: 'How do online lessons work?',
            answer: 'We have our own virtual lesson space including video chat, messaging and an interactive whiteboard which makes it easy for students and tutors to communicate, discuss tricky concepts and do practice questions together. With the live video chat, they can have a natural back-and-forth conversation – just like on FaceTime, WhatsApp and other apps teens use all the time. All our lessons last 50 minutes.',
        },
    ];

    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <LandingWrapper>
            {/* Content */}
            <HeroSection
                title="Online tutoring that releases potential"
                desc="Private One-on-One 50-minute online lessons uniquely tailored for each student. All school subjects and age groups covered."
                showBtn={false}
            />
            <div className="landing__section mt-30 w--100">
                <img src={call1} alt="calendar" className="landing__img" />
            </div>

            <div className="type--wgt--bold type--xl type--center mt-30">As featured around the world</div>

            <CardsGroup showCreditCards={false} />

            <TextCard
                className="mt-30"
                title="Large circle of vetted and reviewed high-quality tutors"
                desc="Our tutors are all vetted to ensure they have experience in tutoring. They are reviewed by parents and students after each lesson."
            />
            <div className="landing__section mt-30">
                <img src={tutorList} alt="tutor-list" className="landing__img" />
            </div>
            <ReviewCard img={profileIllustration1} data={cardText1} className="mt-30" />
            <TextCard
                className="mt-30"
                title="Chat with any tutor for free before you book."
                desc="Share any files or assignments with the tutor and have a free video call to make sure the tutor you cohose is the perfect fit for you."
            />
            <div className="landing__section mt-30 w--100">
                <img src={chat} alt="calendar" className="landing__img" />
            </div>
            <ReviewCard img={profileIllustration2} data={cardText2} className="mt-30" />
            <TextCard
                className="mt-30"
                title="Our virtual classroom lets you rewatch lessons."
                desc="Our lessons are so much more than just video calls. Our virtual classroom contains a digital whiteboard, recording function, screen sharing and much more."
            />
            <div className="landing__section mt-30 w--100">
                <img src={call2} alt="calendar" className="landing__img" />
            </div>
            <ReviewCard img={profileIllustration3} data={cardText3} className="mt-30" />

            <TextCard
                className="mt-30"
                title="Only pay for what you use."
                desc="Teorem won’t charge you anything until you’ve found your perfect tutor, had a chat with them and booked your first lesson. No sign-up fees, no subscriptions, just plain pay-as-you-go. Safe and secure payment gateway accepting a wide range of options."
            />
            <CardsGroup showCreditCards />
            <div className="landing__section mt-30">
                <button className="btn btn--primary btn--lg type--md" onClick={() => history.push(PATHS.REGISTER)}>
                    Get started
                </button>
            </div>
            <p className="type--xxl type--wgt--bold mt-30">Frequently asked questions</p>
            <FAQGroup data={FAQContent} />
        </LandingWrapper>
    );
};

export default HowItWorks;
