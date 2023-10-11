import { useTranslation } from 'react-i18next';
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useState} from "react";
import {useAddPaymentIntentMutation} from "../services/stripeService";
import {useAppSelector} from "../../../hooks";
import {StripeError} from "@stripe/stripe-js";

interface Props {
  sideBarIsOpen: boolean;
  closeSidebar: () => void;
  handleSubmit: (values: Values) => void;
}

export interface Values {
  cardFirstName: string;
  cardLastName: string;
  city: string;
  country: string;
  line1: string;
  line2: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  zipCode: string;
}

const AddCreditCard = (props: Props) => {
  const { sideBarIsOpen, closeSidebar } = props;

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [addPaymentIntent] = useAddPaymentIntentMutation();
  const userInfo = useAppSelector((state) => state.auth.user);


  const handleError = (error: StripeError) => {
    setLoading(false);
  };

  const sendToStripe = async () => {
    if (!stripe && !elements) {
      return;
    }

    setLoading(true);

    if(elements === null || stripe === null) {
      return;
    }
    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the SetupIntent and obtain clientSecret
    if(userInfo === null) {
      return;
    }

    const clientSecret = await addPaymentIntent(userInfo.id).unwrap();

    // Confirm the SetupIntent using the details collected by the Payment Element
    const {error} = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.href
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the setup. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    closeSidebar();
  };

  const { t } = useTranslation();

  return (
    <div>
      <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={closeSidebar}></div>

      <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
        <div className="flex--primary flex--shrink">
          <div className="type--color--secondary">{t('ACCOUNT.NEW_CARD.ADD')}</div>
          <div>
            <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
          </div>
        </div>
        <div className="flex--grow mt-10">
          <form>
            <PaymentElement/>
          </form>
        </div>
        <div className="flex--shirnk sidebar--secondary__bottom mt-10">
          <div className="flex--primary mt-6">
            <button className="btn btn--clear type--wgt--bold" onClick={() => sendToStripe()}>
              {t('ACCOUNT.NEW_CARD.ADD_BUTTON')}
            </button>
            <button onClick={() => closeSidebar()} className="btn btn--clear type--color--error type--wgt--bold">
              {t('ACCOUNT.NEW_CARD.CANCEL_BUTTON')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCreditCard;


