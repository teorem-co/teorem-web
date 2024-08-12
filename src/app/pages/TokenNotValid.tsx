import { t } from 'i18next';

import logo from '../../assets/images/logo.svg';
import { MdReportGmailerrorred } from 'react-icons/md';
import { useAppDispatch } from '../store/hooks';
import { setLoginModalOpen } from '../store/slices/modalsSlice';

const TokenNotValid = () => {
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img className="navbar__logo align--center" src={logo} alt="logo" />
                </div>

                <MdReportGmailerrorred size={70} color={'red'} />
                <div className="type--lg type--wgt--bold mb-4">{t('TOKEN_NOT_VALID.TITLE')}</div>
                <div className="type--color--secondary type--md mb-4 w--448--max">
                    {t('TOKEN_NOT_VALID.DESCRIPTION')}
                </div>
                <div className="type--color--secondary type--sm mb-8 w--448--max">{t('TOKEN_NOT_VALID.HINT')}</div>
                <div
                    onClick={() => {
                        dispatch(setLoginModalOpen(true));
                    }}
                >
                    <button className={`btn btn--base btn--clear`}>{t('TOKEN_NOT_VALID.BUTTON')}</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default TokenNotValid;
