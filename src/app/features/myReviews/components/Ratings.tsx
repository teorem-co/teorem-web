import ITutorStatisticsResult from '../interfaces/ITutorStatisticsResult';

interface Props {
    ratings: ITutorStatisticsResult[];
}
const Ratings = (props: Props) => {
    const { ratings } = props;

    return (
        <div>
            {ratings.map((item: ITutorStatisticsResult, index: number) => {
                return (
                    <div key={index} className="rating__item">
                        <div className="mr-3">{item.mark}&nbsp;stars</div>
                        <div className="rating__progress">
                            <span
                                className="rating__progress__bar"
                                style={{
                                    right: `${100 -
                                        (item.perCent) * 100
                                        }%`,
                                }}
                            ></span>
                        </div>
                        <div className="ml-3">({item.count})</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Ratings;
