import { t } from 'i18next';
import { FC, useEffect, useState } from 'react';

import { useLazyGetUserQuery } from '../../../../services/userService';
import { getDateAgoLabel } from '../../../utils/getDateAgoLabel';
import handleRatingStars from '../../../utils/handleRatingStarts';
import IMyReview from '../interfaces/IMyReview';

interface Props {
    reviewItem: IMyReview;
}

const ReviewItem: FC<Props> = (props: Props) => {
    const { reviewItem } = props;

    const [getUser] = useLazyGetUserQuery();
    const [userRole, setUserRole] = useState<string>('');

    const getUserRole = async (id: any) => {
        const userResponse = await (await getUser(id).unwrap()).Role.abrv;

        // setUserRole( userResponse.charAt(0).toUpperCase() + userResponse.slice(1) );
        setUserRole(t('ROLES.' + userResponse));
    };

    useEffect(()=>{
        getUserRole(reviewItem.userId);
    }, []);

    return (
        <>
            <div key={reviewItem.id} className="reviews-list__item">
                <div>
                    <h4 className="type--md type--wgt--normal mb-1">{reviewItem.userName ? reviewItem.userName : 'Deleted user'}</h4>
                    <p className="type--color--brand-light">{userRole}</p>
                </div>
                <div>
                    <div className="flex--primary mb-2">
                        <div>
                            <div className="rating__stars">
                                <div
                                    className="rating__stars__fill"
                                    style={{
                                        width: `${handleRatingStars(reviewItem.mark)}px`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="tag--primary">{t(`SUBJECTS.${reviewItem.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</div>
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
