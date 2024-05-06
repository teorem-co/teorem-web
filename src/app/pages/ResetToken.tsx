import { t } from 'i18next';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import { useResendActivationEmailMutation } from '../../services/authService';
import { ButtonPrimaryGradient } from '../components/ButtonPrimaryGradient';

const ResetToken = () => {
    const search = useLocation().search;
    const userEmail = new URLSearchParams(search).get('email');

    const [resendActivationEmailPost, { isSuccess: isSuccessResendActivationEmail }] = useResendActivationEmailMutation();
    const [resendEmail, setResendEmail] = useState<boolean>(false);

    const resendActivationEmail = () => {
        if (!resendEmail && userEmail && userEmail.length)
            resendActivationEmailPost({
                email: userEmail,
            });

        setResendEmail(true);
    };

    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img className="navbar__logo align--center" src={logo} alt="logo" />
                </div>
                <div className="type--lg type--wgt--bold mb-4">{t('TOKEN_EXPIRED.WELCOME')}</div>
                <div className="type--color--secondary mb-8 w--448--max">{t('TOKEN_EXPIRED.DESCRIPTION')}</div>
                <div>
                    <div className="type--color--secondary mb-8 w--448--max">
                        {isSuccessResendActivationEmail && t('TOKEN_EXPIRED.RESEND_ACTIVATION_MESSAGE')}
                    </div>
                    <ButtonPrimaryGradient className="btn btn--base w--100 mb-2 mt-6 type--wgt--extra-bold" onClick={resendActivationEmail}>
                        {t('LOGIN.FORM.SEND_AGAIN')}
                    </ButtonPrimaryGradient>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};
export default ResetToken;
