import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import logo from '../../../../assets/images/teorem_logo_purple.png';
import { resetSignUp } from '../../../../slices/signUpSlice';
import { PATHS } from '../../../routes';
import { t } from 'i18next';
import { RoleOptions, setSelectedRole } from '../../../../slices/roleSlice';

export const SignupRoleSelect = () => {
    const IMAGES_PATH = '/images';

    const dispatch = useDispatch();
    const history = useHistory();
    const PARENT = RoleOptions.Parent;
    const TUTOR = RoleOptions.Tutor;
    const STUDENT = RoleOptions.Student;

    async function setRoleInStore(role: RoleOptions) {
        await dispatch(setSelectedRole(role));
        history.push(PATHS.REGISTER);
    }

    useEffect(() => {
        dispatch(resetSignUp());
    }, []);

    return (
        <>
            <div>
                <img src={logo} alt="logo" className="mt-5 ml-5 signup-logo" />

                <div className="flex flex--col mt-20" style={{ fontSize: '16px' }}>
                    <h1 className="text-align--center mt-5 mb-5 signup-title">
                        <span dangerouslySetInnerHTML={{ __html: t('REGISTER.FORM.SELECT_ROLE_TITLE') }} />
                    </h1>

                    <div
                        className="flex  flex--row"
                        style={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        {/*parent*/}
                        <div
                            onClick={() => setRoleInStore(PARENT)}
                            className="flex--col card--primary scale-hover--scale-105 cur--pointer"
                            style={{
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img className="card-role-select" style={{ padding: '15%' }} src={`${IMAGES_PATH}/parent.svg`} alt="parent" />
                            <p className="text-align--center">{t('ROLE_SELECTION.PARENT_TITLE')}</p>
                        </div>

                        {/*student*/}
                        <div
                            onClick={() => setRoleInStore(STUDENT)}
                            className="flex--col card--primary scale-hover--scale-105 cur--pointer"
                            style={{
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img className="card-role-select" style={{ padding: '15%' }} src={`${IMAGES_PATH}/student.svg`} alt="parent" />
                            <p className="text-align--center">{t('ROLE_SELECTION.STUDENT_TITLE')}</p>
                        </div>
                    </div>

                    {/*tutor*/}
                    <div onClick={() => setRoleInStore(TUTOR)} className="text-align--center">
                        <h3 className="mt-5 cur--pointer underline-hover primary-color ">{t('REGISTER.FORM.BECOME_A_TUTOR')}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};
