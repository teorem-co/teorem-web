import { t } from 'i18next';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { RoleOptions } from '../../../store/slices/roleSlice';
import { useAppSelector } from '../../../store/hooks';
import { PATHS } from '../../../routes';
import { getUserId } from '../../../utils/getUserId';
import {
  useLazyGetTutorByIdQuery,
} from '../../../store/services/tutorService';
import { useHistory } from 'react-router';

interface Props {
  className?: string;
}

const ProfileHeader: FC<Props> = (props: Props) => {
  const { className } = props;

  const tutorId = getUserId();
  const userRole: string = useAppSelector((state) => state.auth.user?.Role.abrv) || '';

  const [getTutor, { data: tutorData }] = useLazyGetTutorByIdQuery();

  useEffect(() => {
    if (userRole === RoleOptions.Tutor && !!tutorId) {
      getTutor(tutorId);
    }
  }, [userRole, tutorId]);

  const history = useHistory();

  return (
    <div className={`flex--primary ${className}`}>
      <div className="type--lg type--wgt--bold flex--grow">{t('MY_PROFILE.TITLE')}</div>
      <div>
        {/* Preview profile has to be div, because of formik validation bug */}
        {userRole === RoleOptions.Tutor && (
          <div>

            <button
              onClick={() =>{
                localStorage.removeItem('hideTutorIntro');
                history.push(PATHS.DASHBOARD);
              }}
              className="btn btn--clear btn--base type--wgt--bold"
            >
              {t('TUTOR_INTRO.BUTTON_RESTART')}
            </button>

            <Link
              to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', `${tutorData?.slug}`)}`}
              className="btn btn--clear btn--base type--wgt--bold"
            >
              {t('MY_PROFILE.PREVIEW')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
