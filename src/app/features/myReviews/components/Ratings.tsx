import { IRatings } from '../../../constants/ratings';

interface Props {
    ratings: IRatings[];
}
const Ratings = (props: Props) => {
    const { ratings } = props;
    let totalRatings: number = 0;

    ratings.forEach((item) => {
        totalRatings += item.ratings;
    });

    return (
        <div>
            {ratings.map((item: IRatings) => {
                return (
                    <div key={item.id} className="rating__item">
                        <div className="mr-3">{item.label}</div>
                        <div className="rating__progress">
                            <span
                                className="rating__progress__bar"
                                style={{
                                    right: `${
                                        100 -
                                        (item.ratings / totalRatings) * 100
                                    }%`,
                                }}
                            ></span>
                        </div>
                        <div className="ml-3">({item.ratings})</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Ratings;
