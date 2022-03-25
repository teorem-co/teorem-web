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
}

export interface ICustomerSourcePost {
    userId: string;
    source: string;
}

export interface IGetCreditCards {
    object: string;
    data: any;
    has_more: boolean;
    url: string;
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
                url: `${URL}/add-customer`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        //I need to get a cradToken before i can add a new card
        getCardToken: builder.mutation<ICardToken, ICardPost>({
            query: (body) => ({
                url: `${URL}/card-token`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        addCustomerSource: builder.mutation<any, ICustomerSourcePost>({
            query: (body) => ({
                url: `${URL}/add-customer-sources/${body.userId}`,
                method: HttpMethods.POST,
                body: {
                    source: body.source,
                },
            }),
        }),
        getCreditCards: builder.query<IGetCreditCards, string>({
            query: (userId) => ({
                url: `${URL}/customer-sources/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useConnectAccountMutation,
    useAddCustomerMutation,
    useGetCardTokenMutation,
    useAddCustomerSourceMutation,
    useLazyGetCreditCardsQuery,
} = stripeService;
