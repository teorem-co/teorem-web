interface ICardPost {
    object: string;
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: number;
    name: string;
    address_line1: string;
    address_city: string;
    address_zip: string;
    address_country: string;
}

export default ICardPost;
