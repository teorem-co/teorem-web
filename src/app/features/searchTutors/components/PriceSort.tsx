import { t } from 'i18next';
import { FC } from 'react';

interface Props {
    sortDirection: string;
    handleActiveSort: (sortDirection: string) => void;
}

const PriceSort: FC<Props> = (props: Props) => {
    const { sortDirection, handleActiveSort } = props;

    const handleSort = (sort: string) => {
        switch (sort) {
            case '':
                handleActiveSort('asc');
                break;
            case 'asc':
                handleActiveSort('desc');
                break;
            case 'desc':
                handleActiveSort('');
                break;
            default:
                handleActiveSort('');
                break;
        }
    };

    const renderIndicator = (sortDirection: string) => {
        switch (sortDirection) {
            case '':
                return <>{t('SEARCH_TUTORS.SORT_NONE')}</>;
            case 'asc':
                return (
                    <>
                        {t('SEARCH_TUTORS.SORT_LOW')}&nbsp;
                        <i className="icon icon--base icon--chevron-up icon--primary"></i>
                    </>
                );
            case 'desc':
                return (
                    <>
                        {t('SEARCH_TUTORS.SORT_HIGH')}&nbsp;
                        <i className="icon icon--base icon--chevron-down icon--primary"></i>
                    </>
                );
            default:
                <>Click to sort</>;
        }
    };

    return (
        <div>
            <span className="d--ib mr-4">{t('SEARCH_TUTORS.PRICE_SORT')}</span>
            <span
                onClick={() => handleSort(sortDirection)}
                className="type--color--brand flex--inline flex--center cur--pointer"
            >
                {renderIndicator(sortDirection)}
            </span>
        </div>
    );
};

export default PriceSort;
