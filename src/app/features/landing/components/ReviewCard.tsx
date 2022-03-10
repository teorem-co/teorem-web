import React from 'react';

import avatar from '../../../../assets/images/gradient-circle.svg';

interface Props {
    className?: string;
    img: string;
}

const ReviewCard = (props: Props) => {
    const { className, img } = props;
    return (
        <div className={`landing__review-card ${className ? className : ''}`}>
            {/* User data */}
            <div>
                <div className=" flex--shrink">
                    <img src={img} className="mb-2" alt="user-avatar" />
                </div>
                <div className="flex flex--col flex--center">
                    <div className="type--color--white type--wgt--bold type--md mb-2">John Doe</div>
                    <div className="type--sm type--color--tertiary type--wgt--bold">Parent</div>
                </div>
            </div>
            {/* Review description */}
            <div className="type--color--white landing__review-card__description landing--fluid--sm">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima temporibus fugiat vitae debitis. Voluptate porro aliquam consequuntur
                perferendis totam quisquam!
            </div>
        </div>
    );
};

export default ReviewCard;
