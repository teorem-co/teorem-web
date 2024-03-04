import ITutorItem from '../../../../interfaces/ITutorItem';
import { AiFillStar } from 'react-icons/ai';
import { t } from 'i18next';
import { PATHS } from '../../../routes';
import { Link } from 'react-router-dom';
import CustomSubjectList from './CustomSubjectList';

interface Props {
    tutor: ITutorItem;
}

export const TutorItemMobile = (props: Props) => {
    const { tutor } = props;
    return (
        <>
            <Link
                style={{ color: 'black' }} //maybe not use inline style
                to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
            >
                <div className="card--primary flex flex--row m-2 font__sm flex--ai--center">
                    <img className="mr-3 lessons-list__item__img lessons-list__item__img__search-tutor" src={tutor.profileImage} alt="" />

                    <div className="basic-info flex flex--col flex--jc--space-between w--100">
                        <div className="flex flex--row flex--jc--space-between mb-2 font__md">
                            <span className="d--b type--wgt--bold type--capitalize">
                                {tutor.firstName} {tutor.lastName.charAt(0)}.
                            </span>
                            <span>
                                <span className="type--wgt--bold font__sm">
                                    {tutor.minPrice !== tutor.maxPrice ? `EUR ${tutor.minPrice} - ${tutor.maxPrice}` : `EUR ${tutor.minPrice}`}
                                </span>
                                <span>/h</span>
                            </span>
                        </div>
                        <span className="d--b font__11">{tutor.currentOccupation}</span>

                        <div className="subject-containers flex flex--col flex--wrap mt-2 font__11 mb-1" style={{ fontSize: '9px' }}>
                            {tutor.subjects && <CustomSubjectList subjects={tutor.subjects} />}
                        </div>

                        <div className="flex flex--row flex--ai--center flex--jc--space-between font__11">
                            <span className="d--b">
                                {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                            </span>
                            {tutor.numberOfGrades > 0 ? (
                                <div className="flex flex--col">
                                    <div className="rating flex flex--row flex--ai--center">
                                        <AiFillStar color={'#7e6cf2'} size={15} />
                                        <span>{tutor.averageGrade}</span>
                                    </div>
                                    <span className="d--b">
                                        {tutor.numberOfGrades} {t('SEARCH_TUTORS.NUMBER_OF_REVIEWS')}
                                    </span>
                                </div>
                            ) : (
                                <span>
                                    <i>{t('SEARCH_TUTORS.NO_REVIEWS')}</i>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};
