import { NavLink } from 'react-router-dom';

import { PROFILE_PATHS } from '../../../routes';
import CircularProgress from './CircularProgress';

interface Props {
    percentage: number | undefined;
}

const ProfileCompletion = (props: Props) => {
    const { percentage } = props;
    return (
        <div className="card--profile__progress flex--primary p-6 mb-20">
            <div className="flex">
                {/* Maybe change later to use custom component instead of library component */}
                <div className="flex flex--center flex--shrink w--105">
                    {/* PROGRESS BAR */}
                    <CircularProgress
                        progressNumber={percentage ? percentage : 0}
                    />
                </div>
                <div className="flex flex--col flex--jc--center ml-6">
                    <div className="type--md mb-2">Complete my profile</div>
                    <div className="type--color--tertiary w--200--max">
                        FIll out the missing information to make your profile
                        complete
                    </div>
                </div>
            </div>
            <div className="card--profile__progress__links">
                <NavLink
                    exact
                    to={PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL}
                    className="nav-link--profile"
                    activeClassName="active"
                >
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__wrapper">
                            <i className="icon icon--base icon--profile nav-link--profile__icon"></i>
                        </div>
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            Profile Settings
                        </div>
                    </div>
                </NavLink>
                <NavLink
                    exact
                    to={PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY}
                    className="nav-link--profile"
                    activeClassName="active"
                >
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__wrapper">
                            <i className="icon icon--base icon--time nav-link--profile__icon"></i>
                        </div>
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            General Availability
                        </div>
                    </div>
                </NavLink>
                <NavLink
                    exact
                    to={PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS}
                    className="nav-link--profile"
                    activeClassName="active"
                >
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__wrapper">
                            <i className="icon icon--base icon--subject nav-link--profile__icon"></i>
                        </div>
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            My Teachings
                        </div>
                    </div>
                </NavLink>
                <NavLink
                    exact
                    to={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL}
                    className="nav-link--profile"
                    activeClassName="active"
                >
                    <div className="flex flex--col flex--center">
                        <div className="nav-link--profile__wrapper">
                            <i className="icon icon--base icon--info nav-link--profile__icon"></i>
                        </div>
                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                            Aditional information
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default ProfileCompletion;
