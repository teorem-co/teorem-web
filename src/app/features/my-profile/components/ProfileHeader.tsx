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
                <button className="btn btn--clear btn--base type--wgt--bold">
                    Preview Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader;
