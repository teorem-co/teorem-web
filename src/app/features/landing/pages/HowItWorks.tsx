import React from 'react';

import calendar from '../../../../assets/images/landing_calendar.jpg';
import tutorList from '../../../../assets/images/landing_tutor_list.jpg';
import Footer from '../components/Footer';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';

const HowItWorks = () => {
    return (
        <LandingWrapper>
            {/* Content */}
            <ReviewCard />

            <div className=" landing__section">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>

            <TextCard />
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
