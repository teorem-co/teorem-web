import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IAddCustomerPost from '../interfaces/IAddCustomerPost';
import ICustomerSourcePost from '../interfaces/ICustomerSourcePost';
import IDeleteCreditCard from '../interfaces/IDeleteCreditCard';
import IGetCreditCards from '../interfaces/IGetCreditCards';
import ISetDefaultCreditCard from '../interfaces/ISetDefaultCreditCard';
import IStripeConnectAccount from '../interfaces/IStripeConnectAccount';

const URL = 'api/v1/stripe';

interface IStripeConnectCompanyAccount {
  refreshUrl?: string;
  returnUrl?: string;
  userId: string;
  IBAN?: string;
  IBANConfirm?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  name: string;
  PID: string;
  accountType:string;
}

export const stripeService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        connectCompanyAccount: builder.mutation<string, IStripeConnectCompanyAccount>({
          query: (body) => ({
            url: `${URL}/connect-account/${body.userId}`,
            method: HttpMethods.POST,
            body: body,
          })
        }),
        connectAccount: builder.mutation<string, IStripeConnectAccount>({
            query: (body) => ({
                url: `${URL}/connect-account/${body.userId}`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        getCustomerById: builder.query<any, string>({
            query: (userId) => ({
                url: `${URL}/customers/${userId}`,
                method: HttpMethods.GET,
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
                url: `${URL}/remove-customer-source/${deleteCreditCard.userId}?sourceId=${deleteCreditCard.sourceId}`,
                method: HttpMethods.DELETE,
            }),
        }),
        setDefaultCreditCard: builder.mutation<any, ISetDefaultCreditCard>({
            query: (setDefault) => ({
                url: `${URL}/update-default-customer-source/${setDefault.userId}`,
                method: HttpMethods.POST,
                body: {
                    sourceId: setDefault.sourceId,
                },
            }),
        }),
    }),
});

export const {
  useConnectCompanyAccountMutation,
    useConnectAccountMutation,
    useAddCustomerMutation,
    useAddCustomerSourceMutation,
    useLazyGetCreditCardsQuery,
    useSetDefaultCreditCardMutation,
    useRemoveCreditCardMutation,
    useLazyGetCustomerByIdQuery,
} = stripeService;
