import img from './math.png';


interface Props{
  id?: string,
  name: string,
  imgUrl: string,
  onClick?: () => void
  isSelected: boolean
}

export const SubjectCard = (props: Props) => {

  const {id, name, imgUrl, onClick, isSelected} = props;

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
        <img src={img} alt={name} className="subject-card-image"/>
        <span className="text-align--center type--wgt--bold mt-1">{name}</span>
      </div>
    </>
  );
};
