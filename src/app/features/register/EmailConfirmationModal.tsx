import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import logo from '../../../assets/images/logo.svg';
import { useResendActivationEmailMutation } from '../../../services/authService';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';

const EmailConfirmatioPopup = () => {

    const history = useHistory();
    const [resendActivationEmailPost, { isSuccess: isSuccessResendActivationEmail }] = useResendActivationEmailMutation();
    const email = useAppSelector((state) => state.tutorRegister.email);
    const [disableButton, setDisableButton] = useState(false);

    const resendActivationEmail = () => {

        if (email.length) {
            resendActivationEmailPost({
                email: email
            });
            setDisableButton(true);
        }
    };

    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img className="navbar__logo align--center" src={logo} alt="logo" />
                </div>
                <div className="type--lg type--wgt--bold mb-4">{t('EMAIL_CONFIRMATION_POPUP.WELCOME')}</div>
                <div className="type--color--secondary mb-8 w--448--max">{t('EMAIL_CONFIRMATION_POPUP.DESCRIPTION')}</div>
                {false && <div className="btn btn--primary btn--lg mt-6 mb-4" onClick={resendActivationEmail}>
                    {t('EMAIL_CONFIRMATION_POPUP.EXPIRATION')}
                </div>}
                <div onClick={() => { history.push(PATHS.LOGIN); }}>
                    <button className={`btn btn--base btn--clear${disableButton && ' btn--disabled'}`}>{t('EMAIL_CONFIRMATION_POPUP.CONFIRM_BUTTON')}</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default EmailConfirmatioPopup;
