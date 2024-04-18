export interface Currency {
    currencyCode: string;
    abrv: string;
    htmlCurrencyCode?: string;
}

type CurrencyMap = Record<string, Currency>;

export const countryMap: CurrencyMap = {
    'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9': {
        currencyCode: 'USD',
        abrv: 'US Dollar',
        htmlCurrencyCode: '&#36;',
    },
    'da98ad50-5138-4f0d-b297-62c5cb101247': {
        currencyCode: 'EUR',
        abrv: 'Euro',
        htmlCurrencyCode: '&#8364;',
    },
    // add more currencies as needed
};
