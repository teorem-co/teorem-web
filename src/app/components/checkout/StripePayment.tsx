import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import EnterCardAndPay, { BookingInfo } from './EnterCardAndPay';

interface Props {
    stripePromise: Promise<Stripe | null>;
    bookingInfo: BookingInfo;
    clientSecret: string;
}

export const StripePayment = ({ stripePromise, bookingInfo, clientSecret }: Props) => {
    const options: StripeElementsOptions = {
        clientSecret: clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                fontFamily: '"Lato", sans-serif',
                fontLineHeight: '1.5',
                borderRadius: '10px',
                colorBackground: '#F6F8FA',
                colorPrimaryText: '#262626',
            },
            rules: {
                '.Tab': {
                    border: '1px solid #E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
                },

                '.Tab:hover': {
                    color: 'var(--colorText)',
                },

                '.Tab--selected': {
                    borderColor: '#E0E6EB',
                    boxShadow:
                        '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
                },

                '.Input--invalid': {
                    boxShadow: '0 1px 1px 0 rgba(231, 76, 60, 1), 0 0 0 2px var(--colorDanger)',
                },
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <EnterCardAndPay bookingInfo={bookingInfo} />
        </Elements>
    );
};
