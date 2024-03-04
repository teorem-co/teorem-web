import ICreditCard from './ICreditCard';

interface IGetCreditCards {
    object: string;
    data: ICreditCard[];
    has_more: boolean;
    url: string;
}

export default IGetCreditCards;
