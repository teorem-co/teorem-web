import { useAppSelector } from '../store/hooks';
import { countryMap } from './countries';

interface Props {
    className?: string;
}

export const CurrencySymbol = (props: Props) => {
    //if countryId is not found, default to 'da98ad50-5138-4f0d-b297-62c5cb101247' - Croatia(EUR)
    const countryId = useAppSelector((state) => state?.user?.user?.countryId);
    const { className } = props;

    return (
        <span
            className={`d--ib ${className ? className : ''}`}
            dangerouslySetInnerHTML={{
                __html: countryMap[countryId ? countryId : 'da98ad50-5138-4f0d-b297-62c5cb101247']?.htmlCurrencyCode || '&euro;',
            }}
        />
    );
};
