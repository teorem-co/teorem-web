import { NavLink } from 'react-router-dom';

import { PROFILE_PATHS } from '../../../routes';

const ProfileTabs = () => {
    return (
        <div className="tab--primary">
            {/* add navlink classname and active classname */}
            <NavLink
                className="tab--primary__item"
                exact
                to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL}
            >
                <span>INFORMATION</span>
            </NavLink>
            <NavLink
                className="tab--primary__item"
                exact
                to={PROFILE_PATHS.MY_PROFILE_ACCOUNT}
            >
                <span>ACCOUNT</span>
            </NavLink>
        </div>
    );
};
export default ProfileTabs;
