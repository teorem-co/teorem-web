import { t } from 'i18next';
import { FC } from 'react';

import { SortDirection } from '../../../types/sortDirection';

interface Props {
    sortDirection: SortDirection;
    handleActiveSort: (sortDirection: SortDirection) => void;
}

const PriceSort: FC<Props> = (props: Props) => {
    const { sortDirection, handleActiveSort } = props;

    const handleSort = (sort: SortDirection) => {
        switch (sort) {
            case SortDirection.None:
                handleActiveSort(SortDirection.Asc);
                break;
            case SortDirection.Asc:
                handleActiveSort(SortDirection.Desc);
                break;
            case SortDirection.Desc:
                handleActiveSort(SortDirection.None);
                break;
            default:
                handleActiveSort(SortDirection.None);
                break;
        }
    };

    const renderIndicator = (sortDirection: SortDirection) => {
        switch (sortDirection) {
            case SortDirection.None:
                return <>{t('SEARCH_TUTORS.SORT_NONE')}</>;
            case SortDirection.Asc:
                return (
                    <>
                        {t('SEARCH_TUTORS.SORT_LOW')}&nbsp;
                        <i className="icon icon--base icon--chevron-up icon--primary"></i>
                    </>
                );
            case SortDirection.Desc:
                return (
                    <>
                        {t('SEARCH_TUTORS.SORT_HIGH')}&nbsp;
                        <i className="icon icon--base icon--chevron-down icon--primary"></i>
                    </>
                );
            default:
                <>{t('SEARCH_TUTORS.SORT_NONE')}</>;
        }
    };

    return (
        <div>
            <span className="d--ib mr-4">{t('SEARCH_TUTORS.PRICE_SORT')}</span>
            <span
                onClick={() => handleSort(sortDirection)}
                className="type--color--brand flex--inline flex--center cur--pointer type--wgt--extra-bold"
            >
                {renderIndicator(sortDirection)}
            </span>
        </div>
    );
};

export default PriceSort;
