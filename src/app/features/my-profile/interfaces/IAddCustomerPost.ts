interface IAddCustomerPost {
    userId: string;
    customer: {
        address: {
            city: string;
            country: string;
            line1: string;
            line2: string;
            postal_code: number;
            state: string;
        };
        description: string;
        email: string;
        name: string;
        phone: string;
    };
}

export default IAddCustomerPost;
