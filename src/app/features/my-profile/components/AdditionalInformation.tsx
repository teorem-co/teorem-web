import MainWrapper from '../../../components/MainWrapper';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

const AdditionalInformation = () => {
    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion />

                {/* ADDITIONAL INFO */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Additional information
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your additional information
                        </div>
                    </div>
                    <div>
                        <div className="field">
                            <label
                                className="field__label"
                                htmlFor="about-input"
                            >
                                Tell us more about yourself*
                            </label>
                            <textarea
                                placeholder="What describes you best, what are your hobbies, approach..."
                                className="input input--base input--textarea"
                                id="about-input"
                            />
                        </div>
                        <div className="field">
                            <label
                                className="field__label"
                                htmlFor="about-lession-input"
                            >
                                Tell us more about your lessons**
                            </label>
                            <textarea
                                placeholder="Describe your lessons, approach, way of teaching..."
                                className="input input--base input--textarea"
                                id="about-lession-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default AdditionalInformation;
