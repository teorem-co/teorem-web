import { t } from 'i18next';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

import logo from '../../../assets/images/logo.svg';
import { resetParentRegister } from '../../../slices/parentRegisterSlice';
import { resetSelectedRole } from '../../../slices/roleSlice';
import { resetStudentRegister } from '../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../slices/tutorRegisterSlice';
import { useAppDispatch } from '../../hooks';
import { PATHS } from '../../routes';

const TrialPopup = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const backToLogin = () => {
        history.push(PATHS.LOGIN);
    };

    useEffect(() => {
        return () => {
            dispatch(resetSelectedRole());
            dispatch(resetParentRegister());
            dispatch(resetStudentRegister());
            dispatch(resetTutorRegister());
        };
    }, []);
    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img className="navbar__logo align--center" src={logo} alt="logo" />
                </div>
                <div className="type--lg type--wgt--bold mb-4">{t('TRIAL_POPUP.WELCOME')}</div>
                <div className="type--color--secondary mb-16 w--448--max">{t('TRIAL_POPUP.DESCRIPTION')}</div>
                <div className="btn btn--primary trial__btn mb-4" onClick={() => backToLogin()}>
                    <div className="mb-2">{t('TRIAL_POPUP.EXPIRATION')}</div>
                    <div>{t('TRIAL_POPUP.REMIND')}</div>
                </div>
                <div onClick={() => backToLogin()}>
                    <button className="btn btn--base btn--clear">{t('TRIAL_POPUP.CONFIRM_BUTTON')}</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default TrialPopup;
