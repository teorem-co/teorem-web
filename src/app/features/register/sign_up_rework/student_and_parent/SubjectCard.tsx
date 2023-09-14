import img from '../../../../../assets/images/subjects/math.png';
import { t } from 'i18next';
import ISubject from '../../../../../interfaces/ISubject';


interface Props{
  subject: ISubject,
  onClick?: () => void,
  isSelected: boolean,
  className?: string
}

export const SubjectCard = (props: Props) => {
  const IMAGES_PATH = '/images/subjects/';
  const {subject, onClick, isSelected, className} = props;

  return (
    <>
      <div
        onClick={onClick}
        className={`${className} card--primary flex flex--col align--center cur--pointer scale-hover--scale-105 subject-card`}
        style={{
          borderRadius:'10px',
          backgroundColor: isSelected ? '#7e6cf2' : 'white',
          color: isSelected? 'white' : 'black',
          // border: isSelected ? '3px solid #7e6cf2' : 'none',
        }}>
        <img src={`${IMAGES_PATH}/${subject.abrv}.png`} alt={subject.name} className="subject-card-image"/>
        <span className="text-align--center mt-1">{t(`SUBJECTS.${subject.abrv.replaceAll('-', '').replace(' ', '').toLowerCase()}`)}</span>
      </div>
    </>
  );
};
