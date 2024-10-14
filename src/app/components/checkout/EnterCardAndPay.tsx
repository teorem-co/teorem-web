import { useTranslation } from 'react-i18next';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { StripeError } from '@stripe/stripe-js';
import { ScaleLoader } from 'react-spinners';
import {
    useAddPaymentIntentMutation,
    useAddPaymentMethodMutation,
    useLazyGetCustomerByIdQuery,
} from '../../store/services/stripeService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { GoDotFill } from 'react-icons/go';
import { CurrencySymbol } from '../CurrencySymbol';
import CustomCheckbox from '../form/CustomCheckbox';

export interface BookingInfo {
    tutorId: string;
    requesterId: string;
    startTime: string;
    subjectId: string;
    studentId: string;
    levelId: string;
    cost: number;
    jobId: string;
}

interface Props {
    onSuccess?: () => void;
    bookingInfo: BookingInfo;
    // clientSecret: string;
    // jobId: string;
}

const EnterCardAndPay = (props: Props) => {
    const { onSuccess, bookingInfo } = props;

    const stripe = useStripe();
    const elements = useElements();

    const [getStripeCustomerById, { data: stripeCustomer, isSuccess: stripeCustomerIsSuccess }] =
        useLazyGetCustomerByIdQuery();
    const [loading, setLoading] = useState(false);
    const [addPaymentIntent] = useAddPaymentIntentMutation();
    const userInfo = useAppSelector((state) => state.auth.user);
    const state = useAppSelector((state) => state.myProfileProgress);
    const dispatch = useAppDispatch();
    const [setPaymentMethod] = useAddPaymentMethodMutation();

    const handleError = (error: StripeError) => {
        setLoading(false);
    };

    const sendToStripe = async () => {
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }

        if (userInfo === null) {
            return;
        }

        elements.update({
            mode: 'payment',
        });

        const clientSecret = 'secret';

        await stripe
            .confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: window.location.href,
                    save_payment_method: true,
                },
                redirect: 'if_required',
            })
            .then((result) => {
                console.log('PaymentIntentResult: ', result);
                if (result.error) {
                    handleError(result.error);
                } else if (result.paymentIntent.status === 'succeeded') {
                    //TODO: send request to create booking -> thing that job after 2 mins will do
                    // when that is triggered, send emails that booking is made

                    const data = {
                        paymentIntentId: result.paymentIntent.id,
                        confirmationJobId: bookingInfo.jobId,
                    };
                    //TODO: send /confirm request
                    const progress = { ...state, payment: true };
                    // dispatch(setMyProfileProgress(progress));

                    // setPaymentMethod(result.paymentIntent.payment_method as string);
                }
            });

        setLoading(false);
    };

    const { t } = useTranslation();

    return (
        <div className="bg__green w--550 font-lato">
            <div className="flex flex--row">
                <div className="type--wgt--extra-bold font__xlg text-align--center">Choose how to pay</div>
            </div>
            <div className="mt-10">
                <form>
                    <PaymentElement />
                </form>
            </div>
            <ScaleLoader color={'#7e6cf2'} loading={loading} style={{ margin: '0 auto' }} />

            <CustomCheckbox
                label={'Save this card for future payments'}
                id={'id'}
                customChecks={[]}
                handleCustomCheck={() => console.log('alo alo')}
            />
            <button
                className="mt-10 w--100 text-align--center font__lg flex--ai--center flex flex--grow flex--jc--center btn pt-3 pb-3 btn--primary type--wgt--bold"
                onClick={() => sendToStripe()}
            >
                <span>Confirm payment</span>
                <GoDotFill />
                <CurrencySymbol />
                <span>{bookingInfo.cost}</span>
            </button>

            <div className="flex flex--col flex--gap-10 mt-3">
                <span className="type--color--secondary type--sm">
                    By clicking "Confirm payment" button, you agree to Teorem's Refund and Payment Policy
                </span>
                <span className="type--color--secondary type--sm">
                    It's safe to pay on Teorem. All transactions are protected by SSL encryption
                </span>
            </div>
        </div>
    );
};

export default EnterCardAndPay;
