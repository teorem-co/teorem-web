import { useTranslation } from 'react-i18next';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useAddPaymentIntentMutation, useLazyGetCustomerByIdQuery } from '../../../store/services/stripeService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { StripeError } from '@stripe/stripe-js';
import { setMyProfileProgress } from '../../../store/slices/myProfileSlice';
import { addStripeId } from '../../../store/slices/authSlice';
import { ScaleLoader } from 'react-spinners';

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    onSuccess?: () => void;
    clientSecret: string;
}

const AddCreditCard = (props: Props) => {
    const { sideBarIsOpen, closeSidebar, onSuccess, clientSecret } = props;

    const stripe = useStripe();
    const elements = useElements();

    const [getStripeCustomerById, { data: stripeCustomer, isSuccess: stripeCustomerIsSuccess }] =
        useLazyGetCustomerByIdQuery();
    const [loading, setLoading] = useState(false);
    const [addPaymentIntent] = useAddPaymentIntentMutation();
    const userInfo = useAppSelector((state) => state.auth.user);
    const state = useAppSelector((state) => state.myProfileProgress);
    const dispatch = useAppDispatch();

    const handleError = (error: StripeError) => {
        setLoading(false);
    };

    const sendToStripe = async () => {
        if (!stripe && !elements) {
            return;
        }

        setLoading(true);

        if (elements === null || stripe === null) {
            return;
        }

        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }

        if (userInfo === null) {
            return;
        }

        //const clientSecret = await addPaymentIntent(userInfo.id).unwrap();

        await stripe
            .confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            })
            .then((result) => {
                console.log('PaymentIntentResult: ', result);
                if (result.error) {
                    handleError(result.error);
                } else {
                    const progress = { ...state, payment: true };
                    dispatch(setMyProfileProgress(progress));

                    getStripeCustomerById(userInfo?.id).then((result) => {
                        dispatch(addStripeId(result.data.id));
                        if (onSuccess) onSuccess();
                    });
                }
            });

        closeSidebar();
        setLoading(false);
    };

    const { t } = useTranslation();

    return (
        <div>
            <div
                className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`}
                onClick={closeSidebar}
            ></div>

            <div
                className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}
            >
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{t('ACCOUNT.NEW_CARD.ADD')}</div>
                    <div>
                        <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
                    </div>
                </div>
                <div className="mt-10">
                    <form>
                        <PaymentElement />
                    </form>
                </div>
                <div className={'flex--grow mt-10'}>
                    <div className={'type--center type--wgt--extra-bold type--normal'}>
                        {t('ACCOUNT.CARD_DETAILS.NOTE')}
                    </div>
                </div>
                <ScaleLoader color={'#7e6cf2'} loading={loading} style={{ margin: '0 auto' }} />
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--clear type--wgt--bold" onClick={() => sendToStripe()}>
                            {t('ACCOUNT.NEW_CARD.ADD_BUTTON')}
                        </button>
                        <button
                            onClick={() => closeSidebar()}
                            className="btn btn--clear type--color--error type--wgt--bold"
                        >
                            {t('ACCOUNT.NEW_CARD.CANCEL_BUTTON')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCreditCard;
