import React from 'react';

import card from '../../../../assets/images/card.png';
import euro from '../../../../assets/images/euro.png';
import money from '../../../../assets/images/money.png';
import wallet from '../../../../assets/images/wallet.png';
import FAQGroup from '../components/FAQGroup';
import FeaturesCard from '../components/FeaturesCard';
import HeroSection from '../components/HeroSection';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';

const Pricing = () => {
    return (
        <LandingWrapper>
            {/* Content */}

            <HeroSection
                title="Great value for your money"
                desc=" Simple, flexible and cost-effective."
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
                imgSrc={wallet}
            />

            <FeaturesCard
                reverse={false}
                title="Motivating"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo."
                imgSrc={euro}
            />

            <FeaturesCard
                title="Accessible"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo."
                imgSrc={card}
                reverse
            />

            <FeaturesCard
                reverse={false}
                title="Secure"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non vulputate leo."
                imgSrc={money}
            />
            <ReviewCard />

            <div className="landing__section">
                <button className="btn btn--primary btn--lg">
                    Try for free
                </button>
            </div>
            <FAQGroup />
        </LandingWrapper>
    );
};

export default Pricing;
