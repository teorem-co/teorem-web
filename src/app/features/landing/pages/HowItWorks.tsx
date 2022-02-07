import React from 'react';

import calendar from '../../../../assets/images/landing_calendar.jpg';
import tutorList from '../../../../assets/images/landing_tutor_list.jpg';
import CardsGroup from '../components/CardsGroup';
import FAQGroup from '../components/FAQGroup';
import HeroSection from '../components/HeroSection';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';

//add fluid typography
//add trasnlations so text props are passed as translation item
//add image slider
const HowItWorks = () => {
    return (
        <LandingWrapper>
            {/* Content */}

            <HeroSection
                title="Online tutoring that releases potential"
                desc="Private One-on-One 50-minute online lessons uniquely tailored for each student. All school subjects and age groups covered."
                showBtn={false}
            />
            <div className="landing__section">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>
            <div className="type--wgt--bold type--xl">
                As featured around the world
            </div>
            <CardsGroup showCreditCards={false} />

            <TextCard
                title="Large circle of vetted and reviewed high-quality tutors"
                desc="Our tutors are all vetted to ensure they have experience in tutoring. They are reviewed by parents and students after each lesson."
            />
            <div className="landing__section">
                <img
                    src={tutorList}
                    alt="tutor-list"
                    className="landing__img"
                />
            </div>
            <TextCard
                title="Chat with any tutor for free before you book."
                desc="Share any files or assignments with the tutor and have a free video call to make sure the tutor you cohose is the perfect fit for you."
            />
            <div className="landing__section">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>
            <ReviewCard />
            <TextCard
                title="Our virtual classroom lets you rewatch lessons."
                desc="Our lessons are so much more than just video calls. Our virtual classroom contains a digital whiteboard, recording function, screen sharing and much more."
            />
            <div className="landing__section">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>
            <ReviewCard />
            <TextCard
                title="Only pay for what you use."
                desc="Teorem won’t charge you anything until you’ve found your perfect tutor, had a chat with them and booked your first lesson. No sign-up fees, no subscriptions, just plain pay-as-you-go. Safe and secure payment gateway accepting a wide range of options."
            />

            <CardsGroup showCreditCards />
            <div className="landing__section">
                <button className="btn btn--primary btn--lg">
                    Get started
                </button>
            </div>
            <FAQGroup />
        </LandingWrapper>
    );
};

export default HowItWorks;
