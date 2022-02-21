import { FC } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';

interface Props {
    className?: string;
}

const ProfileHeader: FC<Props> = (props: Props) => {
    const { className } = props;

    const tutorId = getUserId();
    const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';

    return (
        <div className={`flex--primary ${className}`}>
            <div className="type--lg type--wgt--bold flex--grow">My Profile</div>
            <div>
                {/* Preview profile has to be div, because of formik validation bug */}
                {userRole === 'tutor' && (
                    <Link to={`/search-tutors/profile/${tutorId}`} className="btn btn--clear btn--base type--wgt--bold">
                        Preview Profile
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
