import React from 'react';

import earth from '../../../../assets/images/earth.png';
import moneyWrapper from '../../../../assets/images/money-wrap.png';
import note from '../../../../assets/images/note.png';
import FAQGroup from '../components/FAQGroup';
import FeaturesCard from '../components/FeaturesCard';
import HeroSection from '../components/HeroSection';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';

const BecomeTutor = () => {
    return (
        <LandingWrapper>
            {/* Content */}

            <HeroSection
                title="Become Teorem online tutor"
                desc="Simple, flexible and cost-effective. "
                showBtn
            />
            <div>IMAGE SLIDER</div>
            <TextCard
                title="How much does online tutoring cost?"
                desc="The price of tutoring varies between £??.?? and £??.?? per lesson, depending on the type and duration of the learning plan. For example, the cost of maths tutoring will be lower if you purchase a package with several lessons included."
            />
            <ReviewCard />
            <FeaturesCard
                reverse
                title="Flexible"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo."
                imgSrc={note}
            />

            <ReviewCard />
            <FeaturesCard
                reverse={false}
                title="Motivating"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo."
                imgSrc={earth}
            />

            <ReviewCard />
            <FeaturesCard
                title="Accessible"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo."
                imgSrc={moneyWrapper}
                reverse
            />

            <div className="landing__section">
                <button className="btn btn--primary btn--lg">
                    Try for free
                </button>
            </div>
            <FAQGroup />
        </LandingWrapper>
    );
};

export default BecomeTutor;
