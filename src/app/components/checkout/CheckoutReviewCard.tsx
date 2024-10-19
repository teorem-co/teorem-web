import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import React, { useState } from 'react';
import { ICheckoutReview } from '../../features/myReviews/services/myReviewsService';

interface Props {
    data: ICheckoutReview;
    className?: string;
}

export function CheckoutReviewCard(props: Props) {
    const { data, className } = props;

    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    function decreaseIndex() {
        if (currentReviewIndex > 0) setCurrentReviewIndex((prevState) => prevState - 1);
    }

    function increaseIndex() {
        if (currentReviewIndex < data.reviews.length) setCurrentReviewIndex((prevState) => prevState + 1);
    }

    return (
        <>
            <div className={`${className} flex flex--col w--100  flex--gap-10`}>
                <div className="flex flex--jc--space-between">
                    <div className="flex flex--ai--center flex--jc--space-between w--100">
                        <div className="flex flex--ai--center flex--gap-10">
                            <div className="flex flex--ai--center pr-2 pl-2 pt-1 pb-1 border-gray">
                                <i className="icon icon--star icon--base"></i>
                                <span>{data.averageGrade.toFixed(1)}</span>
                            </div>
                            <span>{`${data.numberOfReviews} reviews`}</span>
                        </div>
                        <div className="flex flex--ai--center">
                            <button
                                onClick={decreaseIndex}
                                disabled={currentReviewIndex === 0}
                                className={'btn pr-2 pl-2 pt-1 pb-1 flex flex--center calendar-button'}
                            >
                                <FaChevronLeft size={15} />
                            </button>
                            <button
                                onClick={increaseIndex}
                                disabled={currentReviewIndex === data.reviews.length - 1}
                                className={'btn pr-2 pl-2 pt-1 pb-1 flex flex--center calendar-button'}
                            >
                                <FaChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex--col border-gray pr-4 pl-4 pt-2 pb-2">
                    <div className="flex flex--jc--space-between">
                        <span className="type--wgt--extra-bold">{data.reviews[currentReviewIndex].name}</span>
                        <span className="flex flex--ai--center">
                            <i className="icon icon--star icon--base"></i>
                            <span>{data.reviews[currentReviewIndex].grade.toFixed(1)}</span>
                        </span>
                    </div>
                    <span>{data.reviews[currentReviewIndex].comment}</span>
                </div>
            </div>
        </>
    );
}
