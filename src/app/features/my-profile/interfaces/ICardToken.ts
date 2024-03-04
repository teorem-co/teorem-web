interface ICardToken {
    id: string;
    object: string;
    card: {
        id: string;
        object: string;
        address_city: string;
        address_country: string;
        address_line1: string;
        address_line1_check: string;
        address_line2: string | null;
        address_state: string | null;
        address_zip: string;
        address_zip_check: string;
        brand: string;
        country: string;
        cvc_check: string;
        dynamic_last4: string | null;
        exp_month: number;
        exp_year: number;
        fingerprint: string;
        funding: string;
        last4: string;
        metadata: any;
        name: string;
        tokenization_method: string | null;
    };
    client_ip: string;
    created: number;
    livemode: boolean;
    type: string;
    used: boolean;
}

export default ICardToken;
