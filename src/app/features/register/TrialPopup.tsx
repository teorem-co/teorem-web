import { t } from 'i18next';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

import logo from '../../../assets/images/logo.svg';
import { resetParentRegister } from '../../store/slices/parentRegisterSlice';
import { resetSelectedRole } from '../../store/slices/roleSlice';
import { resetStudentRegister } from '../../store/slices/studentRegisterSlice';
import { resetTutorRegister } from '../../store/slices/tutorRegisterSlice';
import { useAppDispatch } from '../../store/hooks';
import { PATHS } from '../../routes';
import { ButtonPrimaryGradient } from '../../components/ButtonPrimaryGradient';

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
                <ButtonPrimaryGradient className="btn trial__btn mb-4" onClick={() => backToLogin()}>
                    <div className="mb-2">{t('TRIAL_POPUP.EXPIRATION')}</div>
                    <div>{t('TRIAL_POPUP.REMIND')}</div>
                </ButtonPrimaryGradient>
                <div onClick={() => backToLogin()}>
                    <button className="btn btn--base btn--clear">{t('TRIAL_POPUP.CONFIRM_BUTTON')}</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default TrialPopup;
