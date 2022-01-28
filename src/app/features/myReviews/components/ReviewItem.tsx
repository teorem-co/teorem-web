import { t } from 'i18next';
import { FC } from 'react';

import IMyReview from '../interfaces/IMyReview';

interface Props {
    reviewItem: IMyReview;
}

const ReviewItem: FC<Props> = (props: Props) => {
    const { reviewItem } = props;
    return (
        <>
            <div key={reviewItem.id} className="reviews-list__item">
                <div>
                    <h4 className="type--md type--wgt--normal mb-1">
                        {reviewItem.Booking.User.firstName}
                        &nbsp;
                        {reviewItem.Booking.User.lastName}
                    </h4>
                    <p className="type--color--brand-light">
                        {reviewItem.Booking.User.Role.name}
                    </p>
                </div>
                <div>
                    <div className="flex--primary mb-2">
                        <div>
                            <div className="rating__stars">
                                <div
                                    className="rating__stars__fill"
                                    style={{
                                        width: `${reviewItem.mark * 20}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="tag--primary">
                            {reviewItem.Booking.Subject.name}
                        </div>
                    </div>
                    <p className="type--md mb-4">{reviewItem.title}</p>
                    <p className="mb-2">{reviewItem.comment}</p>
                    <p className="type--color--tertiary">
                        {t('MY_REVIEWS.PUBLISHED')}
                        &nbsp; {reviewItem.createdAt}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ReviewItem;
