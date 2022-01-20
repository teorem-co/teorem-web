import MainWrapper from '../../../components/MainWrapper';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

const MyTeachings = () => {
    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion />

                {/* MY TEACHINGS */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">My teachings</div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your teaching information
                        </div>
                    </div>
                    <div>FORM</div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyTeachings;
