import { FC } from 'react';

import { getUserId } from '../../../utils/getUserId';

interface Props {
    className?: string;
}

const ProfileHeader: FC<Props> = (props: Props) => {
    const { className } = props;

    const tutorId = getUserId();

    return (
        <div className={`flex--primary ${className}`}>
            <div className="type--lg type--wgt--bold flex--grow">
                My Profile
            </div>
            <div>
                {/* Preview profile has to be div, because of formik validation bug */}
                <a href={`/search-tutors/profile/${tutorId}`}>
                    <div className="btn btn--clear btn--base type--wgt--bold">
                        Preview Profile
                    </div>
                </a>
            </div>
        </div>
    );
};

export default ProfileHeader;
