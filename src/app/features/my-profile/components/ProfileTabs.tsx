import { NavLink } from 'react-router-dom';

import { PROFILE_PATHS } from '../../../routes';

const ProfileTabs = () => {
    return (
        <div className="tab--primary">
            <NavLink
                className="tab--primary__item"
                activeClassName="active"
                exact
                to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL}
                isActive={(match: any, location: Location) => {
                    //function to check if tab is active in profile subroutes
                    if (
                        location.pathname.startsWith(
                            PROFILE_PATHS.MY_PROFILE_INFO
                        )
                    ) {
                        return true;
                    }

                    return false;
                }}
            >
                <span>PERSONAL INFORMATION</span>
            </NavLink>
            <NavLink
                className="tab--primary__item"
                activeClassName="active"
                exact
                to={PROFILE_PATHS.MY_PROFILE_ACCOUNT}
            >
                <span>ACCOUNT</span>
            </NavLink>
        </div>
    );
};
export default ProfileTabs;
