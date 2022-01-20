import { NavLink } from 'react-router-dom';

import { PROFILE_PATHS } from '../../../routes';
import CircularProgress from './CircularProgress';

const ProfileCompletion = () => {
    return (
        <div className="card--profile__progress flex--primary p-6 mb-20">
            <div className="flex">
                {/* Maybe change later to use custom component instead of library component */}
                <div className="flex flex--center flex--shrink w--105">
                    {/* PROGRESS BAR */}
                    <CircularProgress progressNumber={40} />
                </div>
                <div className="flex flex--col flex--jc--center ml-6">
                    <div className="type--md mb-2">Complete my profile</div>
                    <div className="type--color--tertiary w--200--max">
                        FIll out the missing information to make your profile
                        complete
                    </div>
                </div>
            </div>
            <div className="flex flex--grow flex--jc--space-evenly flex--center">
                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL}>
                    <div className="flex flex--col flex--center">
                        <div className="icon-wrapper icon-wrapper--circle icon-wrapper--primary">
                            <i className="icon icon--base icon--check icon--white"></i>
                        </div>
                        <div className="type--center mt-4 pl-2 pr-2">
                            Personal Information
                        </div>
                    </div>
                </NavLink>
                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY}>
                    <div className="flex flex--col flex--center">
                        <div className="icon-wrapper icon-wrapper--circle icon-wrapper--primary">
                            <i className="icon icon--base icon--check icon--white"></i>
                        </div>
                        <div className="type--center mt-4 pl-2 pr-2">
                            General Availability
                        </div>
                    </div>
                </NavLink>
                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS}>
                    <div className="flex flex--col flex--center">
                        <div className="icon-wrapper icon-wrapper--circle icon-wrapper--primary">
                            <i className="icon icon--base icon--check icon--white"></i>
                        </div>
                        <div className="type--center mt-4 pl-2 pr-2">
                            My Teachings
                        </div>
                    </div>
                </NavLink>
                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL}>
                    <div className="flex flex--col flex--center">
                        <div className="icon-wrapper icon-wrapper--circle icon-wrapper--primary">
                            <i className="icon icon--base icon--check icon--white"></i>
                        </div>
                        <div className="type--center mt-4 pl-2 pr-2">
                            Additional Information
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default ProfileCompletion;
