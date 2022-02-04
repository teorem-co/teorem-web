import React from 'react';

import calendar from '../../../../assets/images/landing_calendar.jpg';
import tutorList from '../../../../assets/images/landing_tutor_list.jpg';
import CardsGroup from '../components/CardsGroup';
import FAQGroup from '../components/FAQGroup';
import FeaturesCard from '../components/FeaturesCard';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';

const HowItWorks = () => {
    return (
        <LandingWrapper>
            {/* Content */}

            <div className=" landing__section">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>

            <TextCard />
            <ReviewCard />
            <CardsGroup />
            <FAQGroup />
            <FeaturesCard />
            <div className=" landing__section">
                <img
                    src={tutorList}
                    alt="tutor-list"
                    className="landing__img"
                />
            </div>
        </LandingWrapper>
    );
};

export default HowItWorks;
