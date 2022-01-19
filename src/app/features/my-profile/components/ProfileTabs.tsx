import { NavLink } from 'react-router-dom';

import { PATHS } from '../../../routes';

const ProfileTabs = () => {
    return (
        <div className="tab--primary">
            {/* add navlink classname and active classname */}
            <NavLink
                className="tab--primary__item"
                exact
                to={PATHS.MY_PROFILE_INFO}
            >
                <span>PERSONAL INFORMATION</span>
            </NavLink>
            <NavLink
                className="tab--primary__item"
                exact
                to={PATHS.MY_PROFILE_ACCOUNT}
            >
                <span>ACCOUNT</span>
            </NavLink>
        </div>
    );
};
export default ProfileTabs;
