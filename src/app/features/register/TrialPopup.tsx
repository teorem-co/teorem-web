import { useEffect } from 'react';
import { useHistory } from 'react-router';

import logo from '../../../assets/images/logo.svg';
import { resetSelectedRole } from '../../../slices/roleSlice';
import { useAppDispatch } from '../../hooks';

const TrialPopup = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const backToLogin = () => {
        history.push('/');
    };

    useEffect(() => {
        return () => {
            dispatch(resetSelectedRole());
        };
    }, []);
    return (
        <>
            <div className="trial">
                <div className="mb-10">
                    <img
                        className="navbar__logo align--center"
                        src={logo}
                        alt="logo"
                    />
                </div>
                <div className="type--lg type--wgt--bold mb-4">
                    Welcome to Teorem
                </div>
                <div className="type--color--secondary mb-16 w--448--max">
                    Your profile is now ready to use. Fill out the agenda, sit
                    back and realx, wait for students to reach out to you!
                </div>
                <div
                    className="btn btn--primary trial__btn mb-4"
                    onClick={() => backToLogin()}
                >
                    <div className="mb-2">
                        Your free trial will expire in 30 days!
                    </div>
                    <div>Don’t worry, we’ll remind you on time.</div>
                </div>
                <div onClick={() => backToLogin()}>
                    <button className="btn btn--base btn--clear">Got it</button>
                </div>
            </div>
            <div className="trial__overlay"></div>
        </>
    );
};

export default TrialPopup;
