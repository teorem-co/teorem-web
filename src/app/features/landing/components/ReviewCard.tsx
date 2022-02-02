import React from 'react';

import avatar from '../../../../assets/images/avatar.svg';

interface Props {
    role: string;
    image: string;
    description: string;
}

const ReviewCard = () => {
    return (
        // Remove top margin
        <div className="landing__review-card p-6 landing__section">
            {/* User data */}
            <div className="">
                <div className="flex--shrink">
                    <img
                        src={avatar}
                        className="landing__review-card__img mb-2"
                        alt="user-avatar"
                    />
                </div>
                <div className="flex flex--col flex--center">
                    <div className="type--color--white type--wgt--bold type--md mb-2">
                        John Doe
                    </div>
                    <div className="type--sm type--color--secondary">
                        Parent
                    </div>
                </div>
            </div>
            {/* Review description */}
            <div className="type--color--white type--wgt--bold landing__review-card__description">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Dignissimos corrupti cum et nesciunt assumenda at pariatur
                placeat quisquam aliquid tenetur atque, vero doloremque nam,
                dolore magni magnam tempore quis recusandae voluptatum
                reprehenderit itaque! Enim quasi molestiae inventore, quaerat
                labore neque beatae, non, deleniti quis vel culpa maxime
                quisquam ut hic amet ab cupiditate optio eius assumenda corporis
                laboriosam. Quasi sed praesentium voluptatem at! Natus voluptas
                esse nemo maxime minus dolore veritatis, nobis atque quod, nisi
                iure necessitatibus est, cumque illum provident ratione ducimus.
                Tempore veritatis, optio deleniti, doloribus molestias vitae
                commodi cumque perferendis voluptas sint, exercitationem vero.
                Sint, quibusdam aliquam.
            </div>
        </div>
    );
};

export default ReviewCard;
