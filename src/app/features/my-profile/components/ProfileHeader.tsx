import { FC } from 'react';

interface Props {
    className?: string;
}

const ProfileHeader: FC<Props> = (props: Props) => {
    const { className } = props;

    return (
        <div className={`flex--primary ${className}`}>
            <div className="type--lg type--wgt--bold flex--grow">
                My Profile
            </div>
            <div>
                {/* Preview profile has to be div, because of formik validation bug */}
                <div className="btn btn--clear btn--base type--wgt--bold">
                    Preview Profile
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
