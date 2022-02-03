import React from 'react';

import earth from '../../../../assets/images/earth.png';

const FeaturesCard = () => {
    return (
        <div className="landing__features">
            <div className="landing__features__img">
                <img src={earth} alt="earth" />
            </div>
            <div className="flex--grow">
                <div className="landing__features__description">
                    <div className="type--wgt--bold type--color--black type--lg mb-4">
                        Motivating
                    </div>
                    <div className="type--color--secondary type--md">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum non vulputate leo. Lorem ipsum dolor sit
                        amet, consectetur adipiscing elit. Vestibulum non
                        vulputate leo.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesCard;
