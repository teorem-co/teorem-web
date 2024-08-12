import { t } from 'i18next';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

import logo from '../../../assets/images/logo.svg';
import { resetParentRegister } from '../../store/slices/parentRegisterSlice';
import { resetSelectedRole } from '../../store/slices/roleSlice';
import { resetStudentRegister } from '../../store/slices/studentRegisterSlice';
import { resetTutorRegister } from '../../store/slices/tutorRegisterSlice';
import { useAppDispatch } from '../../store/hooks';

const TrialPopup = () => {
    const dispatch = useAppDispatch();

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
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default TrialPopup;
