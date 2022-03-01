import { t } from 'i18next';
import { FC } from 'react';

import { getDateAgoLabel } from '../../../utils/getDateAgoLabel';
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
                        {reviewItem.User.firstName}
                        &nbsp;
                        {reviewItem.User.lastName}
                    </h4>
                    <p className="type--color--brand-light">{reviewItem.User.Role.name}</p>
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
                        <div className="tag--primary">{reviewItem.Subject.name}</div>
                    </div>
                    <p className="type--md mb-4 type--break">{reviewItem.title}</p>
                    <p className="mb-2 type--break">{reviewItem.comment}</p>
                    <p className="type--color--tertiary">
                        {t('MY_REVIEWS.PUBLISHED')}
                        &nbsp; {getDateAgoLabel(reviewItem.createdAt)}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ReviewItem;
