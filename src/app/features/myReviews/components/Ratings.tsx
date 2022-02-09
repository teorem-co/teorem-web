import { t } from 'i18next';
import { reverse } from 'lodash';
import { FC, useEffect, useState } from 'react';

import ITutorStatisticsResult from '../interfaces/ITutorStatisticsResult';

interface Props {
    ratings: ITutorStatisticsResult[];
}

const Ratings: FC<Props> = (props: Props) => {
    const { ratings } = props;

    const [statisticsPlaceholder, setStatisticsPlaceholder] = useState<
        ITutorStatisticsResult[]
    >([]);

    useEffect(() => {
        const placeholderArray: ITutorStatisticsResult[] = [];
        //map array for grades which are not included in the array from the backend
        for (let i = 0; i < 5; i++) {
            const currentItem: ITutorStatisticsResult | undefined =
                ratings.find((x) => x.mark === i + 1);

            if (currentItem) {
                placeholderArray.push(currentItem);
            } else {
                const currentObj: ITutorStatisticsResult = {
                    count: '0',
                    mark: i + 1,
                    perCent: 0,
                };
                placeholderArray.push(currentObj);
            }
        }
        setStatisticsPlaceholder(reverse(placeholderArray));
    }, [ratings]);

    return (
        <div>
            {statisticsPlaceholder.length > 0 ? (
                statisticsPlaceholder.map(
                    (item: ITutorStatisticsResult, index: number) => {
                        return (
                            <div key={index} className="rating__item">
                                <div className="mr-3">
                                    {item.mark}&nbsp;{t('MY_REVIEWS.STAR')}
                                </div>
                                <div className="rating__progress">
                                    <span
                                        className="rating__progress__bar"
                                        style={{
                                            right: `${
                                                100 - item.perCent * 100
                                            }%`,
                                        }}
                                    ></span>
                                </div>
                                <div className="ml-3">({item.count})</div>
                            </div>
                        );
                    }
                )
            ) : (
                <></>
            )}
        </div>
    );
};

export default Ratings;
