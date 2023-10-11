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
    accountType: string;
}

export default IStripeConnectAccount;
