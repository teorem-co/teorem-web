import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useCreateVerificationSessionMutation } from '../features/my-profile/services/stripeService';
import { useEffect, useState } from 'react';

export const StripeDocumentUpload = () => {
    const [createVerificationSession] = useCreateVerificationSessionMutation();

    const [stripe, setStripe] = useState<Stripe | null>();
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        loadStripe('pk_test_51IcVQcGh4DYPVxUHJ9afIFjBSGAKYAg06HT1nfPHVFc47hJ7kiuf0Z9LKznaeGpkKIVBTMI11ZhH4ClI9Vy0gZXF00IkeDI7Ib').then((res) =>
            setStripe(res)
        );
    }, []);

    async function handleClick(event: any) {
        // Block native event handling.
        event.preventDefault();

        if (!stripe) {
            alert('Stripe not loaded');
            return;
        }

        setButtonDisabled(false);

        // Call your backend to create the VerificationSession.
        const clientSecret = await createVerificationSession().unwrap();

        // Show the verification modal.
        const { error } = await stripe.verifyIdentity(clientSecret);

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('Verification submitted!');
        }
    }
    return (
        <>
            <button role={'link'} onClick={handleClick}>
                Verify
            </button>
        </>
    );
};
