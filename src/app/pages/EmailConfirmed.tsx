import { t } from 'i18next';
import { useHistory } from 'react-router';

import logo from '../../assets/images/logo.svg';
import { PATHS } from '../routes';

const EmailConfirmed = () => {
    const history = useHistory();

    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img className="navbar__logo align--center" src={logo} alt="logo" />
                </div>
                <div className="type--lg type--wgt--bold mb-4">{t('EMAIL_CONFIRMED.WELCOME')}</div>
                <div className="type--color--secondary mb-8 w--448--max">{t('EMAIL_CONFIRMED.DESCRIPTION')}</div>
                {/*{false && <div className="btn btn--primary btn--lg mt-6 mb-4">{t('EMAIL_CONFIRMED.EXPIRATION')}</div>}*/}
                <div
                    onClick={() => {
                        history.push(PATHS.LOGIN);
                    }}
                >
                    <button className={`btn btn--base btn--clear`}>{t('EMAIL_CONFIRMED.BUTTON')}</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default EmailConfirmed;
