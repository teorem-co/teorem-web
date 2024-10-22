import { HttpMethods } from '../../types/httpMethods';
import { baseService } from '../baseService';
import IAddCustomerPost from '../../features/my-profile/interfaces/IAddCustomerPost';
import IDeleteCreditCard from '../../features/my-profile/interfaces/IDeleteCreditCard';
import IPaymentMethod from '../../features/my-profile/interfaces/IPaymentMethod';
import ISetDefaultCreditCard from '../../features/my-profile/interfaces/ISetDefaultCreditCard';
import IStripeConnectAccount from '../../features/my-profile/interfaces/IStripeConnectAccount';

const URL = 'api/v1/stripe';

interface IStripeConnectCompanyAccount {
    refreshUrl?: string;
    returnUrl?: string;
    userId: string;
    accountNumber?: string;
    routingNumber?: string;
    IBAN?: string;
    IBANConfirm?: string;
    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    name: string;
    PIN: string;
    accountType: string;
}

export interface IVerificationDocument {
    front: File;
    back: File;
}

export interface IVerificationDocumentResponse {
    stripeVerifiedStatus: string;
    stripeVerificationDocumentsUploaded: boolean;
}

export const stripeService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        connectCompanyAccount: builder.mutation<string, IStripeConnectCompanyAccount>({
            query: (body) => ({
                url: `${URL}/connect-account/${body.userId}`,
                method: HttpMethods.POST,
                body: body,
            }),
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
            // remove candidate, possibly unused
            query: (body) => ({
                url: `${URL}/add-customer/${body.userId}`,
                method: HttpMethods.POST,
                body: body.customer,
            }),
        }),
        createSetupPaymentIntent: builder.mutation<string, string>({
            query: (userId) => ({
                url: `${URL}/create-setup-payment-intent/${userId}`,
                method: HttpMethods.POST,
            }),
        }),
        getCreditCards: builder.query<IPaymentMethod[], string>({
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

        uploadVerificationDocument: builder.mutation<IVerificationDocumentResponse, IVerificationDocument>({
            query: (document) => {
                const formData = new FormData();
                formData.append('front', document.front);
                formData.append('back', document.back);

                return {
                    url: `${URL}/upload-verification-document`,
                    method: HttpMethods.POST,
                    body: formData,
                };
            },
        }),

        deleteAllOngoingPayments: builder.mutation<void, void>({
            query: () => {
                return {
                    url: `${URL}/delete-all-ongoing-payments`,
                    method: HttpMethods.DELETE,
                };
            },
        }),
    }),
});

export const {
    useConnectCompanyAccountMutation,
    useConnectAccountMutation,
    useAddCustomerMutation, // remove candidate
    useCreateSetupPaymentIntentMutation,
    useLazyGetCreditCardsQuery,
    useSetDefaultCreditCardMutation,
    useRemoveCreditCardMutation,
    useLazyGetCustomerByIdQuery,
    useUploadVerificationDocumentMutation,
    useDeleteAllOngoingPaymentsMutation,
} = stripeService;
