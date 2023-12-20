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
    additionalInformation: boolean | undefined;
    payment: boolean | undefined;
}

const ProfileCompletion = (props: Props) => {
    const { percentage, generalAvailability, myTeachings, additionalInformation, payment } = props;
    const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';

    return (
        <div className="card--profile__progress flex--primary p-6">
            <div className="card--profile__progress__links">
                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL} className="nav-link--profile" activeClassName="active">
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                          <span className="custom-line">{t('COMPLETE_PROFILE.PROFILE_SETTINGS')}</span>
                          </div>
                    </div>
                </NavLink>
                {userRole === RoleOptions.Tutor && (
                    <>
                        <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                  <span className="custom-line">{t('COMPLETE_PROFILE.GENERAL_AVAILABILITY')}</span>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                  <span className="custom-line">{t('COMPLETE_PROFILE.MY_TEACHINGS')}</span>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                  <span className="custom-line">{t('COMPLETE_PROFILE.ABOUT_ME')}</span>
                                  </div>
                            </div>
                        </NavLink>
                    </>
                )}
                {userRole === RoleOptions.Parent && (
                    <>
                        <NavLink exact to={PROFILE_PATHS.MY_PROFILE_CHILD_INFO} className="nav-link--profile" activeClassName="active">
                            <div className="flex flex--col flex--center">
                                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                  <span className="custom-line">{t('COMPLETE_PROFILE.CHILD_INFO')}</span>
                                  </div>
                            </div>
                        </NavLink>
                    </>
                )}
                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_ACCOUNT} className="nav-link--profile" activeClassName="active">
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                          <span className="custom-line">{t('COMPLETE_PROFILE.ACCOUNT')}</span>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default ProfileCompletion;
