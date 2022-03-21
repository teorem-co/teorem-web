import { useEffect, useState } from 'react';

import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useConnectAccountMutation } from '../services/stripeService';

interface Props {
    handleClose: () => void;
}

const StripeModal = (props: Props) => {
    const { handleClose } = props;

    const [stripeConnect, { isLoading: stripeLoading, isUninitialized: uninitialized }] = useConnectAccountMutation();

    const [stripeModalUrl, setStripeModalUrl] = useState<string>('');

    const loading = stripeLoading || uninitialized || !stripeModalUrl;

    const stripeConnectFunc = async () => {
        const toSend = {
            refreshUrl: `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}/my-profile/account`,
            returnUrl: `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}/my-profile/account`,
        };
        const res = await stripeConnect(toSend).unwrap();
        //debugger;
        window.open(res.url, '_blank');
        setStripeModalUrl(res.url);
        handleClose();
    };

    useEffect(() => {
        stripeConnectFunc();
    }, []);

    return (
        <>
            <div className="modal__overlay">
                <div className="modal modal--stripe">
                    <i className="icon icon--base icon--close modal__close" onClick={handleClose}></i>

                    <div className="modal__body">
                        {loading && <LoaderPrimary />}
                        {/* {(loading && <LoaderPrimary />) || <iframe style={{ width: '100%' }} id="frame" src={stripeModalUrl}></iframe>} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StripeModal;
