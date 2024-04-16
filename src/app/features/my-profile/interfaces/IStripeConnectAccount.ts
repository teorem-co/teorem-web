interface IStripeConnectAccount {
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
    last4SSN?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    accountType: string;
}

export default IStripeConnectAccount;
