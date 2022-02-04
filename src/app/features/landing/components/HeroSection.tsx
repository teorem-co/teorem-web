import React from 'react';

import firstAvatar from '../../../../assets/images/user-avatar-1.png';
import secondAvatar from '../../../../assets/images/user-avatar-2.png';
import thirdAvatar from '../../../../assets/images/user-avatar-3.png';
import fourthAvatar from '../../../../assets/images/user-avatar-4.png';
import fifthAvatar from '../../../../assets/images/user-avatar-5.png';

const HeroSection = () => {
    return (
        <div className="landing__hero">
            <div className="landing__hero__title landing--fluid--title">
                Online tutoring that releases potential
            </div>
            <div className="landing__hero__subtitle landing--fluid--sm type--color--secondary">
                Private One-on-One 50-minute online lessons uniquely tailored
                for each student. All school subjects and age groups covered.
            </div>
            <img
                src={firstAvatar}
                alt="user-1"
                className="landing__avatar landing__avatar--first"
            />
            <img
                src={secondAvatar}
                alt="user-2"
                className="landing__avatar landing__avatar--second"
            />
            <img
                src={thirdAvatar}
                alt="user-3"
                className="landing__avatar landing__avatar--third"
            />
            <img
                src={fourthAvatar}
                alt="user-4"
                className="landing__avatar landing__avatar--fourth"
            />
            <img
                src={fifthAvatar}
                alt="user-5"
                className="landing__avatar landing__avatar--fifth"
            />
        </div>
    );
};

export default HeroSection;
