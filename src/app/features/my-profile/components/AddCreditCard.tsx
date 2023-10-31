import {useTranslation} from 'react-i18next';
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import { useEffect, useState } from 'react';
import {
  useAddPaymentIntentMutation,
  useLazyGetCustomerByIdQuery,
} from '../services/stripeService';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {StripeError} from "@stripe/stripe-js";
import { setMyProfileProgress } from '../slices/myProfileSlice';
import { addStripeId } from '../../../../slices/authSlice';

interface Props {
  sideBarIsOpen: boolean;
  closeSidebar: () => void;
}

const AddCreditCard = (props: Props) => {
  const {sideBarIsOpen, closeSidebar} = props;

  const stripe = useStripe();
  const elements = useElements();

  const [getStripeCustomerById, { data: stripeCustomer }] = useLazyGetCustomerByIdQuery();
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

    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    if (userInfo === null) {
      return;
    }

    const clientSecret = await addPaymentIntent(userInfo.id).unwrap();
      await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.href
      },
    }).then((result) => {
      if(result.error){
        handleError(result.error);
      }else{
        const progress = state;
        progress.payment = true;
        dispatch(setMyProfileProgress(progress));
        getStripeCustomerById(userInfo?.id);
      }
    });

    closeSidebar();
  };


  useEffect(() => {
    if(stripeCustomer)
      dispatch(dispatch(addStripeId(stripeCustomer.id)));
  }, [stripeCustomer]);
  const {t} = useTranslation();

  return (
    <div>
      <div
        className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`}
        onClick={closeSidebar}></div>

      <div
        className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
        <div className="flex--primary flex--shrink">
          <div
            className="type--color--secondary">{t('ACCOUNT.NEW_CARD.ADD')}</div>
          <div>
            <i className="icon icon--base icon--close icon--grey"
               onClick={closeSidebar}></i>
          </div>
        </div>
        <div className="flex--grow mt-10">
          <form>
            <PaymentElement/>
          </form>
        </div>
        <div className="flex--shirnk sidebar--secondary__bottom mt-10">
          <div className="flex--primary mt-6">
            <button className="btn btn--clear type--wgt--bold"
                    onClick={() => sendToStripe()}>
              {t('ACCOUNT.NEW_CARD.ADD_BUTTON')}
            </button>
            <button onClick={() => closeSidebar()}
                    className="btn btn--clear type--color--error type--wgt--bold">
              {t('ACCOUNT.NEW_CARD.CANCEL_BUTTON')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCreditCard;


