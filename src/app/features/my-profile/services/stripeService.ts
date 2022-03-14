import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IStripeConnectAccount from '../interfaces/IStripeConnectAccount';

const URL = '/stripe';

interface IStripeResponse {
    created: number;
    expired_at: number;
    url: string;
    object: string;
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
    }),
});

export const { useConnectAccountMutation } = stripeService;
