import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import logo from '../../assets/images/logo.svg';

const NotFound = () => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <div className="not-found">
            <div>
                {/* Remove div if not needed */}
                {/* Add image when its exported in Figma */}
                {/* <img className="not-found__img" src={Image from import} alt="not-found" /> */}
            </div>
            <div>
                <img className="not-found__logo" src={logo} alt="Teorem" />
            </div>
            <h1 className="not-found__title">{t('NOT_FOUND.TITLE')}</h1>
            <p className="not-found__subtitle">{t('NOT_FOUND.SUBTITLE')}</p>
            <button onClick={() => history.push('/my-bookings')} className="btn btn--sm btn--clear type--wgt--extra-bold">
                {t('NOT_FOUND.BACK_BUTTON')}
            </button>
        </div>
    );
};

export default NotFound;
