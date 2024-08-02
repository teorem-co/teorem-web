import { HttpMethods } from '../../../lookups/httpMethods';
import { baseService } from '../../../store/baseService';
import IAddCustomerPost from '../interfaces/IAddCustomerPost';
import IDeleteCreditCard from '../interfaces/IDeleteCreditCard';
import IGetCreditCards from '../interfaces/IGetCreditCards';
import ISetDefaultCreditCard from '../interfaces/ISetDefaultCreditCard';
import IStripeConnectAccount from '../interfaces/IStripeConnectAccount';

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
            query: (body) => ({
                url: `${URL}/add-customer/${body.userId}`,
                method: HttpMethods.POST,
                body: body.customer,
            }),
        }),
        addPaymentIntent: builder.mutation<string, string>({
            query: (userId) => ({
                url: `${URL}/create-payment-intent/${userId}`,
                method: HttpMethods.POST,
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
    }),
});

export const {
    useConnectCompanyAccountMutation,
    useConnectAccountMutation,
    useAddCustomerMutation,
    useAddPaymentIntentMutation,
    useLazyGetCreditCardsQuery,
    useSetDefaultCreditCardMutation,
    useRemoveCreditCardMutation,
    useLazyGetCustomerByIdQuery,
    useUploadVerificationDocumentMutation,
} = stripeService;
