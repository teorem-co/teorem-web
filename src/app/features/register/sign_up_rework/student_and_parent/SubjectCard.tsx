import img from './math.png';
import { t } from 'i18next';

interface ISubject{
  id:string,
  name:string,
  abrv:string,
  imgUrl:string
}

interface Props{
  subject: ISubject,
  onClick?: () => void
  isSelected: boolean
}

export const SubjectCard = (props: Props) => {

  const {subject, onClick, isSelected} = props;

  return (
    <>
      <div
        onClick={onClick}
        className="card--primary flex flex--col align--center cur--pointer scale-hover--scale-105 subject-card"
        style={{
          borderRadius:'10px',
          backgroundColor: isSelected ? '#7e6cf2' : 'white',
          color: isSelected? 'white' : 'black',
          // border: isSelected ? '3px solid #7e6cf2' : 'none',
        }}>
        <img src={subject.imgUrl} alt={subject.name} className="subject-card-image"/>
        <span className="text-align--center type--wgt--bold mt-1">{t(`SUBJECTS.${subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</span>
      </div>
    </>
  );
};
