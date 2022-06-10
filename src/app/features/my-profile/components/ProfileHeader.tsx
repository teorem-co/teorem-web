import { t } from 'i18next';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { RoleOptions } from '../../../../slices/roleSlice';
import { useAppSelector } from '../../../hooks';
import { PATHS } from '../../../routes';
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
            <div className="type--lg type--wgt--bold flex--grow">{t('MY_PROFILE.TITLE')}</div>
            <div>
                {/* Preview profile has to be div, because of formik validation bug */}
                {userRole === RoleOptions.Tutor && (
                    <Link to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(":tutorId", `${tutorId}`)}`} className="btn btn--clear btn--base type--wgt--bold"> 
                        {t('MY_PROFILE.PREVIEW')}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
