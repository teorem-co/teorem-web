import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import ICardPost from '../interfaces/ICardPost';
import ICardToken from '../interfaces/ICardToken';
import IStripeConnectAccount from '../interfaces/IStripeConnectAccount';

const URL = '/stripe';

interface IStripeResponse {
    created: number;
    expired_at: number;
    url: string;
    object: string;
}

export interface IAddCustomerPost {
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

export interface ICustomerSourcePost {
    userId: string;
    card: ICardPost;
}

export interface IGetCreditCards {
    object: string;
    data: ICreditCard[];
    has_more: boolean;
    url: string;
}

export interface ICreditCard {
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

export interface IDeleteCreditCard {
    sourceId: string;
    userId: string;
}

export const stripeService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        connectAccount: builder.mutation<IStripeResponse, IStripeConnectAccount>({
            query: (body) => ({
                url: `${URL}/connect-account`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        addCustomer: builder.mutation<any, IAddCustomerPost>({
            query: (body) => ({
                url: `${URL}/add-customer/${body.userId}`,
                method: HttpMethods.POST,
                body: body.customer,
            }),
        }),
        addCustomerSource: builder.mutation<any, ICustomerSourcePost>({
            query: (body) => ({
                url: `${URL}/add-payment-method/${body.userId}`,
                method: HttpMethods.POST,
                body: body.card,
            }),
        }),
        getCreditCards: builder.query<IGetCreditCards, string>({
            query: (userId) => ({
                url: `${URL}/customer-sources/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
        removeCreditCard: builder.mutation<any, IDeleteCreditCard>({
            query: (deleteCreditCard) => ({
                url: `${URL}/remove-customer-source/${deleteCreditCard.userId}`,
                method: HttpMethods.POST,
                body: {
                    sourceId: deleteCreditCard.sourceId,
                },
            }),
        }),
    }),
});

export const {
    useConnectAccountMutation,
    useAddCustomerMutation,
    useAddCustomerSourceMutation,
    useLazyGetCreditCardsQuery,
    useRemoveCreditCardMutation,
} = stripeService;
