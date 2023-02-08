import { t } from 'i18next';
import { useHistory } from 'react-router';

import logo from '../../assets/images/logo.svg';
import { PATHS } from '../routes';

const StripeFail = () => {
    const history = useHistory();

    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img className="navbar__logo align--center" src={logo} alt="logo" />
                </div>
                <div className="type--lg type--wgt--bold mb-4">{t('STRIPE_FAIL.WELCOME')}</div>
                <div className="type--color--secondary mb-8 w--448--max">{t('STRIPE_FAIL.DESCRIPTION')}</div>
                {false && <div className="btn btn--primary btn--lg mt-6 mb-4">{t('STRIPE_FAIL.EXPIRATION')}</div>}
                <div
                    onClick={() => {
                        history.push(PATHS.DASHBOARD);
                    }}
                >
                    <button className={`btn btn--base btn--clear`}>{t('STRIPE_FAIL.BUTTON')}</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default StripeFail;
