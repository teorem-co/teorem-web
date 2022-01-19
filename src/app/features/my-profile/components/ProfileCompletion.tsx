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
                <div className="flex flex--col flex--center">
                    <div className="icon-wrapper icon-wrapper--circle icon-wrapper--primary">
                        <i className="icon icon--base icon--check icon--white"></i>
                    </div>
                    <div className="type--center mt-4 pl-2 pr-2">
                        Personal Information
                    </div>
                </div>
                <div className="flex flex--col flex--center">
                    <div className="icon-wrapper icon-wrapper--circle icon-wrapper--primary">
                        <i className="icon icon--base icon--check icon--white"></i>
                    </div>
                    <div className="type--center mt-4 pl-2 pr-2">
                        Profile Picture
                    </div>
                </div>
                <div className="flex flex--col flex--center">
                    <div className="icon-wrapper icon-wrapper--circle  icon-wrapper--primary--lighter">
                        <i className="icon icon--base icon--edit icon--primary"></i>
                    </div>
                    <div className="type--center mt-4 pl-2 pr-2">
                        General Availability
                    </div>
                </div>
                <div className="flex flex--col flex--center">
                    <div className="icon-wrapper icon-wrapper--circle  icon-wrapper--primary--lighter">
                        <i className="icon icon--base icon--edit icon--primary"></i>
                    </div>
                    <div className="type--center mt-4 pl-2 pr-2">
                        My teachings
                    </div>
                </div>
                <div className="flex flex--col flex--center">
                    <div className="icon-wrapper icon-wrapper--circle  icon-wrapper--primary--lighter">
                        <i className="icon icon--base icon--edit icon--primary"></i>
                    </div>
                    <div className="type--center mt-4 pl-2 pr-2">
                        Aditional Information
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletion;
