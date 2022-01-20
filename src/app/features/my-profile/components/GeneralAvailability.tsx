import MainWrapper from '../../../components/MainWrapper';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

const GeneralAvailability = () => {
    const availabilityTable = [
        ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        [
            'Pre 12 pm',
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--close"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
        ],
        [
            '12 - 5 pm',
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--close"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
        ],
        [
            'After 5 pm',
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
        ],
    ];

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion />

                {/* AVAILABILITY */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            General Availability
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your availability information
                        </div>
                    </div>
                    <div>
                        <table>
                            {availabilityTable.map((row: any) => {
                                return (
                                    <tr>
                                        {row.map((column: number) => {
                                            return <td>{column}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default GeneralAvailability;
