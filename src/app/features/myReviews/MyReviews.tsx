import MainWrapper from '../../components/MainWrapper';
import MyReviewsList, { IMyReviews } from '../../constants/myReviews';
import ratingsMock from '../../constants/ratings';
import Ratings from './components/Ratings';

const MyReviews = () => {
    const handleAvgRatings = () => {
        let totalRatings: number = 0;
        MyReviewsList.forEach((item) => (totalRatings += item.rating));

        return totalRatings / ratingsMock.length;
    };

    return (
        <MainWrapper>
            <div className="card--search">
                <div className="card--search__head">
                    <h2 className="type--wgt--bold type--lg">My Reviews</h2>
                </div>
                <div className="card--search__body my-reviews__wrapper">
                    <div className="my-reviews__main">
                        <div className="mb-10 flex--primary">
                            <div>
                                <span className="type--uppercase type--color--tertiary">
                                    Reviews
                                </span>
                                <span className="tag--primary d--ib ml-2">
                                    {MyReviewsList.length}
                                </span>
                            </div>
                            <div>
                                {/* <span>Sort by</span>
                                &nbsp;
                                <span className="type--color--brand">
                                    Most relevant
                                </span>
                                <i className="icon icon--base icon--chevron-down icon--primary"></i> */}
                            </div>
                        </div>
                        <div className="reviews-list">
                            {MyReviewsList.map((item: IMyReviews) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="reviews-list__item"
                                    >
                                        <div>
                                            <h4 className="type--md type--wgt--normal mb-1">
                                                {item.name}
                                            </h4>
                                            <p className="type--color--brand-light">
                                                {item.reviewerRole}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex--primary mb-2">
                                                <div>
                                                    <div className="rating__stars">
                                                        <div
                                                            className="rating__stars__fill"
                                                            style={{
                                                                width: `${
                                                                    item.rating *
                                                                    20
                                                                }%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="tag--primary">
                                                    {item.subject}
                                                </div>
                                            </div>
                                            <p className="type--md mb-4">
                                                {item.title}
                                            </p>
                                            <p className="mb-2">{item.desc}</p>
                                            <p className="type--color--tertiary">
                                                Published {item.datePublished}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="my-reviews__aside">
                        <div className="mb-10">
                            <span className="type--uppercase type--color--tertiary">
                                REVIEWS SCORE
                            </span>
                            <span className="tag--primary d--ib ml-2">
                                {handleAvgRatings()}
                            </span>
                        </div>
                        <Ratings ratings={ratingsMock} />
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyReviews;
