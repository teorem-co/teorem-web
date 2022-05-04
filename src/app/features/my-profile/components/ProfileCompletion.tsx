import { t } from 'i18next';
import { NavLink } from 'react-router-dom';

import { RoleOptions } from '../../../../slices/roleSlice';
import { useAppSelector } from '../../../hooks';
import { PROFILE_PATHS } from '../../../routes';
import CircularProgress from './CircularProgress';

interface Props {
    percentage: number | undefined;
    generalAvailability: boolean | undefined;
    myTeachings: boolean | undefined;
    aditionalInformation: boolean | undefined;
}

const ProfileCompletion = (props: Props) => {
    const { percentage, generalAvailability, myTeachings, aditionalInformation } = props;
    const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';

    return (
        <div className="card--profile__progress flex--primary p-6 mb-20">
            {percentage && percentage !== 100 && userRole === RoleOptions.Tutor && (
                <div className="flex">
                    {/* Maybe change later to use custom component instead of library component */}
                    <div className="flex flex--center flex--shrink w--105">
                        {/* PROGRESS BAR */}
                        <CircularProgress progressNumber={percentage ? percentage : 0} />
                    </div>
                    <div className="flex flex--col flex--jc--center ml-6">
                        <div className="type--md mb-2">{t('COMPLETE_PROFILE.TITLE')}</div>
                        <div className="type--color--tertiary w--200--max">{t('COMPLETE_PROFILE.DESCRIPTION')}</div>
                    </div>
                </div>
            )}

            <div className="card--profile__progress__links">
                <NavLink exact to={t(PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL)} className="nav-link--profile" activeClassName="active">
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__wrapper">
                            <i className="icon icon--base icon--check nav-link--profile__icon"></i>
                        </div>
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.PROFILE_SETTINGS')}</div>
                    </div>
                </NavLink>
                {userRole === RoleOptions.Tutor && (
                    <>
                        <NavLink exact to={t(PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY)} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__wrapper">
                                    <i className={`icon icon--base icon--${generalAvailability ? 'check' : 'edit'} nav-link--profile__icon`}></i>
                                </div>
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                    {t('COMPLETE_PROFILE.GENERAL_AVAILABILITY')}
                                </div>
                            </div>
                        </NavLink>
                        <NavLink exact to={t(PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS)} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__wrapper">
                                    <i className={`icon icon--base icon--${myTeachings ? 'check' : 'edit'} nav-link--profile__icon`}></i>
                                </div>
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.MY_TEACHINGS')}</div>
                            </div>
                        </NavLink>
                        <NavLink exact to={t(PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL)} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__wrapper">
                                    <i className={`icon icon--base icon--${aditionalInformation ? 'check' : 'edit'} nav-link--profile__icon`}></i>
                                </div>
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.ABOUT_ME')}</div>
                            </div>
                        </NavLink>
                    </>
                )}
                {userRole === RoleOptions.Parent && (
                    <>
                        <NavLink exact to={t(PROFILE_PATHS.MY_PROFILE_CHILD_INFO)} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__wrapper">
                                    <i className={`icon icon--base icon--check nav-link--profile__icon`}></i>
                                </div>
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.CHILD_INFO')}</div>
                            </div>
                        </NavLink>
                    </>
                )}
                <NavLink exact to={t(PROFILE_PATHS.MY_PROFILE_ACCOUNT)} className="nav-link--profile" activeClassName="active">
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__wrapper">
                            <i className="icon icon--base icon--check nav-link--profile__icon"></i>
                        </div>
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.ACCOUNT')}</div>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default ProfileCompletion;
