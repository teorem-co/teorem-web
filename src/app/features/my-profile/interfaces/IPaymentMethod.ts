import { ICreditCard } from './ICreditCard';

interface IPaymentMethod {
    id: string;
    card: ICreditCard;
    customer: {
        id: string;
    };
    type: string;
}

export default IPaymentMethod;
