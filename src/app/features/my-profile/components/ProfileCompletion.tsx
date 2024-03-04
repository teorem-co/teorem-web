import { t } from 'i18next';
import { NavLink } from 'react-router-dom';

import { RoleOptions } from '../../../../slices/roleSlice';
import { useAppSelector } from '../../../hooks';
import { PROFILE_PATHS } from '../../../routes';

interface Props {
    percentage: number | undefined;
    generalAvailability: boolean | undefined;
    myTeachings: boolean | undefined;
    additionalInformation: boolean | undefined;
    payment: boolean | undefined;
}

const ProfileCompletion = (props: Props) => {
    const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';

    return (
        <div className="card--profile__progress__links">
            <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL} className="nav-link--profile" activeClassName="active">
                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                    <span className="custom-line">{t('COMPLETE_PROFILE.PROFILE_SETTINGS')}</span>
                </div>
            </NavLink>
            {userRole === RoleOptions.Tutor && (
                <>
                    <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY} className="nav-link--profile" activeClassName="active">
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            <span className="custom-line">{t('COMPLETE_PROFILE.GENERAL_AVAILABILITY')}</span>
                        </div>
                    </NavLink>
                    <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS} className="nav-link--profile" activeClassName="active">
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            <span className="custom-line">{t('COMPLETE_PROFILE.MY_TEACHINGS')}</span>
                        </div>
                    </NavLink>
                    <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL} className="nav-link--profile" activeClassName="active">
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            <span className="custom-line">{t('COMPLETE_PROFILE.ABOUT_ME')}</span>
                        </div>
                    </NavLink>
                </>
            )}
            {userRole === RoleOptions.Parent && (
                <>
                    <NavLink exact to={PROFILE_PATHS.MY_PROFILE_CHILD_INFO} className="nav-link--profile" activeClassName="active">
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            <span className="custom-line">{t('COMPLETE_PROFILE.CHILD_INFO')}</span>
                        </div>
                    </NavLink>
                </>
            )}
            <NavLink exact to={PROFILE_PATHS.MY_PROFILE_ACCOUNT} className="nav-link--profile" activeClassName="active">
                <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                    <span className="custom-line">{t('COMPLETE_PROFILE.ACCOUNT')}</span>
                </div>
            </NavLink>
        </div>
    );
};

export default ProfileCompletion;
