import React from 'react';

interface Props {
    imgSrc: string;
    title: string;
    desc: string;
    reverse: boolean;
}

const FeaturesCard = (props: Props) => {
    const { imgSrc, title, desc, reverse } = props;

    return (
        <div
            className={`landing__features ${
                reverse ? ' landing__features--reverse' : ''
            }`}
        >
            <div className="landing__features__img">
                <img src={imgSrc} alt="features" />
            </div>
            <div className="flex--grow">
                <div className="landing__features__description">
                    <div className="type--wgt--bold type--color--black type--lg mb-4">
                        {title}
                    </div>
                    <div className="type--color--secondary type--md">
                        {desc}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesCard;
