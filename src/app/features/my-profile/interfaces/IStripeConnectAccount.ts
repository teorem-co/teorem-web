interface IStripeConnectAccount {
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
}

export default IStripeConnectAccount;
