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
            refreshUrl: 'https://www.google.hr',
            returnUrl: 'https://www.google.com',
        };
        const res = await stripeConnect(toSend).unwrap();
        setStripeModalUrl(res.url);
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
                        {(loading && <LoaderPrimary />) || <iframe style={{ width: '100%' }} id="frame" src={stripeModalUrl}></iframe>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StripeModal;
