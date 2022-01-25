import { useGetProfileProgressQuery } from '../../../../services/tutorService';
import MainWrapper from '../../../components/MainWrapper';
import availabilityTable from '../../../constants/availabilityTable';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import IAvailabilityItem from '../interfaces/IAvailabilityItem';

const GeneralAvailability = () => {
    const { data: profileProgress } = useGetProfileProgressQuery();

    const renderTableCells = (column: string | IAvailabilityItem) => {
        if (typeof column === 'object') {
            return <td className={`${column.check ? 'table--availability--check' : 'table--availability--close'}`}>{column.check
                ? <i className="icon icon--base icon--check icon--primary"></i>
                : <i className="icon icon--base icon--close icon--grey"></i>}</td>;
        } else {
            return <td>{column}</td>;
        }
    };

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion percentage={profileProgress?.percentage} />

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
                        <table className="table table--availability">
                            {availabilityTable.map((row: (string | IAvailabilityItem)[]) => {
                                return (
                                    <tr>
                                        {
                                            row.map((column: string | IAvailabilityItem) => renderTableCells(column))
                                        }
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
