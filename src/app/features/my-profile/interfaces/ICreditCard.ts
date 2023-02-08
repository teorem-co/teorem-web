interface ICreditCard {
    card: {
        brand: string;
        country: string;
        exp_month: number;
        exp_year: number;
        last4: string;
    };
    customer: string;
    id: string;
    type: string;
}

export default ICreditCard;
