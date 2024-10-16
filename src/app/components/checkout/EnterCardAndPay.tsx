import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { StripeError } from '@stripe/stripe-js';
import { ScaleLoader } from 'react-spinners';
import { useAppSelector } from '../../store/hooks';
import { GoDotFill } from 'react-icons/go';
import { CurrencySymbol } from '../CurrencySymbol';
import { useHistory } from 'react-router';
import { PATHS } from '../../routes';
import { useConfirmCreateBookingMutation } from '../../store/services/bookingService';
import { t } from 'i18next';
import toastService from '../../store/services/toastService';

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
    clientSecret: string;
    setShowPopup: (arg0: boolean) => void;
    // jobId: string;
}

const EnterCardAndPay = (props: Props) => {
    const { bookingInfo, clientSecret } = props;
    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();
    const [saveCard, setSaveCard] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const checkFormCompletion = (event: any) => {
        setIsFormComplete(event.complete);
    };
    const [confirmCreateBooking] = useConfirmCreateBookingMutation();
    const userInfo = useAppSelector((state) => state.auth.user);
    // const [showPopup, setShowPopup] = useState(false);

    const handleError = (error: StripeError) => {
        setLoading(false);
        toastService.error(error.message || t('CHECKOUT.ERROR'));
        history.push(PATHS.DASHBOARD);
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

        try {
            console.log('confirming payment');
            await stripe
                .confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: {
                        return_url: window.location.href,
                        save_payment_method: saveCard,
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

                        confirmCreateBooking(data)
                            .unwrap()
                            .then((res) => {
                                setLoading(false);
                                props.setShowPopup(true);
                            });
                    } else {
                        alert('SOMETHING WENT WRONG');
                    }
                })
                .catch((err) => {
                    console.log('ERRORIJA: ', err);
                });
        } catch (err) {
            console.log('ERRORIJA: ', err);
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaveCard(event.target.checked); // Update state based on checkbox status
    };

    return (
        <div className="w--550 font-lato">
            <form>
                <PaymentElement onChange={checkFormCompletion} />
            </form>
            <ScaleLoader color={'#7e6cf2'} loading={loading} style={{ margin: '0 auto' }} />

            <label className={`flex flex--ai--center flex--gap-10 mt-4`}>
                <input type="checkbox" checked={saveCard} onChange={handleCheckboxChange} />
                {t('CHECKOUT.SAVE_CARD')}
            </label>
            <button
                className="mt-10 w--100 text-align--center font__lg flex--ai--center flex flex--grow flex--jc--center btn pt-3 pb-3 btn--primary type--wgt--bold"
                onClick={() => sendToStripe()}
                disabled={!isFormComplete || loading}
            >
                <span>{t('CHECKOUT.CONFIRM_PAYMENT')}</span>
                <GoDotFill />
                <CurrencySymbol />
                <span>{bookingInfo.cost}</span>
            </button>

            <div className="flex flex--col flex--gap-10 mt-3 type--base">
                <span className="type--color--secondary">{t('CHECKOUT.PAYMENT_POLICY_PART_ONE')}</span>
                <span className="type--color--secondary">{t('CHECKOUT.PAYMENT_POLICY_PART_TWO')}</span>
            </div>
            {/*{showPopup && (*/}
            {/*    <BookingPopupForm*/}
            {/*        tutorId={bookingInfo.tutorId}*/}
            {/*        levelId={bookingInfo.levelId}*/}
            {/*        subjectId={bookingInfo.subjectId}*/}
            {/*        startTime={bookingInfo.startTime}*/}
            {/*        setShowPopup={props.setShowPopup}*/}
            {/*        onClose={() => history.push(PATHS.DASHBOARD)}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};

export default EnterCardAndPay;
