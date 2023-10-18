import { t } from 'i18next';
import { FC, useEffect, useState } from 'react';

import { useLazyGetUserQuery } from '../../../../services/userService';
import { getDateAgoLabel } from '../../../utils/getDateAgoLabel';
import handleRatingStars from '../../../utils/handleRatingStarts';
import IMyReview from '../interfaces/IMyReview';
import { Rating, styled } from '@mui/material';
import { Star } from '@mui/icons-material';
import { StarRating } from './StarRating';

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

    const isMobile = window.innerWidth < 565;

    return (
        <>
            <div key={reviewItem.id} className="reviews-list__item">
                <div className="flex flex--col field__w-fit-content mb-2">
                    <div className="review-name-container">
                      <h4 className="type--md type--wgt--normal mr-2">{reviewItem.userName ? reviewItem.userName : 'Deleted user'}</h4>
                      <StarRating mark={reviewItem.mark} size={isMobile ? 'small' : 'medium'}/>
                      <div className="tag--primary">{t(`SUBJECTS.${reviewItem.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</div>
                    </div>
                    <p className="type--color--brand-light type--sm">{userRole}</p>
                </div>

                <div className="">
                  <p className="type--md mb-4 type--break">{reviewItem.title}</p>
                  <p className="mb-2 type--break">{reviewItem.comment}</p>
                  <p className="type--color--tertiary review-font-small">
                    {t('MY_REVIEWS.PUBLISHED')}
                    &nbsp; {getDateAgoLabel(reviewItem.createdAt)}
                  </p>
                </div>
            </div>
        </>
    );
};

export default ReviewItem;
