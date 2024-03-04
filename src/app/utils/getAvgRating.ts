import IMyReviews from '../features/myReviews/interfaces/IMyReviews';

const getAvgRating = (myReviews: IMyReviews | undefined) => {
    let totalRatings: number = 0;
    let myReviewsLength: number = 0;

    if (myReviews && myReviews.count > 0) {
        myReviews.rows.forEach((item) => (totalRatings += item.mark));
        myReviewsLength = totalRatings / myReviews.count;
    }

    return myReviewsLength;
};

export default getAvgRating;
